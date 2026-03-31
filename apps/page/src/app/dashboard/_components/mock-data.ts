import type { DataPoint } from "~/components/charts/area-chart";
import type { BarDataPoint } from "~/components/charts/bar-chart";
import type { DonutSegment } from "~/components/charts/donut-chart";
import type { ActivityItem } from "~/components/ui/activity-feed";

// ─── KPI Stats ───────────────────────────────────────────────────────────────

export const stats = [
  {
    title: "Total Revenue",
    value: "€48,295",
    change: "+12.5% vs last month",
    trend: "up" as const,
    sparkline: [28, 32, 25, 38, 42, 35, 48, 52, 45, 58, 62, 68],
  },
  {
    title: "Active Users",
    value: "2,847",
    change: "+8.2% vs last month",
    trend: "up" as const,
    sparkline: [180, 210, 195, 230, 220, 250, 240, 260, 275, 290, 285, 310],
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: "-0.4% vs last month",
    trend: "down" as const,
    sparkline: [3.8, 3.6, 3.5, 3.7, 3.4, 3.3, 3.2, 3.4, 3.1, 3.3, 3.2, 3.24],
  },
  {
    title: "Avg. Response Time",
    value: "142ms",
    change: "No change",
    trend: "neutral" as const,
    sparkline: [165, 148, 152, 140, 155, 138, 145, 142, 150, 139, 144, 142],
  },
];

// ─── Revenue Over Time (Area Chart) ─────────────────────────────────────────

export const revenueData: DataPoint[] = [
  { label: "Jan", value: 28400 },
  { label: "Feb", value: 32100 },
  { label: "Mar", value: 29800 },
  { label: "Apr", value: 35600 },
  { label: "May", value: 38200 },
  { label: "Jun", value: 34500 },
  { label: "Jul", value: 41200 },
  { label: "Aug", value: 39800 },
  { label: "Sep", value: 43600 },
  { label: "Oct", value: 45100 },
  { label: "Nov", value: 42800 },
  { label: "Dec", value: 48295 },
];

// ─── Traffic by Channel (Bar Chart) ─────────────────────────────────────────

export const trafficData: BarDataPoint[] = [
  { label: "Organic", value: 4200, secondaryValue: 3800 },
  { label: "Direct", value: 3100, secondaryValue: 2900 },
  { label: "Referral", value: 2400, secondaryValue: 2100 },
  { label: "Social", value: 1800, secondaryValue: 2200 },
  { label: "Email", value: 1200, secondaryValue: 1500 },
  { label: "Paid", value: 900, secondaryValue: 1100 },
];

// ─── Project Status (Donut Chart) ───────────────────────────────────────────

export const projectSegments: DonutSegment[] = [
  { label: "Completed", value: 24, color: "#02464b" },
  { label: "In Progress", value: 12, color: "#bee600" },
  { label: "Review", value: 8, color: "#62c5ae" },
  { label: "Blocked", value: 3, color: "#c64218" },
];

// ─── Recent Activity ────────────────────────────────────────────────────────

export const activityItems: ActivityItem[] = [
  {
    id: "1",
    user: "Sarah Chen",
    avatar: "SC",
    action: "deployed",
    target: "v2.4.1 to production",
    time: "2 minutes ago",
    badge: { label: "Deploy", variant: "success" },
  },
  {
    id: "2",
    user: "Marcus Berg",
    avatar: "MB",
    action: "merged PR #847 into",
    target: "main",
    time: "18 minutes ago",
    badge: { label: "Merged", variant: "info" },
  },
  {
    id: "3",
    user: "Lisa Krüger",
    avatar: "LK",
    action: "commented on",
    target: "Dashboard Redesign",
    time: "1 hour ago",
  },
  {
    id: "4",
    user: "Tom Brandt",
    avatar: "TB",
    action: "flagged issue in",
    target: "Auth Service",
    time: "2 hours ago",
    badge: { label: "Critical", variant: "error" },
  },
  {
    id: "5",
    user: "Nina Wolff",
    avatar: "NW",
    action: "updated status of",
    target: "API Migration",
    time: "3 hours ago",
    badge: { label: "In Progress", variant: "warning" },
  },
  {
    id: "6",
    user: "Jan Meier",
    avatar: "JM",
    action: "created new project",
    target: "Mobile App v3",
    time: "5 hours ago",
  },
];

// ─── Top Pages Table ────────────────────────────────────────────────────────

export interface PageRow {
  page: string;
  visitors: number;
  views: number;
  bounceRate: string;
  avgDuration: string;
  status: string;
  [key: string]: unknown;
}

export const topPages: PageRow[] = [
  {
    page: "/dashboard",
    visitors: 12840,
    views: 28450,
    bounceRate: "18.2%",
    avgDuration: "4m 32s",
    status: "healthy",
  },
  {
    page: "/products",
    visitors: 8920,
    views: 15300,
    bounceRate: "24.1%",
    avgDuration: "3m 15s",
    status: "healthy",
  },
  {
    page: "/checkout",
    visitors: 5340,
    views: 7890,
    bounceRate: "42.8%",
    avgDuration: "2m 08s",
    status: "warning",
  },
  {
    page: "/api/v2/users",
    visitors: 3210,
    views: 45200,
    bounceRate: "—",
    avgDuration: "—",
    status: "healthy",
  },
  {
    page: "/settings",
    visitors: 2180,
    views: 3450,
    bounceRate: "31.5%",
    avgDuration: "5m 41s",
    status: "healthy",
  },
  {
    page: "/auth/callback",
    visitors: 1920,
    views: 2100,
    bounceRate: "89.3%",
    avgDuration: "0m 12s",
    status: "error",
  },
];
