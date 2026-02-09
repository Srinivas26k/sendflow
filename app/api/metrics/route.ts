
import { store } from '@/lib/store';

export async function GET() {
    return Response.json({
        sent_today: store.stats.sent,
        replies: store.stats.replies,
        failed: store.stats.failed,
        daily_limit: store.settings.dailyLimit,
        campaign_status: store.stats.status
    });
}
