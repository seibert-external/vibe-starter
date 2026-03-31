"use client";

import { Button } from "@seibert/react-ui/button";
import { Select as SdsSelect } from "@seibert/react-ui/select";
import { AreaChart } from "~/components/charts/area-chart";
import { BarChart } from "~/components/charts/bar-chart";
import { DonutChart } from "~/components/charts/donut-chart";
import { ActivityFeed } from "~/components/ui/activity-feed";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { DataTable, StatusCell } from "~/components/ui/data-table";
import { StatCard } from "~/components/ui/stat-card";
import type { Column } from "~/components/ui/data-table";
import type { PageRow } from "~/app/dashboard/_components/mock-data";
import {
  stats,
  revenueData,
  trafficData,
  projectSegments,
  activityItems,
  topPages,
} from "~/app/dashboard/_components/mock-data";

// ─── Icons (inline SVGs to avoid extra deps) ────────────────────────────────

const TrendUpIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const TargetIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const statIcons = [<TrendUpIcon key="0" />, <UsersIcon key="1" />, <TargetIcon key="2" />, <ClockIcon key="3" />];

// ─── Table columns ──────────────────────────────────────────────────────────

const columns: Column<PageRow>[] = [
  { key: "page", label: "Page", render: (v) => <code className="text-xs font-medium text-sds-pine-green-600">{String(v)}</code> },
  { key: "visitors", label: "Visitors", align: "right", render: (v) => Number(v).toLocaleString() },
  { key: "views", label: "Page Views", align: "right", render: (v) => Number(v).toLocaleString() },
  { key: "bounceRate", label: "Bounce Rate", align: "right" },
  { key: "avgDuration", label: "Avg. Duration", align: "right" },
  {
    key: "status",
    label: "Status",
    align: "center",
    render: (v) => {
      const variant = v === "healthy" ? "success" : v === "warning" ? "warning" : "error";
      const label = v === "healthy" ? "Healthy" : v === "warning" ? "Warning" : "Error";
      return <StatusCell label={label} variant={variant} />;
    },
  },
];

// ─── Dashboard Content ──────────────────────────────────────────────────────

export function DashboardContent({ displayName }: { displayName: string }) {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
      {/* ── Greeting & Actions ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-sds-rich-black">
            Welcome back, {displayName} 👋
          </h1>
          <p className="mt-1 text-sm text-sds-gray-400">
            Here&apos;s what&apos;s happening with your projects today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SdsSelect
            options={[
              { label: "Last 7 days" },
              { label: "Last 30 days" },
              { label: "Last 90 days" },
              { label: "This year" },
            ]}
            defaultValue="Last 30 days"
            size="sm"
            className="w-40"
          />
          <Button variant="secondary" leftIcon={<DownloadIcon />}>
            Export
          </Button>
        </div>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.title} {...stat} icon={statIcons[i]} />
        ))}
      </div>

      {/* ── Charts Row ─────────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue chart — takes 2 cols */}
        <Card className="lg:col-span-2">
          <CardHeader className="mb-4">
            <CardTitle>Revenue Over Time</CardTitle>
            <span className="text-xs text-sds-gray-400">Jan – Dec 2025</span>
          </CardHeader>
          <AreaChart data={revenueData} height={240} />
        </Card>

        {/* Project status donut */}
        <Card>
          <CardHeader className="mb-4">
            <CardTitle>Project Status</CardTitle>
          </CardHeader>
          <div className="flex items-center justify-center pt-4">
            <DonutChart segments={projectSegments} />
          </div>
        </Card>
      </div>

      {/* ── Second Row: Bar Chart + Activity ─────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="mb-4">
            <div>
              <CardTitle>Traffic by Channel</CardTitle>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="size-2.5 rounded-full bg-sds-pine-green-600" />
                  <span className="text-xs text-sds-gray-400">This month</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="size-2.5 rounded-full bg-sds-apple-green" />
                  <span className="text-xs text-sds-gray-400">Last month</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <BarChart data={trafficData} height={240} />
        </Card>

        <Card>
          <CardHeader className="mb-2">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="ghost">View all</Button>
          </CardHeader>
          <ActivityFeed items={activityItems} />
        </Card>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="mb-4">
          <CardTitle>Top Pages</CardTitle>
          <span className="text-xs text-sds-gray-400">Last 30 days</span>
        </CardHeader>
        <DataTable columns={columns} data={topPages} />
      </Card>
    </div>
  );
}
