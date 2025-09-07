import Error404Page from "@/pages/Error404Page/Error404Page"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ошибка 404",
    description: "Ошибка 404, такой страницы нет",
};

const Error404 = () => {

    return (
        <Error404Page />
    )
}

export default Error404