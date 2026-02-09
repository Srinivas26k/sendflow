'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Template = 'welcome' | 'notification';

export function EmailPreview({ firstName = 'John', title = 'Important Update', template = 'welcome' }: { firstName?: string; title?: string; template?: Template }) {
  return (
    <div className="w-full">
      <Card className="border border-border bg-card overflow-hidden">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-foreground">Email Preview</CardTitle>
          <CardDescription>
            {template === 'welcome' ? 'Welcome email preview' : 'Notification email preview'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-muted p-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden max-w-md mx-auto">
              {template === 'welcome' ? (
                <>
                  <div className="p-10 bg-gradient-to-b from-slate-50 to-white">
                    <h1 className="text-2xl font-bold text-foreground mb-4">
                      Welcome, {firstName}! 👋
                    </h1>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Thank you for joining SendFlow. We're excited to have you on board.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-8">
                      With SendFlow, you can send beautiful, professional emails at scale using the power of Resend.
                    </p>
                    <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium mb-8 transition-colors">
                      Get Started
                    </button>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      If you have any questions, feel free to reach out to our support team.
                    </p>
                    <p className="text-muted-foreground leading-relaxed text-sm mt-4">
                      Best regards,<br className="my-2" />
                      <span className="font-medium">The SendFlow Team</span>
                    </p>
                  </div>
                  <div className="border-t border-border p-4 text-center">
                    <p className="text-xs text-muted-foreground">
                      © 2024 SendFlow. All rights reserved.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-8">
                    <h1 className="text-2xl font-bold text-white">{title}</h1>
                  </div>
                  <div className="p-10">
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Hello {firstName},
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      We wanted to let you know about an important update.
                    </p>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                      <p className="text-sm">
                        <strong className="text-foreground">Update:</strong>
                        <span className="text-muted-foreground ml-2">
                          Your account has been successfully set up and is ready to use!
                        </span>
                      </p>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      You can now start sending professional emails through SendFlow immediately.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-8">
                      Thank you for your attention!
                    </p>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      Best regards,<br className="my-2" />
                      <span className="font-medium">The SendFlow Team</span>
                    </p>
                  </div>
                  <div className="border-t border-border p-4 text-center">
                    <p className="text-xs text-muted-foreground">
                      © 2024 SendFlow. All rights reserved.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
