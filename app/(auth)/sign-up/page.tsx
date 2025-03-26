'use client';
import AuthForm from '@/components/AuthForm';
import { signUp } from '@/lib/actions/auth';
import { signUpSchema } from '@/lib/validations'; // Assuming you have a signUpSchema
import React from 'react';

const page = () => {
    return (
        // Add the return statement here
        <AuthForm
            type="SIGN_UP" // Correct the type to SIGN_UP
            schema={signUpSchema}
            defaultValues={{
                email: '',
                password: '',
                fullName: '',
                universityId: 0,
                universityCard: '',
            }}
            onSubmit={signUp}
        />
    );
};

export default page;
