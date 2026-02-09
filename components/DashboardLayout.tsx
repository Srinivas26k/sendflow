
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    BarChart2,
    FileText,
    ScrollText,
    Mail,
    Settings
} from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/leads', label: 'Leads', icon: Users },
        { href: '/analytics', label: 'Analytics', icon: BarChart2 },
        { href: '/reports', label: 'Reports', icon: FileText },
        { href: '/logs', label: 'Logs', icon: ScrollText },
        { href: '/templates', label: 'Templates', icon: Mail },
        { href: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="app-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h1 className="logo">Outreach</h1>
                    <p className="logo-sub">Email automation</p>
                </div>
                <nav className="sidebar-nav">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`nav-item ${isActive ? 'active' : ''}`}
                            >
                                <Icon className="nav-icon" aria-hidden="true" />
                                <span className="nav-text">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
