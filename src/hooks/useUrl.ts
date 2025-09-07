import { useEffect, useState } from "react";

const useUrl = () => {
    const [url, setUrl] = useState<URL | null>(null);

    useEffect(() => {
        // Инициализируем URL только на клиенте
        if (typeof window !== 'undefined') {
            setUrl(new URL(window.location.href));
        }
    }, []);

    return { url }
}

export default useUrl