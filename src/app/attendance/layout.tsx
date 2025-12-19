'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  ChevronRight,
  ClipboardCheck
} from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AttendanceLayoutProps {
  children: React.ReactNode;
}

const navTabs = [
  { href: '/attendance', label: 'dashboard', icon: LayoutDashboard, exact: true },
  { href: '/attendance/calendar', label: 'calendar', icon: Calendar },
  { href: '/attendance/reports', label: 'reports', icon: FileText },
];

export default function AttendanceLayout({ children }: AttendanceLayoutProps) {
  const pathname = usePathname();
  const t = useTranslations('attendance');
  const tNav = useTranslations('nav');

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Check if we're on a booking detail page
  const isBookingPage = pathname.includes('/attendance/booking/');

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 py-3 text-sm text-stone-500">
            <Link href="/" className="hover:text-stone-700 transition-colors">
              {tNav('home')}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href="/attendance"
              className={cn(
                'hover:text-stone-700 transition-colors',
                !isBookingPage && 'text-stone-900 font-medium'
              )}
            >
              {tNav('attendance')}
            </Link>
            {isBookingPage && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-stone-900 font-medium">{t('markAttendance')}</span>
              </>
            )}
          </div>

          {/* Title & Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ClipboardCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-stone-900 font-display">
                  {t('title')}
                </h1>
                <p className="text-sm text-stone-500">
                  Track and manage player attendance
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          {!isBookingPage && (
            <nav className="-mb-px flex gap-1" aria-label="Attendance navigation">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const active = isActive(tab.href, tab.exact);

                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-all duration-200',
                      'border-b-2 -mb-[2px]',
                      active
                        ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                        : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{t(tab.label)}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
