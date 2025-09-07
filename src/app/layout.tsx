'use client'

import React from 'react';

import "./globals.css";
import AuthGuard from "@/components/AuthGuard/AuthGuard";
import Layout from "@/components/Layout/Layout";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="ru">
      <Provider store={store}>
        <body>
          <AuthGuard>
            <Layout>
              {children}
            </Layout>
          </AuthGuard>
        </body>
      </Provider>
    </html>
  );
}