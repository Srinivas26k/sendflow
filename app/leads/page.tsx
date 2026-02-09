
"use client";

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { toast } from 'sonner';

export default function LeadsPage() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '50',
                status: filter,
                search
            });
            const res = await fetch(`/api/leads?${params}`);
            const data = await res.json();
            setLeads(data.leads || []);
            setTotalPages(data.pages || 1);
        } catch (e) {
            toast.error('Failed to load leads');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, [page, filter]);

    // Debounce search
    useEffect(() => {
        const timeout = setTimeout(() => {
            setPage(1);
            fetchLeads();
        }, 300);
        return () => clearTimeout(timeout);
    }, [search]);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure?')) return;
        try {
            const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Lead deleted');
                fetchLeads();
            } else {
                toast.error('Failed to delete');
            }
        } catch (e) {
            toast.error('Error deleting lead');
        }
    };

    return (
        <DashboardLayout>
            <div className="page active">
                <div className="page-header">
                    <h1>Lead Management</h1>
                    <p className="subtitle">Manage all your leads in one place</p>
                </div>

                <div className="leads-controls">
                    <input
                        type="text"
                        placeholder="Search by email, name..."
                        className="search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <div className="filter-tabs">
                        {['all', 'pending', 'sent', 'replied', 'failed'].map(f => (
                            <button
                                key={f}
                                className={`filter-tab ${filter === f ? 'active' : ''}`}
                                onClick={() => { setFilter(f); setPage(1); }}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="table-container">
                    <table className="leads-table">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Follow-ups</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="no-data">Loading...</td></tr>
                            ) : leads.length === 0 ? (
                                <tr><td colSpan={5} className="no-data">No leads found</td></tr>
                            ) : (
                                leads.map(lead => (
                                    <tr key={lead.id}>
                                        <td>{lead.email}</td>
                                        <td>{lead.data?.name || lead.data?.first_name || '-'}</td>
                                        <td><span className={`status-pill status-${lead.status.toLowerCase()}`}>{lead.status}</span></td>
                                        <td>{lead.followup_count}</td>
                                        <td>
                                            <button className="action-btn action-delete" onClick={() => handleDelete(lead.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
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
