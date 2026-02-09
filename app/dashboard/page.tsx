'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Send, MessageCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Campaign {
  id: string;
  name: string;
  subject: string;
  totalLeads: number;
  sent: number;
  replied: number;
  status: string;
  createdAt: string;
}

interface Stats {
  totalLeads: number;
  sentToday: number;
  replied: number;
  pending: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalLeads: 0,
    sentToday: 0,
    replied: 0,
    pending: 0,
  });
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch stats
        const statsRes = await fetch('/api/stats?type=stats');
        const statsData = await statsRes.json();
        setStats(statsData);

        // Fetch campaigns
        const campaignsRes = await fetch('/api/stats?type=campaigns');
        const campaignsData = await campaignsRes.json();
        setCampaigns(campaignsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    // Refresh every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const statsCards = [
    { label: 'Total Leads', value: stats.totalLeads.toString(), icon: Mail, color: 'text-primary' },
    { label: 'Sent Today', value: stats.sentToday.toString(), icon: Send, color: 'text-secondary' },
    { label: 'Replied', value: stats.replied.toString(), icon: MessageCircle, color: 'text-accent' },
    { label: 'Pending', value: stats.pending.toString(), icon: Clock, color: 'text-primary' },
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Track all your campaigns and leads</p>
          </div>
          <Link href="/compose">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Create Campaign
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-6 border-border">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </Card>
            );
          })}
        </div>

        {/* Campaigns Table */}
        <Card className="border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Recent Campaigns</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Campaign</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Total Leads</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Sent</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Replied</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      Loading campaigns...
                    </td>
                  </tr>
                ) : campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center">
                        <Mail className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No campaigns yet</h3>
                        <p className="text-muted-foreground mb-4">Start by creating your first email campaign</p>
                        <Link href="/compose">
                          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            Create Campaign
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-muted/30 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground">{campaign.name}</p>
                          <p className="text-xs text-muted-foreground mt-1 truncate max-w-xs">{campaign.subject}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{campaign.totalLeads}</td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {campaign.sent} ({Math.round((campaign.sent / campaign.totalLeads) * 100)}%)
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{campaign.replied}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${campaign.status === 'active'
                              ? 'bg-accent/20 text-accent'
                              : 'bg-muted text-muted-foreground'
                            }`}
                        >
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(campaign.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
