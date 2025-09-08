import React, { Suspense } from 'react';

import LoginPage from "@/pages-components/LoginPage/LoginPage"
import { Metadata } from "next";
import Loader from '@/components/ui/Loader/Loader';

export const metadata: Metadata = {
    title: "Вход",
    description: "Войти в аккаунт - K-чат",
};

const Login = () => {

    return (
        <Suspense fallback={<Loader isFade={true} />}>
            <LoginPage />
        </Suspense>
    )
}

export default Login