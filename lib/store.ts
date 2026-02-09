
export interface Lead {
    id: number;
    email: string;
    status: 'PENDING' | 'SENT' | 'REPLIED' | 'FAILED';
    last_sent_at?: string;
    followup_count: number;
    data: Record<string, string>; // Extra CSV columns
}

export interface Settings {
    licenseKey: string;
    emailQueueInterval: number;
    replyCheckInterval: number;
    dailyLimit: number;
    minDelay: number;
    maxDelay: number;
    pauseEvery: number;
    pauseMin: number;
    pauseMax: number;
    calendarLink: string;
    emailAccounts: any[]; // Simplified for now
}

export interface Templates {
    initial: { subject: string; body: string };
    followup1: { subject: string; body: string };
    followup2: { subject: string; body: string };
    reply: { subject: string; body: string };
}

export interface Log {
    id: string;
    timestamp: string;
    email?: string;
    event: string;
    details?: any;
}

export interface CampaignStats {
    sent: number;
    replies: number;
    failed: number;
    status: 'RUNNING' | 'PAUSED' | 'STOPPED';
}

class Store {
    private static instance: Store;

    public leads: Lead[] = [];
    public stats: CampaignStats = { sent: 0, replies: 0, failed: 0, status: 'STOPPED' };
    public settings: Settings = {
        licenseKey: '',
        emailQueueInterval: 300,
        replyCheckInterval: 300,
        dailyLimit: 500,
        minDelay: 60,
        maxDelay: 120,
        pauseEvery: 20,
        pauseMin: 5,
        pauseMax: 10,
        calendarLink: '',
        emailAccounts: []
    };
    public templates: Templates = {
        initial: { subject: '', body: '' },
        followup1: { subject: '', body: '' },
        followup2: { subject: '', body: '' },
        reply: { subject: '', body: '' }
    };
    public logs: Log[] = [];

    private constructor() { }

    public static getInstance(): Store {
        if (!Store.instance) {
            Store.instance = new Store();
        }
        return Store.instance;
    }

    public addLog(event: string, email?: string, details?: any) {
        this.logs.unshift({
            id: Math.random().toString(36).substring(7),
            timestamp: new Date().toISOString(),
            event,
            email,
            details
        });
        // Keep only last 1000 logs
        if (this.logs.length > 1000) this.logs = this.logs.slice(0, 1000);
    }
}

export const store = Store.getInstance();
