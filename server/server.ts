import { createServer, ServerResponse } from "http";
import { parse } from "url";
import next from "next";
import { PrismaClient } from "@prisma/client";

const INTERVAL_GET_DATA = 1000; // 2 seconds
const INTERVAL_GENERATE_DATA = 3000; // 3 seconds

const prisma = new PrismaClient();
const port = parseInt(process.env.PORT || "8000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const SSE_HEADERS = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
  "access-control-allow-origin": "*",
} as const;

async function generateDummyData() {
  console.log("Generating dummy data...");

  // Arrays of realistic values to randomly select from
  const pageUrls: string[] = [
    "/",
    "/products",
    "/about",
    "/contact",
    "/blog",
    "/pricing",
    "/features",
    "/login",
    "/signup",
    "/dashboard",
    "/settings",
  ];

  const pageTitles: string[] = [
    "Home Page",
    "Our Products",
    "About Us",
    "Contact Us",
    "Blog Articles",
    "Pricing Plans",
    "Feature Overview",
    "Login",
    "Sign Up",
    "Dashboard",
    "Settings",
  ];

  const referrers: (string | null)[] = [
    "https://google.com",
    "https://facebook.com",
    "https://twitter.com",
    "https://instagram.com",
    "https://linkedin.com",
    null, // null = direct Traffic
    null,
  ];

  const elementIds: string[] = [
    "login-button",
    "signup-button",
    "menu-toggle",
    "search-input",
    "cta-button",
    "submit-form",
    "newsletter-signup",
  ];

  const elementTypes: string[] = [
    "button",
    "link",
    "input",
    "form",
    "div",
    "nav",
  ];

  const interactionTypes: string[] = [
    "click",
    "submit",
    "hover",
    "input",
    "scroll",
  ];

  const userIds = [
    "user_001",
    "user_002",
    "user_003",
    "user_004",
    "user_005",
    null, // anonymous user
    null,
    null,
  ];

  // Helper functions
  const getRandomElement = <T>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];
  const getRandomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  // set an interval to generate data every 10 seconds
  const intervalId = setInterval(async () => {
    try {
      // 1. Create new sessions (103 per interval)
      const numNewSessions = getRandomInt(2, 5);
      console.log(`Generating ${numNewSessions} new sessions...`);

      for (let i = 0; i < numNewSessions; i++) {
        const userId = getRandomElement(userIds);
        const session = await prisma.session.create({
          data: {
            userId,
            startedAt: new Date(),
          },
        });

        // 2. Create page views for each new session (1-5 views)
        const numPageViews = getRandomInt(1, 5);
        for (let j = 0; j < numPageViews; j++) {
          const randomIndex = Math.floor(Math.random() * pageUrls.length);
          await prisma.pageView.create({
            data: {
              sessionId: session.id,
              pageUrl: pageUrls[randomIndex],
              pageTitle: pageTitles[randomIndex],
              referrer: getRandomElement(referrers),
              viewedAt: new Date(),
            },
          });
        }

        // 3. Create interactions for some sessions (70% chance)
        if (Math.random() < 0.7) {
          const numInteractions = getRandomInt(1, 3);
          for (let k = 0; k < numInteractions; k++) {
            await prisma.interaction.create({
              data: {
                sessionId: session.id,
                elementId: getRandomElement(elementIds),
                elementType: getRandomElement(elementTypes),
                interactionType: getRandomElement(interactionTypes),
                interactedAt: new Date(),
              },
            });
          }
        }
      }

      // 4. Update existing sessions - end some sessions and add activity to others
      const activeSessions = await prisma.session.findMany({
        where: { endedAt: null },
        take: 10,
      });

      for (const session of activeSessions) {
        // 20% chance of ending a session
        if (Math.random() < 0.2) {
          // Create a session duration between 30 seconds and 15 minutes
          const durationSeconds = getRandomInt(30, 900);
          const endTime = new Date();

          // Artificially set startedAt in the past to create the desired duration
          const startTime = new Date(
            endTime.getTime() - durationSeconds * 1000,
          );

          await prisma.session.update({
            where: { id: session.id },
            data: {
              startedAt: startTime,
              endedAt: endTime,
            },
          });

          console.log(
            `End session ${session.id} - duration: ${durationSeconds} seconds`,
          );
        }

        // 40% chance of adding activity to active sessions
        else if (Math.random() < 0.4) {
          const randomIndex = Math.floor(Math.random() * pageUrls.length);

          // Add a new page view
          await prisma.pageView.create({
            data: {
              sessionId: session.id,
              pageUrl: pageUrls[randomIndex],
              pageTitle: pageTitles[randomIndex],
              referrer: null,
              viewedAt: new Date(),
            },
          });

          // 30% chance to add an interaction with the page view
          if (Math.random() < 0.3) {
            await prisma.interaction.create({
              data: {
                sessionId: session.id,
                elementId: getRandomElement(elementIds),
                elementType: getRandomElement(elementTypes),
                interactionType: getRandomElement(interactionTypes),
                interactedAt: new Date(),
              },
            });
          }
        }
      }

      // 5. Periodically clean up old data (50% chance each interval ~ every 15 minutes)
      if (Math.random() < 0.5) {
        const oldSessions = await prisma.session.findMany({
          where: {
            endedAt: {
              lt: new Date(new Date().getTime() - 15 * 60 * 1000), // older than 15 minutes
            },
          },
          select: { id: true },
        });

        const oldSessionIds = oldSessions.map((s) => s.id);

        if (oldSessionIds.length > 0) {
          // Delete related interactions first
          await prisma.interaction.deleteMany({
            where: { sessionId: { in: oldSessionIds } },
          });
          // Delete related page views
          await prisma.pageView.deleteMany({
            where: { sessionId: { in: oldSessionIds } },
          });
          // Now delete the sessions
          const deleteCount = await prisma.session.deleteMany({
            where: { id: { in: oldSessionIds } },
          });
          console.log(
            `Deleted ${deleteCount.count} sessions (and related data) older than 15 minutes`,
          );
        }
      }
      console.log("Dummy data generation complete");
    } catch (error) {
      console.error("Error generating dummy data:", error);
    }
  }, INTERVAL_GENERATE_DATA);

  return intervalId;
}

