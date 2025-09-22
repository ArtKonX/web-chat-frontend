import axios from 'axios';
import { NextResponse, NextRequest } from 'next/server';
import { GET } from '../../app/api/file/route';

jest.mock('axios', () => ({
    get: jest.fn()
}));

describe('File API', () => {
    let mockResponse: NextResponse;
    let mockRequest: NextRequest;

    beforeEach(() => {
        // Создаем тестовый ответ от axios
        mockResponse = {
            data: new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]),
            headers: {
                'content-type': 'application/pdf'
            }
        } as unknown as NextResponse;

        // Создаем тестовый запрос
        mockRequest = new Request('http://localhost/api/file?fileUrl=test') as unknown as NextRequest;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    test('должен успешно получить файл', async () => {
        // Настраиваем мок для axios.get
        (axios.get as jest.Mock).mockResolvedValue(mockResponse);

        const response = await GET(mockRequest);

        expect(axios.get).toHaveBeenCalledWith(
            'test',
            expect.objectContaining({
                responseType: 'arraybuffer',
                httpsAgent: expect.any(Object)
            })
        );

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            data: 'SGVsbG8=', // base64 представление "Hello"
            contentType: 'application/pdf'
        });
    });

    test('должен вернуть ошибку 400 при отсутствии fileUrl', async () => {
        const requestWithoutUrl = new Request('http://localhost/api/file') as unknown as NextRequest;

        const response = await GET(requestWithoutUrl);

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({
            error: 'URL файла не передан'
        });
    });

    test('должен обработать ошибку при загрузке файла', async () => {
        (axios.get as jest.Mock).mockRejectedValue(new Error('Network Error'));

        const response = await GET(mockRequest);

        expect(response.status).toBe(500);
        expect(await response.json()).toEqual({
            error: 'Произошла ошибка при загрузке файла: Error: Network Error'
        });
    });
});