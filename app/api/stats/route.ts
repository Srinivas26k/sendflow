import { NextRequest } from 'next/server';
import { campaigns, stats } from '@/lib/campaign-stats';

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const type = url.searchParams.get('type');

    if (type === 'stats') {
        return Response.json(stats);
    }

    if (type === 'campaigns') {
        const campaignList = Array.from(campaigns.values())
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return Response.json(campaignList);
    }

    return Response.json({ error: 'Invalid type parameter' }, { status: 400 });
}
