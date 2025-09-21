import { FetchCityFromCoorsProps } from "@/interfaces/position";

const fetchCityFromCoors = async (
    { position }: FetchCityFromCoorsProps
) => {
    try {
        // Проверяем что координаты переданы
        if (position) {
            const { latitude, longitude } = position;

            const response = await fetch(`/api/geocoors?lat=${latitude}&lon=${longitude}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const dataPlace = await response.json();

            // Возвращаем только город или населенный пункт
            return dataPlace.dataForCoors.address.town || dataPlace.dataForCoors.address.city
        }

    } catch (err) {
        console.error('Ошибка получения города по координатам: ', err)
    }
}

export default fetchCityFromCoors