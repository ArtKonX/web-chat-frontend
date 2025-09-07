import LoginPage from "@/pages/LoginPage/LoginPage"
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Вход",
    description: "Войти в аккаунт - K-чат",
};

const Login = () => {

    return (
        <LoginPage />
    )
}

export default Login