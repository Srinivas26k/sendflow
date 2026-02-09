
import { store, Lead } from '@/lib/store';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return Response.json({ detail: 'No file uploaded' }, { status: 400 });
        }

        const text = await file.text();
        const lines = text.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) {
            return Response.json({ detail: 'CSV is empty or missing headers' }, { status: 400 });
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const emailIndex = headers.findIndex(h => h.toLowerCase() === 'email' || h.toLowerCase() === 'e-mail');

        if (emailIndex === -1) {
            // Try to find first column looking like email
            // But for now, require 'email' header
            return Response.json({ detail: 'CSV must have an "email" column' }, { status: 400 });
        }

        let count = 0;
        const newLeads: Lead[] = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
            const email = values[emailIndex];

            if (email && email.includes('@')) {
                const extraData: Record<string, string> = {};
                headers.forEach((h, idx) => {
                    if (idx !== emailIndex) {
                        extraData[h] = values[idx] || '';
                    }
                });

                newLeads.push({
                    id: Math.floor(Math.random() * 1000000),
                    email,
                    status: 'PENDING',
                    followup_count: 0,
                    data: extraData
                });
                count++;
            }
        }

        store.leads = [...store.leads, ...newLeads];
        store.addLog(`Uploaded ${count} leads from ${file.name}`);

        return Response.json({
            success: true,
            message: `Successfully uploaded ${count} leads`,
            columns: headers
        });

    } catch (error) {
        console.error(error);
        return Response.json({ detail: 'Failed to process CSV' }, { status: 500 });
    }
}
