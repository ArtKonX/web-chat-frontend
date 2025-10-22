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

    const registerServiceWorker = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/sw.js')
          .then(registration => {
            console.log('ServiceWorker зарегистрирован:', registration);
          })
          .catch(error => {
            console.error('Ошибка регистрации ServiceWorker:', error);
          });
      }
    };

    if (document.readyState === 'complete') {
      registerServiceWorker();
    } else {
      window.addEventListener('load', registerServiceWorker);
    }

    // Для правильного отображения футера и формы отправки
    // сообщения на ios и android
    window.addEventListener('resize', () => {

      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

    const vh = window.innerHeight * 0.01;

    document.documentElement.style.setProperty('--vh', `${vh}px`);

    return () => {
      window.removeEventListener('load', registerServiceWorker);
    };
  }, []);

  return (
    <html lang="ru">
      <body data-testid="body">
        <Provider store={store}>
          <Suspense fallback={<Loader isFade={true} />}>
            <AuthGuard>
              <Layout>
                {children}
              </Layout>
            </AuthGuard>
          </Suspense>
        </Provider>
      </body>
    </html>
  );
}