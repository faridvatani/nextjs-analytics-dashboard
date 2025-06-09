import { IconTrendingUp } from "@tabler/icons-react";

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/styles/components/ui/card";

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Page Views</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            12,345
          </CardTitle>
          <CardAction>
            <IconTrendingUp className="size-4" />
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm">
          <div className="text-muted-foreground">Updated in real-time</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Sessions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,234
          </CardTitle>
          <CardAction>
            <IconTrendingUp className="size-4" />
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm">
          <div className="text-muted-foreground">Current active users</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Unique Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,000
          </CardTitle>
          <CardAction>
            <IconTrendingUp className="size-4" />
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm">
          <div className="text-muted-foreground">
            Today&apos;s unique visitors
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Avg. Session Duration</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            5:23
          </CardTitle>
          <CardAction>
            <IconTrendingUp className="size-4" />
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm">
          <div className="text-muted-foreground">Average time on site</div>
        </CardFooter>
      </Card>
    </div>
  );
}
