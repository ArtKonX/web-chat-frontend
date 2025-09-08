import React, { Suspense } from 'react';

import HomePage from "@/pages-components/HomePage/HomePage"
import { Metadata } from "next";
import Loader from '@/components/ui/Loader/Loader';

export const metadata: Metadata = {
  title: "Главная",
  description: "Главная страница веб-версии K-Чат",
};

const Home = () => {

  return (
    <Suspense fallback={<Loader isFade={true} />}>
      <HomePage />
    </Suspense>
  )
}

export default Home