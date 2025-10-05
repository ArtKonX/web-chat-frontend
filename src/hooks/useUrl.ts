import { useEffect, useState } from "react";

const useUrl = () => {
    const [url, setUrl] = useState<URL | null>(null);

    useEffect(() => {
        // Функция для обновления URL
        const updateUrl = () => {
            if (typeof window !== 'undefined') {
                setUrl(new URL(window.location.href));
            }
        };

        // Инициализируем URL при монтировании
        updateUrl();

        // Добавляем слушатель на изменения location
        window.addEventListener('popstate', updateUrl);
        window.addEventListener('hashchange', updateUrl);

        return () => {
            window.removeEventListener('popstate', updateUrl);
            window.removeEventListener('hashchange', updateUrl);
        };
    }, []);

    return { url }
}

export default useUrl