import React from 'react';

import AboutUsPage from "@/pages/AboutUsPage/AboutUsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "О K-Чат",
    description: "О веб-версии K-Чат",
};

const AboutUs = () => {

    return (
        <AboutUsPage />
    )
}

export default AboutUs