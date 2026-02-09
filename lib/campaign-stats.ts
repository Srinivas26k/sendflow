// Simple in-memory storage for campaign stats
// This will reset on server restart, but works as MVP
// TODO: Replace with database persistence later

export interface CampaignData {
    id: string;
    name: string;
    subject: string;
    totalLeads: number;
    sent: number;
    replied: number;
    failed: number;
    skipped: number;
    status: string;
    createdAt: string;
}

export const campaigns = new Map<string, CampaignData>();

export const stats = {
    totalLeads: 0,
    sentToday: 0,
    replied: 0,
    pending: 0,
};

// Update campaign stats
export function updateCampaignStats(campaignData: {
    campaignId: string;
    name?: string;
    subject: string;
    totalLeads: number;
    sent: number;
    replied?: number;
    failed: number;
    skipped: number;
}) {
    const existing = campaigns.get(campaignData.campaignId);

    campaigns.set(campaignData.campaignId, {
        id: campaignData.campaignId,
        name: campaignData.name || `Campaign ${campaigns.size + 1}`,
        subject: campaignData.subject,
        totalLeads: campaignData.totalLeads,
        sent: campaignData.sent,
        replied: existing?.replied || 0,
        failed: campaignData.failed,
        skipped: campaignData.skipped,
        status: 'active',
        createdAt: existing?.createdAt || new Date().toISOString(),
    });

    // Update global stats
    recalculateStats();
}

export function incrementReplies(campaignId?: string) {
    if (campaignId && campaigns.has(campaignId)) {
        const campaign = campaigns.get(campaignId)!;
        campaign.replied++;
    } else {
        // If no campaign ID, increment the most recent campaign
        const campaignArray = Array.from(campaigns.values());
        if (campaignArray.length > 0) {
            campaignArray[campaignArray.length - 1].replied++;
        }
    }
    recalculateStats();
}

function recalculateStats() {
    const campaignArray = Array.from(campaigns.values());
    stats.totalLeads = campaignArray.reduce((sum, c) => sum + c.totalLeads, 0);
    stats.sentToday = campaignArray.reduce((sum, c) => sum + c.sent, 0);
    stats.replied = campaignArray.reduce((sum, c) => sum + c.replied, 0);
    stats.pending = stats.totalLeads - stats.sentToday;
}
