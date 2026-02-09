'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Send, MessageCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  // Mock data - will be replaced with real data from API
  const stats = [
    { label: 'Total Leads', value: '2,450', icon: Mail, color: 'text-primary' },
    { label: 'Sent Today', value: '348', icon: Send, color: 'text-secondary' },
    { label: 'Replied', value: '54', icon: MessageCircle, color: 'text-accent' },
    { label: 'Pending', value: '2,048', icon: Clock, color: 'text-primary' },
  ];

  const campaigns = [
    {
      id: '1',
      name: 'Q1 Outreach',
      subject: 'Hey {{first_name}}',
      totalLeads: 500,
      sent: 450,
      replied: 23,
      status: 'active',
      createdAt: '2025-02-01',
    },
    {
      id: '2',
      name: 'SaaS Founders',
      subject: 'Quick question about {{company}}',
      totalLeads: 300,
      sent: 280,
      replied: 12,
      status: 'active',
      createdAt: '2025-01-28',
    },
    {
      id: '3',
      name: 'Tech Companies',
      subject: 'Partnership opportunity',
      totalLeads: 1000,
      sent: 850,
      replied: 19,
      status: 'paused',
      createdAt: '2025-01-15',
    },
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
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-6 border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color} opacity-50`} />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Campaigns Table */}
        <Card className="border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Recent Campaigns</h2>
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
                  <th className="text-left px-6 py-3 text-sm font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-border hover:bg-muted/30 transition">
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
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          campaign.status === 'active'
                            ? 'bg-accent/20 text-accent'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{campaign.createdAt}</td>
                    <td className="px-6 py-4 text-sm">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-primary">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Empty State Info */}
        {campaigns.length === 0 && (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground mb-6">Start by creating your first email campaign</p>
            <Link href="/compose">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Create Campaign
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
