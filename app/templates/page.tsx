
"use client";

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { toast } from 'sonner';

export default function TemplatesPage() {
    const [templates, setTemplates] = useState({
        initial: { subject: '', body: '' },
        followup1: { subject: '', body: '' },
        followup2: { subject: '', body: '' },
        reply: { subject: '', body: '' }
    });

    useEffect(() => {
        fetch('/api/templates')
            .then(res => res.json())
            .then(data => {
                if (data.templates) setTemplates(data.templates);
            });
    }, []);

    const handleSave = async () => {
        try {
            const res = await fetch('/api/templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ templates })
            });
            if (res.ok) toast.success('Templates saved');
            else toast.error('Failed to save');
        } catch (e) {
            toast.error('Error saving templates');
        }
    };

    const updateTemplate = (type: keyof typeof templates, field: 'subject' | 'body', value: string) => {
        setTemplates(prev => ({
            ...prev,
            [type]: { ...prev[type], [field]: value }
        }));
    };

    return (
        <DashboardLayout>
            <div className="page active">
                <div className="page-header">
                    <h1>Email Templates</h1>
                    <p className="subtitle">Customize your outreach messages</p>
                </div>

                <div className="template-grid">
                    <div className="template-column">
                        <h3>Initial email</h3>
                        <label>Subject</label>
                        <input
                            className="input-field"
                            value={templates.initial.subject}
                            onChange={e => updateTemplate('initial', 'subject', e.target.value)}
                        />
                        <label>Body</label>
                        <textarea
                            className="textarea-field"
                            rows={6}
                            value={templates.initial.body}
                            onChange={e => updateTemplate('initial', 'body', e.target.value)}
                        />
                    </div>

                    <div className="template-column">
                        <h3>Follow-up 1 (after 3 days)</h3>
                        <label>Subject</label>
                        <input
                            className="input-field"
                            value={templates.followup1.subject}
                            onChange={e => updateTemplate('followup1', 'subject', e.target.value)}
                        />
                        <label>Body</label>
                        <textarea
                            className="textarea-field"
                            rows={6}
                            value={templates.followup1.body}
                            onChange={e => updateTemplate('followup1', 'body', e.target.value)}
                        />
                    </div>

                    <div className="template-column">
                        <h3>Auto-reply</h3>
                        <label>Subject</label>
                        <input
                            className="input-field"
                            value={templates.reply.subject}
                            onChange={e => updateTemplate('reply', 'subject', e.target.value)}
                        />
                        <label>Body</label>
                        <textarea
                            className="textarea-field"
                            rows={6}
                            value={templates.reply.body}
                            onChange={e => updateTemplate('reply', 'body', e.target.value)}
                        />
                    </div>
                </div>

                <button className="btn btn-save" onClick={handleSave}>Save templates</button>
            </div>
        </DashboardLayout>
    );
}
