
import { store } from '@/lib/store';

export async function GET() {
    // Aggregate logs by date for the chart
    const dailyStatsMap = new Map<string, { sent: number, replied: number }>();

    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        dailyStatsMap.set(dateStr, { sent: 0, replied: 0 });
    }

    store.logs.forEach(log => {
        const dateStr = new Date(log.timestamp).toISOString().split('T')[0];
        if (dailyStatsMap.has(dateStr)) {
            const entry = dailyStatsMap.get(dateStr)!;
            if (log.event === 'email.sent') entry.sent++;
            if (log.event === 'email.received') entry.replied++;
        }
    });

    const dailyStats = Array.from(dailyStatsMap.entries()).map(([date, stats]) => ({
        date,
        sent: stats.sent,
        replied: stats.replied
    }));

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
