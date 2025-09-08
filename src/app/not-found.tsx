import React, { Suspense } from 'react';

import Error404Page from "@/pages-components/Error404Page/Error404Page"
import { Metadata } from "next";
import Loader from '@/components/ui/Loader/Loader';

export const metadata: Metadata = {
    title: "Ошибка 404",
    description: "Ошибка 404, такой страницы нет",
};

const Error404 = () => {

    return (
        <Suspense fallback={<Loader isFade={true} />}>
            <Error404Page />
        </Suspense>
    )
}

export default Error404