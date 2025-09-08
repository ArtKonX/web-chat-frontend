import React, { Suspense } from 'react';

import UpdateProfilePage from "@/pages-components/UpdateProfilePage/UpdateProfilePage"
import { Metadata } from "next";
import Loader from '@/components/ui/Loader/Loader';

export const metadata: Metadata = {
  title: "Редактировать",
  description: "Редактирование - K-чат",
};

const UpdateProfile = () => {

  return (
    <Suspense fallback={<Loader isFade={true} />}>
      <UpdateProfilePage />
    </Suspense>
  )
}

export default UpdateProfile