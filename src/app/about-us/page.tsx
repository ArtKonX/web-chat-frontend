import React, { Suspense } from 'react';

import AboutUsPage from "@/pages-components/AboutUsPage/AboutUsPage";
import { Metadata } from "next";
import Loader from '@/components/ui/Loader/Loader';

export const metadata: Metadata = {
    title: "О K-Чат",
    description: "О веб-версии K-Чат",
};

const AboutUs = () => {

    return (
        <Suspense fallback={<Loader isFade={true} />}>
            <AboutUsPage />
        </Suspense>
    )
}

export default AboutUs