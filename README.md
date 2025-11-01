# Веб-система обмена сообщениями с публикацией геопривязки

![CI](https://github.com/ArtKonX/web-chat-frontend/actions/workflows/web.yml/badge.svg)

[Ссылка на Демо Vercel](https://web-chat-frontend-sable.vercel.app/?tab=users)

## Описание
Клиентская часть веб-системы обмена сообщениями с публикацией геопривязки.

## Технологический стек
1. Next.js
2. Redux Toolkit with RTK Query
3. Redux Persist
4. Scss
5. Tailwind
6. IndexedDB
7. TypeScript

## Настройка и запуск

1. Клонирование репозитория
```
git clone https://github.com/ArtKonX/web-chat-frontend.git
```

2. Установка зависимостей
```
npm install
```

3. Создайте файл .env.local в корне проекта
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:7070
NEXT_PUBLIC_BACKEND_URL_WS=ws://localhost:7070/ws
```

4. Запуск
```
npm run dev
```