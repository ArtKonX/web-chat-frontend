// Функция для получения координат, возвращает промис с координатами

const getGeoCoors = async () => {

    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            console.error("Геолокация не поддерживается браузером. Установлен город Москва (по умолчанию)");
            resolve({ latitude: 55.7522, longitude: 37.6156 });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log('latitude, longitude', latitude, longitude)
                resolve({ latitude, longitude });
            },
            (err) => {
                console.error("Ошибка при получении координат: ", err);
                // Если ошибка, то возвращаем координаты Москвы по умолчанию
                resolve({ latitude: 55.7522, longitude: 37.6156 });
            }
        )
    })
}

export default getGeoCoors