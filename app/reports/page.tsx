
"use client";

import DashboardLayout from '@/components/DashboardLayout';
import { toast } from 'sonner';

export default function ReportsPage() {
    const handleSendReport = () => {
        toast.success('Report sent (simulated)');
    };

    return (
        <DashboardLayout>
            <div className="page active">
                <div className="page-header">
                    <h1>Reports</h1>
                    <p className="subtitle">Daily analytics report — preview and send</p>
                </div>

                <div className="reports-actions">
                    <button className="btn btn-primary" onClick={handleSendReport}>Send report now</button>
                </div>

                <div className="report-preview-card">
                    <h3>Report preview</h3>
                    <p className="text-muted">This is a preview of the daily email report.</p>
                    <div className="report-preview-stats mt-4">
                        <div className="rp-stat"><span className="rp-value">0</span> Sent today</div>
                        <div className="rp-stat"><span className="rp-value">0</span> Replied today</div>
                        <div className="rp-stat"><span className="rp-value">0%</span> Reply rate</div>
                        <div className="rp-stat"><span className="rp-value">0</span> Total leads</div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
