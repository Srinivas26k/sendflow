
import { store } from '@/lib/store';

export async function GET() {
    return Response.json({ settings: store.settings });
}

export async function POST(request: Request) {
    const body = await request.json();
    store.settings = { ...store.settings, ...body };
    // In a real app we'd update env vars or DB here
    return Response.json({ success: true, message: 'Settings saved' });
}
