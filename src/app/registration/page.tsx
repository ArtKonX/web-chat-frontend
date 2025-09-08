import React, { Suspense } from 'react';

import RegistrationPage from "@/pages-components/RegistarationPage/RegistarationPage"
import { Metadata } from "next";
import Loader from '@/components/ui/Loader/Loader';

export const metadata: Metadata = {
    title: "Регистрация",
    description: "Регистрация - K-чат",
};

const Registaration = () => {

    return (
        <Suspense fallback={<Loader isFade={true} />}>
            <RegistrationPage />
        </Suspense>
    )
}

export default Registaration