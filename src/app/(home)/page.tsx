import HomePage from "@/pages/HomePage/HomePage"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Главная",
  description: "Главная страница веб-версии K-Чат",
};

const Home = () => {

    return (
        <HomePage />
    )
}

export default Home