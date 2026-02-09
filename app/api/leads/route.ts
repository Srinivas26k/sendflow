
import { store } from '@/lib/store';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';

    let leads = store.leads;

    // Filter by status
    if (status !== 'all') {
        leads = leads.filter(l => l.status.toLowerCase() === status.toLowerCase());
    }

    // Filter by search
    if (search) {
        const lowerSearch = search.toLowerCase();
        leads = leads.filter(l =>
            l.email.toLowerCase().includes(lowerSearch) ||
            Object.values(l.data).some(v => v.toLowerCase().includes(lowerSearch))
        );
    }

    // Pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const pagedLeads = leads.slice(start, end);

    return Response.json({
        leads: pagedLeads,
        page,
        pages: Math.ceil(leads.length / limit),
        total: leads.length
    });
}
