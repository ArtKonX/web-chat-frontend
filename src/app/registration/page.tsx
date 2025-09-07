import RegistrationPage from "@/pages/RegistarationPage/RegistarationPage"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Регистрация",
    description: "Регистрация - K-чат",
};

const Registaration = () => {

    return (
        <RegistrationPage />
    )
}

export default Registaration