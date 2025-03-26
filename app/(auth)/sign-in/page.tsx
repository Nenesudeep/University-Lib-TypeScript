'use client';
import AuthForm from '@/components/AuthForm';
import { signInWithCredentials } from '@/lib/actions/auth';
import { signInSchema } from '@/lib/validations';
import React from 'react';

const page = () => {
    return (
        // Add the return statement here in video he did not add but without adding I am not able to get this
        <AuthForm
            type="SIGN_IN"
            schema={signInSchema}
            defaultValues={{
                email: '',
                password: '',
            }}
            onSubmit={signInWithCredentials}
        />
    );
};

export default page;
