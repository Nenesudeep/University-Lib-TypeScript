import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import { sendEmail } from '@/lib/workflow';
import { serve } from '@upstash/workflow/nextjs';
import { eq } from 'drizzle-orm';

type UserState = "non-active" | "active"

type InitialData = {
    email: string;
    fullName : string;
};

const ONE_DAY_IN_MILLISECOND = 24 * 60 * 60 * 1000
const THREE_DAY_IN_MILLISECOND = 3 * ONE_DAY_IN_MILLISECOND
const THIRTY_DAY_IN_MILLISECOND = 30 * ONE_DAY_IN_MILLISECOND

// Promise defines that what function must return just like the function above I have defined the UserState
const getUserState = async(email : string):Promise<UserState> => {
    const user = await db.select()
                         .from(users)
                         .where(eq(users.email,email))
                         .limit(1)
    if(user.length === 0) return "non-active"
    
    const lastActivityDate = new Date(user[0].lastActivityDate!); // getting the lastActivity date from user
    const now = new Date();
    const timeDifference = now.getTime() - lastActivityDate.getTime() // getting the time difference

    if(timeDifference>THREE_DAY_IN_MILLISECOND && timeDifference<=THIRTY_DAY_IN_MILLISECOND){
        return "non-active"
    }

    return "active"
}

export const { POST } = serve<InitialData>(async (context) => {
    const { email, fullName } = context.requestPayload;

    // welcome email
    await context.run('new-signup', async () => {
        await sendEmail({
            email,
            message:"Welcome to the platform",
            subject:`Hi ${fullName} How are you`
        }
        );
    });

    await context.sleep('wait-for-3-days', 60 * 60 * 24 * 3);

    while (true) {
        const state = await context.run('check-user-state', async () => {
            return await getUserState(email);
        });

        if (state === 'non-active') {
            await context.run('send-email-non-active', async () => {
                await sendEmail({
                    email,
                    message : "are you here",
                    subject : `Hey we are missing you ${fullName}`
                });
            });
        } else if (state === 'active') {
            await context.run('send-email-active', async () => {
                await sendEmail({
                    email,
                    message:"Welcome Back",
                    subject:`Welcome back ${fullName}`
                });
            });
        }

        await context.sleep('wait-for-1-month', 60 * 60 * 24 * 30);
    }
});


