
"use client";

import { useEffect, useState, useRef } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Chart } from 'chart.js/auto'; // Ensure chart.js is installed

export default function AnalyticsPage() {
    const [stats, setStats] = useState<any>({});
    const timelineChartRef = useRef<HTMLCanvasElement>(null);
    const statusChartRef = useRef<HTMLCanvasElement>(null);
    const charts = useRef<any>({});

    useEffect(() => {
        fetch('/api/analytics')
            .then(res => res.json())
            .then(data => {
                setStats(data);
                initCharts(data);
            });

        return () => {
            Object.values(charts.current).forEach((chart: any) => chart.destroy());
        };
    }, []);

    const initCharts = (data: any) => {
        if (timelineChartRef.current) {
            if (charts.current.timeline) charts.current.timeline.destroy();
            charts.current.timeline = new Chart(timelineChartRef.current, {
                type: 'line',
                data: {
                    labels: data.daily_stats?.map((d: any) => d.date) || [],
                    datasets: [
                        {
                            label: 'Sent',
                            data: data.daily_stats?.map((d: any) => d.sent) || [],
                            borderColor: '#2563eb',
                            backgroundColor: 'rgba(37, 99, 235, 0.1)',
                            fill: true
                        },
                        {
                            label: 'Replied',
                            data: data.daily_stats?.map((d: any) => d.replied) || [],
                            borderColor: '#059669',
                            backgroundColor: 'rgba(5, 150, 105, 0.1)',
                            fill: true
                        }
                    ]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }

        if (statusChartRef.current) {
            if (charts.current.status) charts.current.status.destroy();
            charts.current.status = new Chart(statusChartRef.current, {
                type: 'doughnut',
                data: {
                    labels: ['Pending', 'Sent', 'Replied', 'Failed'],
                    datasets: [{
                        data: [
                            data.status_distribution?.pending || 0,
                            data.status_distribution?.sent || 0,
                            data.status_distribution?.replied || 0,
                            data.status_distribution?.failed || 0
                        ],
                        backgroundColor: ['#fef3c7', '#bfdbfe', '#bbf7d0', '#fecaca']
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }
    };

    return (
        <DashboardLayout>
            <div className="page active">
                <div className="page-header">
                    <h1>Analytics</h1>
                    <p className="subtitle">Insights and performance over time</p>
                </div>

                <div className="analytics-stats">
                    <div className="stat-card">
                        <div className="stat-label">Total Leads</div>
                        <div className="stat-value">{stats.total_leads || 0}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Reply Rate</div>
                        <div className="stat-value">{stats.reply_rate || 0}%</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Failure Rate</div>
                        <div className="stat-value">{stats.failure_rate || 0}%</div>
                    </div>
                </div>

                <div className="charts-grid">
                    <div className="chart-card" style={{ height: '300px' }}>
                        <h3>Emails Sent Over Time</h3>
                        <canvas ref={timelineChartRef}></canvas>
                    </div>
                    <div className="chart-card" style={{ height: '300px' }}>
                        <h3>Lead Status Distribution</h3>
                        <canvas ref={statusChartRef}></canvas>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