// function to send data to the client (moved logic here)
async function sendDataToClient(res: ServerResponse) {
  try {
    // Database fetching logic now here
    const pageViews = await prisma.pageView.findMany({
      take: 10,
      orderBy: { viewedAt: "desc" },
      include: { session: true },
    });

    const activeSessions = await prisma.session.findMany({
      take: 10,
      where: { endedAt: null },
      orderBy: { startedAt: "desc" },
    });

    const activeSessionsCount = await prisma.session.count({
      where: { endedAt: null },
    });

    const interactions = await prisma.interaction.findMany({
      take: 10,
      orderBy: { interactedAt: "desc" },
      include: { session: true },
    });

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const pageViewTrend = await prisma.pageView.groupBy({
      by: ["viewedAt"],
      where: { viewedAt: { gte: lastWeek } },
      _count: { id: true },
      orderBy: { viewedAt: "asc" },
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const totalPageViews = await prisma.pageView.count({
      where: { viewedAt: { gte: todayStart } },
    });

    const uniqueUsers = await prisma.session.count({
      where: {
        AND: [{ startedAt: { gte: todayStart } }, { userId: { not: null } }],
      },
    });

    // Get a larger sample of ended sessions for better average calculations
    // Look at the last 24 hours instead of just today
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const sessionsEnded = await prisma.session.findMany({
      where: {
        AND: [{ endedAt: { not: null } }, { endedAt: { gte: oneDayAgo } }],
      },
      take: 100, // Get a good sample size
      orderBy: { endedAt: "desc" },
    });

    let totalDuration = 0;
    for (const session of sessionsEnded) {
      if (session.endedAt) {
        const duration =
          (session.endedAt.getTime() - session.startedAt.getTime()) / 1000;

        // Filter out unrealistic durations (e.g., negative or too long)
        if (duration > 0 && duration < 7200) {
          // Max 2 hours
          totalDuration += duration;
        }
      }
    }

    // Calculate the average with same randomness to ensure visual changes
    const validSessionCount = sessionsEnded.length;
    let avgSessionDuration =
      validSessionCount > 0 ? totalDuration / validSessionCount : 0;

    // Add a small random fluctuation (±10%) to make the value visibly change
    const fluctuation = Math.random() * 0.2 - 0.1;
    avgSessionDuration = avgSessionDuration * (1 + fluctuation);

    console.log(
      `Average Session Duration: ${avgSessionDuration.toFixed(
        2,
      )}s from ${validSessionCount} sessions`,
    );

    const dailyStats = {
      totalPageViews,
      activeSessionsCount,
      uniqueUsers,
      avgSessionDuration,
    };

    const data = {
      pageViews,
      activeSessions,
      interactions,
      pageViewTrend,
      dailyStats,
    };

    // Send the data as SSE
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  } catch (error) {
    console.error("Error sending data to client:", error);
    // Send error to client
    res.write(
      `data: ${JSON.stringify({ error: "Internal Server Error" })}\n\n`,
    );
  }
}

app.prepare().then(() => {
  if (dev) {
    generateDummyData();
  }

  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);

    // Handle SSE endpoint inline
    if (parsedUrl.pathname === "/api/sse") {
      res.writeHead(200, SSE_HEADERS);

      const intervalId = setInterval(() => {
        // Home Page SSE
        // res.write(
        //   `data: ${JSON.stringify({
        //     message: "Hello from Server (SSE)",
        //     time: new Date().toISOString(),
        //   })}\n\n`,
        // );
        sendDataToClient(res);
      }, INTERVAL_GET_DATA);

      req.on("close", () => {
        clearInterval(intervalId);
        res.end();
      });
    } else {
      // Handle regular Next.js requests
      handle(req, res, parsedUrl);
    }
  }).listen(port, (err?: Error) => {
    if (err) throw err;
    console.log(
      `> Server listening at http://localhost:${port} as ${
        dev ? "development" : process.env.NODE_ENV
      }`,
    );
  });

  // Clean up on server shutdown
  process.on("SIGTERM", () => {
    console.log("Shutting down server...");
    process.exit(0);
  });
});
