import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'outreach.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    csv_headers TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'draft'
  );

  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    campaign_id TEXT NOT NULL,
    email TEXT NOT NULL,
    data TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    step INTEGER DEFAULT 0,
    last_sent_at DATETIME,
    replied_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
  );

  CREATE TABLE IF NOT EXISTS email_history (
    id TEXT PRIMARY KEY,
    lead_id TEXT NOT NULL,
    step INTEGER NOT NULL,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    message_id TEXT,
    FOREIGN KEY (lead_id) REFERENCES leads(id)
  );
`);

console.log('Database initialized at:', dbPath);
db.close();
