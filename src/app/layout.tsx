'use client'

import React, { Suspense, useEffect } from 'react';

import "./globals.css";
import AuthGuard from "@/components/AuthGuard/AuthGuard";
import Layout from "@/components/Layout/Layout";
import { Provider } from "react-redux"
import store from "@/redux/store";
import Loader from '@/components/ui/Loader/Loader';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.ts')
          .then(registration => {
            console.log('ServiceWorker зарегистрирован:', registration);
          })
          .catch(error => {
            console.error('Ошибка регистрации ServiceWorker:', error);
          });
      });
    }
  }, []);

  return (
    <html lang="ru">
      <body>
        <Provider store={store}>
          <AuthGuard>
            <Suspense fallback={<Loader isFade={true} />}>
              <Layout>
                {children}
              </Layout>
            </Suspense>
          </AuthGuard>
        </Provider>
      </body>
    </html>
  );
}