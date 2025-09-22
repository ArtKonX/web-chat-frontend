import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';
import { Agent } from 'https';

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const fileUrl = url.searchParams.get('fileUrl');

        if (!fileUrl) {
            return NextResponse.json(
                { error: 'URL файла не передан' },
                { status: 400 }
            );
        }

        const httpsAgent = new Agent({
            rejectUnauthorized: false
        });

        const response = await axios.get(decodeURIComponent(fileUrl), {
            httpsAgent,
            responseType: 'arraybuffer'
        });

        return NextResponse.json({
            data: Buffer.from(response.data).toString('base64'),
            contentType: response.headers['content-type'] || 'application/octet-stream'
        });

    } catch (err) {
        return NextResponse.json(
            { error: `Произошла ошибка при загрузке файла: ${err}` },
            { status: 500 }
        );
    }
}