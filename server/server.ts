import { createServer } from "http";
import { parse } from "url";
import next from "next";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const SSE_HEADERS = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
  "access-control-allow-origin": "*",
} as const;

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);

    // Handle SSE endpoint inline
    if (parsedUrl.pathname === "/api/sse") {
      res.writeHead(200, SSE_HEADERS);

      const intervalId = setInterval(() => {
        res.write(
          `data: ${JSON.stringify({
            message: "Hello from Server (SSE)",
            time: new Date().toISOString(),
          })}\n\n`,
        );
      }, 3000);

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
