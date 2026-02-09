
import { store } from '@/lib/store';

export async function GET() {
    // Generate some mock historical data for the chart if empty
    // In a real app this would query the DB
    const dailyStats = [
        { date: '2023-10-01', sent: 120, replied: 5 },
        { date: '2023-10-02', sent: 150, replied: 8 },
        { date: '2023-10-03', sent: 200, replied: 12 },
        { date: '2023-10-04', sent: 180, replied: 10 },
        { date: '2023-10-05', sent: 220, replied: 15 },
    ];

    return Response.json({
        total_leads: store.leads.length,
        reply_rate: store.stats.sent > 0 ? ((store.stats.replies / store.stats.sent) * 100).toFixed(1) : 0,
        failure_rate: store.stats.sent > 0 ? ((store.stats.failed / store.stats.sent) * 100).toFixed(1) : 0,
        status_distribution: {
            pending: store.leads.filter(l => l.status === 'PENDING').length,
            sent: store.leads.filter(l => l.status === 'SENT').length,
            replied: store.leads.filter(l => l.status === 'REPLIED').length,
            failed: store.leads.filter(l => l.status === 'FAILED').length,
        },
        daily_stats: dailyStats
    });
}
