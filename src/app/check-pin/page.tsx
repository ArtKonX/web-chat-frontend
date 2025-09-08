import React, { Suspense } from 'react';

import CheckPinPage from "@/pages-components/CheckPinPage/CheckPinPage"
import { Metadata } from "next";
import Loader from '@/components/ui/Loader/Loader';

export const metadata: Metadata = {
    title: "Пин-код",
    description: "Ввести пин-код для двойной защиты - K-чат",
};

const CheckPin = () => {

    return (
        <Suspense fallback={<Loader isFade={true} />}>
            <CheckPinPage />
        </Suspense>
    )
}

export default CheckPin