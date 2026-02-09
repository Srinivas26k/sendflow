
import { store } from '@/lib/store';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const leadId = parseInt(id);

    const initialLength = store.leads.length;
    store.leads = store.leads.filter(l => l.id !== leadId);

    if (store.leads.length < initialLength) {
        return Response.json({ success: true, message: 'Lead deleted' });
    } else {
        return Response.json({ detail: 'Lead not found' }, { status: 404 });
    }
}
