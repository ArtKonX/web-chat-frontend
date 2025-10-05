import { NextRequest } from 'next/server'; 
import { GET } from '../../app/api/geocoors/route';

const fetchMock = jest.fn();

describe('Geocoors API', () => {
    beforeEach(() => {
        fetchMock.mockClear();
        global.fetch = fetchMock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('должен успешно получить данные по координатам', async () => {
        const mockData = {
            display_name: 'Москва, Россия',
            lat: '55.7558',
            lon: '37.6173'
        };

        fetchMock.mockResolvedValue({
            ok: true,
            status: 200,
            json: () => Promise.resolve(mockData)
        });

        const request = new NextRequest('http://localhost/api/geocoors?lat=55.7558&lon=37.6173');
        const response = await GET(request);

        expect(fetchMock).toHaveBeenCalledWith(
            'https://nominatim.openstreetmap.org/reverse?format=json&lat=55.7558&lon=37.6173&zoom=18&addressdetails=1',
            expect.objectContaining({
                headers: {
                    'User-Agent': 't-chat-frontend'
                }
            })
        );

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            dataForCoors: mockData
        });
    });

    test('должен обработать ошибку при неудачном ответе от API', async () => {
        fetchMock.mockResolvedValue({
            ok: false,
            status: 500,
            json: () => Promise.resolve({ error: 'Server Error' })
        });

        const request = new NextRequest('http://localhost/api/geocoors?lat=55.7558&lon=37.6173');
        const response = await GET(request);

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            error: 'Ошибка получения информации о местоположении('
        });
    });

    test('должен корректно обрабатывать пустой ответ от API', async () => {
        fetchMock.mockResolvedValue({
            ok: true,
            status: 200,
            json: () => Promise.resolve({})
        });

        const request = new NextRequest('http://localhost/api/geocoors?lat=55.7558&lon=37.6173');
        const response = await GET(request);

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            dataForCoors: {}
        });
    });

    test('должен корректно обрабатывать некорректный JSON', async () => {
        fetchMock.mockResolvedValue({
            ok: true,
            status: 200,
            json: () => Promise.reject(new Error('Invalid JSON'))
        });

        const request = new NextRequest('http://localhost/api/geocoors?lat=55.7558&lon=37.6173');
        const response = await GET(request);

        expect(response.status).toBe(500);
        expect(await response.json()).toEqual({
            error: "Ошибка при запросе на получение местоположения Error: Invalid JSON"
        });
    });
});