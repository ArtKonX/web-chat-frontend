import React, { Suspense } from 'react';

import ProfilePage from "@/pages-components/ProfilePage/ProfilePage"
import { Metadata } from "next";
import Loader from '@/components/ui/Loader/Loader';

export const metadata: Metadata = {
    title: "Профиль",
    description: "Личный кабинет - K-чат",
};

const Profile = () => {

    return (
        <Suspense fallback={<Loader isFade={true} />}>
            <ProfilePage />
        </Suspense>
    )
}

export default Profile