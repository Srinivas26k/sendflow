'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Template = 'welcome' | 'notification';

export function EmailForm() {
  const [formData, setFormData] = useState({
    to: '',
    firstName: '',
    subject: '',
    title: '',
  });
  const [template, setTemplate] = useState<Template>('welcome');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formData.to,
          firstName: formData.firstName,
          subject: formData.subject,
          title: formData.title,
          template,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setMessage({
        type: 'success',
        text: 'Email sent successfully!',
      });

      setFormData({
        to: '',
        firstName: '',
        subject: '',
        title: '',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to send email',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="border border-border bg-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-foreground">Send Email Campaign</CardTitle>
          <CardDescription>
            Choose a template and send a professional email to your contacts
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Template Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">Email Template</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'welcome', label: 'Welcome Email', desc: 'Onboarding template' },
                  { id: 'notification', label: 'Notification', desc: 'Update announcement' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTemplate(t.id as Template)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      template === t.id
                        ? 'border-primary bg-blue-50'
                        : 'border-border bg-white hover:border-primary/50'
                    }`}
                  >
                    <div className="font-medium text-sm text-foreground">{t.label}</div>
                    <div className="text-xs text-muted-foreground">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="to" className="text-sm font-medium text-foreground">
                Recipient Email *
              </Label>
              <Input
                id="to"
                name="to"
                type="email"
                placeholder="recipient@example.com"
                value={formData.to}
                onChange={handleChange}
                required
                className="bg-input border-border placeholder:text-muted-foreground"
              />
            </div>

            {/* First Name Input */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                Recipient First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                className="bg-input border-border placeholder:text-muted-foreground"
              />
            </div>

            {/* Subject Input */}
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-medium text-foreground">
                Email Subject *
              </Label>
              <Input
                id="subject"
                name="subject"
                placeholder="Welcome to SendFlow!"
                value={formData.subject}
                onChange={handleChange}
                required
                className="bg-input border-border placeholder:text-muted-foreground"
              />
            </div>

            {/* Title Input (for notification template) */}
            {template === 'notification' && (
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-foreground">
                  Announcement Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Important Update"
                  value={formData.title}
                  onChange={handleChange}
                  className="bg-input border-border placeholder:text-muted-foreground"
                />
              </div>
            )}

            {/* Alert Messages */}
            {message && (
              <Alert
                className={`${
                  message.type === 'success'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                {message.type === 'success' ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription
                  className={
                    message.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }
                >
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Email'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
