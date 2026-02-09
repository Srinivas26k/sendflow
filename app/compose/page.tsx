'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { parseCSV, validateCSVHasEmail } from '@/lib/csv';
import { extractPlaceholders } from '@/lib/placeholder';
import { Upload, Send } from 'lucide-react';

export default function ComposePage() {
  const [csvText, setCsvText] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const processCSVText = (text: string) => {
    try {
      if (text.trim()) {
        const { headers: parsedHeaders } = parseCSV(text);
        if (!validateCSVHasEmail(parsedHeaders)) {
          toast.error('CSV must contain an "email" column');
          setHeaders([]);
          return;
        }
        setHeaders(parsedHeaders);
        toast.success(`CSV loaded: ${parsedHeaders.join(', ')}`);
      }
    } catch {
      toast.error('Invalid CSV format');
      setHeaders([]);
    }
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setCsvText(text);
    processCSVText(text);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text);
      processCSVText(text);
      toast.success(`File "${file.name}" uploaded successfully`);
    };
    reader.onerror = () => {
      toast.error('Failed to read file');
    };
    reader.readAsText(file);
  };

  const handleBodyChange = (text: string) => {
    setBody(text);
    const found = extractPlaceholders(text);
    setPlaceholders(found);
  };

  const handleSendCampaign = async () => {
    if (!csvText.trim() || !subject.trim() || !body.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/campaigns/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          body,
          csvText,
          csvHeaders: headers,
        }),
      });

      if (!response.ok) throw new Error('Failed to create campaign');

      const { campaignId, totalLeads } = await response.json();
      toast.success(`Campaign created! Sending to ${totalLeads} leads...`);

      setSubject('');
      setBody('');
      setCsvText('');
      setHeaders([]);
      setPlaceholders([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error creating campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Campaign</h1>
          <p className="text-muted-foreground">Upload your leads and write your email</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* CSV Upload */}
            <Card className="p-6 border-border">
              <Label className="text-base font-semibold mb-3 block">1. Upload CSV</Label>

              {/* File Upload Button */}
              <div className="mb-4">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-file-upload"
                />
                <label htmlFor="csv-file-upload">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById('csv-file-upload')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload CSV File
                  </Button>
                </label>
              </div>

              {/* Or Paste Text */}
              <div className="relative mb-3">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or paste CSV text</span>
                </div>
              </div>

              <Textarea
                placeholder="email,first_name,company,industry
john@example.com,John,Acme,Tech
jane@example.com,Jane,TechCorp,SaaS"
                className="font-mono text-sm h-32"
                value={csvText}
                onChange={handleCSVUpload}
              />
              {headers.length > 0 && (
                <div className="mt-4 p-3 bg-accent/20 rounded border border-accent">
                  <p className="text-sm font-medium text-foreground mb-2">Detected columns:</p>
                  <div className="flex flex-wrap gap-2">
                    {headers.map((h) => (
                      <span key={h} className="px-2 py-1 bg-accent text-foreground text-xs rounded">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Subject */}
            <Card className="p-6 border-border">
              <Label htmlFor="subject" className="text-base font-semibold mb-3 block">
                2. Email Subject
              </Label>
              <Input
                id="subject"
                placeholder="Quick question about {{company}}"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </Card>

            {/* Body */}
            <Card className="p-6 border-border">
              <Label htmlFor="body" className="text-base font-semibold mb-3 block">
                3. Email Body
              </Label>
              <Textarea
                id="body"
                placeholder="Hi {{first_name}},

I saw {{company}} in {{industry}} and wanted to reach out.

Best,
Your Name"
                className="font-mono text-sm h-48"
                value={body}
                onChange={(e) => handleBodyChange(e.target.value)}
              />
            </Card>

            {/* Send Button */}
            <Button
              onClick={handleSendCampaign}
              disabled={loading || !csvText.trim() || !subject.trim() || !body.trim()}
              className="w-full h-11 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Send className="w-4 h-4 mr-2" />
              {loading ? 'Sending...' : 'Send Campaign'}
            </Button>
          </div>

          {/* Sidebar - Available Placeholders */}
          <div>
            <Card className="p-6 border-border sticky top-6">
              <h3 className="font-semibold text-foreground mb-4">Available Placeholders</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {headers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Upload CSV to see placeholders</p>
                ) : (
                  headers.map((h) => (
                    <div key={h} className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded font-mono flex-1 text-foreground">
                        {`{{${h}}}`}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={() =>
                          setBody(body + (body ? ' ' : '') + `{{${h}}}`)
                        }
                      >
                        +
                      </Button>
                    </div>
                  ))
                )}
              </div>

              {placeholders.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="text-sm font-medium text-foreground mb-2">Used in body:</h4>
                  <div className="flex flex-wrap gap-2">
                    {placeholders.map((p) => (
                      <span key={p} className="px-2 py-1 bg-secondary/50 text-foreground text-xs rounded">
                        {`{{${p}}}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
