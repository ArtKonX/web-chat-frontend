import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const lat = url.searchParams.get('lat');
        const lon = url.searchParams.get('lon');

        // Если какой то координаты или координат нет возвращаем 400 статус
        if (!lat || !lon) {
            return NextResponse.json(
                { error: 'Не переданы координаты или координата' },
                { status: 400 }
            );
        }

        // Пытаемся получить местоположение по координатам
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
            {
                headers: {
                    'User-Agent': 't-chat-frontend', // ОБЯЗАТЕЛЬНО укажите здесь название вашего приложения
                }
            }
        )

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Ошибка получения информации о местоположении(', }
            );
        }

        const dataForCoors = await response.json();

        // Если все ок, то отправляем данные
        return NextResponse.json({
            dataForCoors
        })

    } catch (err) {
        return NextResponse.json(
            { error: `Ошибка при запросе на получение местоположения ${err}` },
            { status: 500 }
        );
    }
}