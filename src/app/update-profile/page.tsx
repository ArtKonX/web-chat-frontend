import UpdateProfilePage from "@/pages/UpdateProfilePage/UpdateProfilePage"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Редактировать",
  description: "Редактирование - K-чат",
};

const UpdateProfile = () => {

    return (
        <UpdateProfilePage />
    )
}

export default UpdateProfile