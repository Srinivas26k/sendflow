
"use client";

import { useEffect, useState, useRef } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Play, Pause, Square, FolderUp, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    sent: 0,
    daily_limit: 500,
    replies: 0,
    failed: 0,
    status: 'STOPPED'
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/metrics');
      const data = await res.json();
      setMetrics({
        sent: data.sent_today ?? 0,
        daily_limit: data.daily_limit || 500,
        replies: data.replies ?? 0,
        failed: data.failed ?? 0,
        status: data.campaign_status || 'STOPPED'
      });
    } catch (e) {
      console.error(e);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs?page=1&limit=5');
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMetrics();
    fetchLogs();
    const interval = setInterval(() => {
      fetchMetrics();
      fetchLogs();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCampaignAction = async (action: 'start' | 'pause' | 'stop') => {
    try {
      const res = await fetch(`/api/campaign/${action}`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || `Campaign ${action}ed`);
        fetchMetrics();
      } else {
        toast.error(data.detail || 'Action failed');
      }
    } catch (e) {
      toast.error('Failed to perform action');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      document.getElementById('csvFile')?.click();
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      const res = await fetch('/api/leads/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setFile(null);
        fetchMetrics();
      } else {
        toast.error(data.detail || 'Upload failed');
      }
    } catch (e) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RUNNING': return '#059669';
      case 'PAUSED': return '#d97706';
      case 'STOPPED': return '#dc2626';
      default: return '#71717a';
    }
  };

  const percentage = metrics.daily_limit > 0 ? (metrics.sent / metrics.daily_limit) * 100 : 0;

  return (
    <DashboardLayout>
      <div className="page active">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p className="subtitle">Your dedicated 24/7 outreach engine</p>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">SENT TODAY:</div>
            <div className="metric-value">{metrics.sent} / {metrics.daily_limit}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">REPLIES:</div>
            <div className="metric-value">{metrics.replies}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">FAILED:</div>
            <div className="metric-value">{metrics.failed}</div>
          </div>
          <div className="metric-card status-card">
            <div className="metric-label">CAMPAIGN STATUS</div>
            <div
              className="status-badge"
              style={{
                backgroundColor: getStatusColor(metrics.status) + '20', // 20% opacity
                color: getStatusColor(metrics.status)
              }}
            >
              {metrics.status}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-header">
            <span>Daily Progress</span>
            <span>{Math.round(percentage)}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>

        {/* Command Center */}
        <div className="command-section">
          <h2>Campaign</h2>
          <div className="button-grid">
            <button type="button" className="btn btn-start" onClick={() => handleCampaignAction('start')}>
              <Play className="btn-icon" /> Start
            </button>
            <button type="button" className="btn btn-pause" onClick={() => handleCampaignAction('pause')}>
              <Pause className="btn-icon" /> Pause
            </button>
            <button type="button" className="btn btn-stop" onClick={() => handleCampaignAction('stop')}>
              <Square className="btn-icon" /> Stop
            </button>
          </div>
        </div>

        {/* Upload Leads */}
        <div className="upload-section">
          <h2>Upload leads</h2>
          <div className="upload-box">
            <div
              className="upload-area"
              onClick={() => document.getElementById('csvFile')?.click()}
            >
              <FolderUp className="upload-icon mx-auto" aria-hidden="true" />
              <p>{file ? file.name : 'Drag and drop CSV here, or click to browse'}</p>
              <input
                type="file"
                id="csvFile"
                accept=".csv"
                style={{ display: 'none' }}
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
              />
            </div>
            <button type="button" className="btn btn-upload" onClick={handleUpload} disabled={uploading}>
              <Upload className="btn-icon" aria-hidden="true" /> {uploading ? 'Uploading...' : 'Upload CSV'}
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="logs-section">
          <h2>Recent activity</h2>
          <div className="logs-container">
            {logs.length > 0 ? logs.map(log => (
              <div key={log.id} className="log-entry">
                <span className="log-event">{log.event}</span>
                <span className="log-timestamp">{log.timestamp.substring(11, 16)}</span>
              </div>
            )) : <p className="no-data">No activity yet</p>}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
