import ProfilePage from "@/pages/ProfilePage/ProfilePage"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Профиль",
    description: "Личный кабинет - K-чат",
};

const Profile = () => {

    return (
        <ProfilePage />
    )
}

export default Profile