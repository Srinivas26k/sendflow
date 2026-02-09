
import { store } from '@/lib/store';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const start = (page - 1) * limit;
    const end = start + limit;

    const logs = store.logs.slice(start, end);

    return Response.json({
        logs,
        page,
        pages: Math.ceil(store.logs.length / limit),
        total: store.logs.length
    });
}
