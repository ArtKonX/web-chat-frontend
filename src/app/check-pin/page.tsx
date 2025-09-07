import CheckPinPage from "@/pages/CheckPinPage/CheckPinPage"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Пин-код",
    description: "Ввести пин-код для двойной защиты - K-чат",
};

const CheckPin = () => {

    return (
        <CheckPinPage />
    )
}

export default CheckPin