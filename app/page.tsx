'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Mail, Zap, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">SendFlow</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/compose" className="text-muted-foreground hover:text-foreground transition">
              Create Campaign
            </Link>
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">
            Email Outreach Made Simple
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Upload your leads, write personalized emails with dynamic placeholders, and send at scale. Powered by Resend.
          </p>
          <Link href="/compose">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Create Your First Campaign
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16">
          <Card className="p-8 border-border">
            <Mail className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">CSV-Driven</h3>
            <p className="text-muted-foreground">
              Upload your leads as CSV. System auto-detects columns and creates dynamic placeholders.
            </p>
          </Card>

          <Card className="p-8 border-border">
            <Zap className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Instant Sending</h3>
            <p className="text-muted-foreground">
              Emails are sent instantly via Resend. No delays, no SMTP headaches, reliable delivery.
            </p>
          </Card>

          <Card className="p-8 border-border">
            <BarChart3 className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Track Everything</h3>
            <p className="text-muted-foreground">
              See sent/pending/replied status for each lead. Know exactly what's working.
            </p>
          </Card>
        </div>

        {/* How It Works */}
        <div className="bg-card border border-border rounded-lg p-12 my-16">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-4">
                1
              </div>
              <h4 className="font-semibold text-foreground mb-2">Upload CSV</h4>
              <p className="text-sm text-muted-foreground">
                Paste your leads with email, name, company, or any custom data.
              </p>
            </div>

            <div>
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-4">
                2
              </div>
              <h4 className="font-semibold text-foreground mb-2">Write Email</h4>
              <p className="text-sm text-muted-foreground">
                Use {"{{placeholder}}"} syntax. System shows available fields to insert.
              </p>
            </div>

            <div>
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-4">
                3
              </div>
              <h4 className="font-semibold text-foreground mb-2">Send Campaign</h4>
              <p className="text-sm text-muted-foreground">
                Click send. Emails are personalized and delivered instantly to all leads.
              </p>
            </div>

            <div>
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-4">
                4
              </div>
              <h4 className="font-semibold text-foreground mb-2">View Results</h4>
              <p className="text-sm text-muted-foreground">
                Dashboard shows delivery, reply status, and engagement metrics.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-6">Ready to send personalized emails at scale?</p>
          <Link href="/compose">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Start Now
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
