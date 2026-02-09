
import { store } from '@/lib/store';

export async function POST(request: Request, { params }: { params: Promise<{ action: string }> }) {
    const { action } = await params;

    if (action === 'start') {
        store.stats.status = 'RUNNING';
        store.addLog('Campaign started');
        return Response.json({ message: 'Campaign started' });
    } else if (action === 'pause') {
        store.stats.status = 'PAUSED';
        store.addLog('Campaign paused');
        return Response.json({ message: 'Campaign paused' });
    } else if (action === 'stop') {
        store.stats.status = 'STOPPED';
        store.addLog('Campaign stopped');
        return Response.json({ message: 'Campaign stopped' });
    }

    return Response.json({ detail: 'Invalid action' }, { status: 400 });
}
