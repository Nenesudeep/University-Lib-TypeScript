'use server';

import { signIn } from '@/auth';
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import { hash } from 'bcryptjs';
import { error } from 'console';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import ratelimit from '../ratelimit';
import { redirect } from 'next/navigation';
import { workflowClient } from '../workflow';
import config from '../config';

export const signInWithCredentials = async (
    params: Pick<AuthCredentials, 'email' | 'password'>,
) => {
    const { email, password } = params;

    // adding rate limiting here
    const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1';
    const { success } = await ratelimit.limit(ip);

    if (!success) return redirect('/too-fast');

    try {
        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });
        if (result?.error) {
            return {
                success: false,
                error: result.error,
            };
        } else {
            return { success: true }; // here i was not adding the correct return for success
        }
    } catch (error) {
        console.log(error, 'SignIn Failed');
        return {
            success: false,
            error: 'SignIn Error',
        };
    }
};

export const signUp = async (params: AuthCredentials) => {
    const { fullName, email, universityCard, universityId, password } = params;

    // adding rate limiting here
    const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1';
    const { success } = await ratelimit.limit(ip);

    if (!success) return redirect('/too-fast');

    //check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
        return { success: false, error: 'User Already Exists' };
    }

    const hashPassword = await hash(password, 10);

    try {
        await db.insert(users).values({
            fullName,
            email,
            universityCard,
            universityId,
            password: hashPassword, // we are storing hash password for security reasons
        });

        // triggering the workflow for the user to remind him about our website
        await workflowClient.trigger({
            url:`${config.env.prodApiEndpoint}/api/workflow/onboarding`
        })

        await signInWithCredentials({email,password})
        // we need to create this if credentials are available

        return {
            success: true,
        };
    } catch (error) {
        console.log(error, 'SignUp error');
        return { success: false, error: 'SignUp error' };
    }
};
