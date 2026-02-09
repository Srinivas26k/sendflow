
import { store } from '@/lib/store';

export async function GET() {
    return Response.json({ templates: store.templates });
}

export async function POST(request: Request) {
    const body = await request.json();
    store.templates = body.templates;
    return Response.json({ success: true, message: 'Templates saved' });
}
