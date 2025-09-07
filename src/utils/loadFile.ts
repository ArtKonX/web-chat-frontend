export default async function loadFile(url?: string, fileName?: string, type?: string): Promise<File | null> {
    try {

        if (url && fileName && type) {
            const response = await fetch(`/api/file?fileUrl=${encodeURIComponent(url)}`, { method: 'GET' });

            if (!response.ok) {
                throw new Error('Ошибка загрузки файла(')
            }

            const data = await response.json();

            // Декодируем base64 в строку символов
            const byteCharacters = atob(data.data);

            // массив для хранения частей
            const byteArrays = [];

            for (let offset = 0; offset < byteCharacters.length; offset += 0x10000) {
                // берем только часть равную 65536 в десятичной системе
                const slice = byteCharacters.slice(offset, offset + 0x10000);
                // Преобразуем в массив с числовыми кодами
                const byteNumbers = Array.from(slice, char => char.charCodeAt(0));
                // отправляем все в формате байтов
                byteArrays.push(new Uint8Array(byteNumbers));
            }

            // Создаем File с полученными данными
            // и возвращаем его же
            return new File(
                byteArrays,
                fileName,
                {
                    type,
                    lastModified: Date.now()
                }
            );
        }

        return null

    } catch (error) {
        console.error('Ошибка загрузки файла:', error);
        throw error;
    }
}