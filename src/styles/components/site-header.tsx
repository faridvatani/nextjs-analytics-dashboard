import { Separator } from "@/styles/components/ui/separator";
import { SidebarTrigger } from "@/styles/components/ui/sidebar";
import { Badge } from "./ui/badge";
import {
  IconCircleCheckFilled,
  IconExclamationCircleFilled,
  IconLoader,
} from "@tabler/icons-react";

interface SiteHeaderProps {
  status: string;
}

export function SiteHeader({ status }: SiteHeaderProps) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="outline" className="text-muted-foreground px-1.5">
            {status === "Connected" ? (
              <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
            ) : status === "Connecting" ? (
              <IconLoader />
            ) : (
              <IconExclamationCircleFilled className="fill-red-500 dark:fill-red-400" />
            )}
            {status}
          </Badge>
        </div>
      </div>
    </header>
  );
}
