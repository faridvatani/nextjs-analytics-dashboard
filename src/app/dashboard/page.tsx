"use client";
import { AppSidebar } from "@/styles/components/app-sidebar";
import { ChartAreaInteractive } from "@/styles/components/chart-area-interactive";
import { DataTable } from "@/styles/components/data-table";
import { SectionCards } from "@/styles/components/section-cards";
import { SiteHeader } from "@/styles/components/site-header";
import { SidebarInset, SidebarProvider } from "@/styles/components/ui/sidebar";
import { useEffect, useState } from "react";

// Define the types matching your server response
interface PageView {
  id: number;
  pageUrl: string;
  pageTitle: string;
  referrer: string | null;
  viewedAt: string;
  sessionId: number;
}

interface DailyStats {
  totalPageViews: number;
  uniqueUsers: number;
  avgSessionDuration: number;
  activeSessionsCount: number;
}

interface ServerData {
  pageViews: PageView[];
  activeSessions: unknown[];
  interactions: unknown[];
  pageViewTrend: unknown[];
  dailyStats: DailyStats;
}

export default function Page() {
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Connecting");
  const [data, setData] = useState<ServerData | null>(null);

  useEffect(() => {
    const eventSource = new EventSource("/api/sse");

    eventSource.onopen = () => {
      setConnectionStatus("Connected");
    };

    eventSource.onmessage = (event) => {
      const serverData: ServerData = JSON.parse(event.data);
      setData(serverData);
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      setConnectionStatus("Error");
    };

    return () => {
      eventSource.close();
      setConnectionStatus("Disconnected");
    };
  }, []);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader status={connectionStatus} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards data={data?.dailyStats} status={connectionStatus} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data?.pageViews ?? []} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
