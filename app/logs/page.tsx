
"use client";

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function LogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetch(`/api/logs?page=${page}&limit=20`)
            .then(res => res.json())
            .then(data => {
                setLogs(data.logs || []);
                setTotalPages(data.pages || 1);
            });
    }, [page]);

    return (
        <DashboardLayout>
            <div className="page active">
                <div className="page-header">
                    <h1>Logs</h1>
                    <p className="subtitle">Full activity and event log</p>
                </div>

                <div className="table-container">
                    <table className="leads-table logs-table">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Event</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log.id}>
                                    <td className="log-time">{new Date(log.timestamp).toLocaleString()}</td>
                                    <td className="log-event">{log.event}</td>
                                    <td className="log-email">{log.details ? JSON.stringify(log.details) : '-'}</td>
                                </tr>
                            ))}
                            {logs.length === 0 && <tr><td colSpan={3} className="no-data">No logs found</td></tr>}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button className="page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                        <span style={{ padding: '0.5rem' }}>Page {page} of {totalPages}</span>
                        <button className="page-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
