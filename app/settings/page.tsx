
"use client";

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { toast } from 'sonner';

export default function SettingsPage() {
    const [settings, setSettings] = useState<any>({});

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.settings) setSettings(data.settings);
            });
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (res.ok) toast.success('Settings saved');
            else toast.error('Failed to save');
        } catch (e) {
            toast.error('Error saving settings');
        }
    };

    const handleChange = (field: string, value: any) => {
        setSettings((prev: any) => ({ ...prev, [field]: value }));
    };

    return (
        <DashboardLayout>
            <div className="page active">
                <div className="page-header">
                    <h1>Settings</h1>
                    <p className="subtitle">Configure license, sending limits, and email accounts</p>
                </div>

                <form onSubmit={handleSave} className="settings-form">
                    <div className="settings-grid">
                        <div className="settings-card">
                            <h3>License</h3>
                            <div className="setting-item">
                                <label>License key</label>
                                <input
                                    className="input-field"
                                    value={settings.licenseKey || ''}
                                    onChange={e => handleChange('licenseKey', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="settings-card">
                            <h3>Sending</h3>
                            <div className="setting-item">
                                <label>Daily email limit</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={settings.dailyLimit || 500}
                                    onChange={e => handleChange('dailyLimit', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="setting-item">
                                <label>Calendar Link</label>
                                <input
                                    type="url"
                                    className="input-field"
                                    value={settings.calendarLink || ''}
                                    onChange={e => handleChange('calendarLink', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary mt-4">Save settings</button>
                </form>
            </div>
        </DashboardLayout>
    );
}
