# Next.js Real-Time Analytics Dashboard

![Next.js Real-Time Analytics Dashboard](Screenshot.png)
A modern, real-time analytics dashboard built with Next.js, React, Prisma, PostgreSQL, Docker, and Tailwind CSS.

This dashboard is designed to handle and visualize large amounts of analytical data in real time, using `server-sent events (SSE)` to continuously update the UI as new data arrives.

---

## ✨ Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/) (built on [Radix UI](https://www.radix-ui.com/))
- **Backend:** [Prisma ORM](https://www.prisma.io/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Other:** TypeScript, Server-Sent Events (SSE), Docker

---

## 💡 Features

- Real-time data streaming to the client via Server-Sent Events (SSE)
- Continuously seeded dummy data for live analytics simulation
- Fully customizable, accessible UI components using Shadcn UI
- Analytics-optimized data queries using advanced Prisma aggregations
- Modular schema design with support for analytical tables
- Tailwind CSS styling with easy customization
- Example models: sessions, page views, interactions

---

## ⚙️ Architecture Overview

- **Next.js custom server:** Enables long-lived SSE connections alongside standard request/response routes.
- **PostgreSQL database:** Stores analytical data; you manage it using Docker for local development.
- **Prisma:** Used as the ORM to define and query complex analytical data structures (e.g., grouping, aggregation).
- **Real-time seeding:** The server continuously inserts new dummy data into the database every few seconds to simulate live traffic.

---

## 🚀 Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/faridvatani/nextjs-analytics-dashboard.git
cd nextjs-analytics-dashboard
```

### 2️⃣ Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3️⃣ Configure environment variables

Copy `.env.example` to `.env` and fill in your database connection details:

```bash
cp .env.example .env
```

Example connection string for local Docker Postgres:

```ini
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/mydb"
```

### 4️⃣ Start PostgreSQL with Docker

```bash
docker run --name postgres_container \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_DB=mydb \
  -d \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres
```

To start the container again later:

```bash
docker start postgres_container
```

To stop it:

```bash
docker stop postgres_container
```

### 5️⃣ Set up the database schema

```bash
npx prisma migrate deploy
# or
pnpm prisma migrate deploy
```

### 6️⃣ Seed dummy data (optional)

When you start the custom server, it will automatically start generating dummy data every few seconds to simulate active sessions and interactions.

### 7️⃣ Start the application

In one terminal, start the Next.js frontend:

```bash
pnpm dev
```

In another terminal, start the backend server:

```bash
pnpm dev:server
```

### 8️⃣ Access the dashboard

Visit [http://localhost:3000](http://localhost:3000) in your browser.
You should see the dashboard automatically update with new data every few seconds — no page refresh needed.

## 💬 Additional Notes

- **Server-Sent Events (SSE):** This approach is simpler than websockets for one-way real-time updates (from server to client) and fits analytics dashboards very well.

- **PostgreSQL (OLAP):** Although typical OLAP workloads use specialized databases, this project demonstrates how you can still achieve analytical queries in PostgreSQL using aggregations and optimized queries via Prisma.

- **Prisma Models:** You can customize the models (Session, PageView, Interaction) to fit your own analytical needs. Check the prisma/schema.prisma file.

- **Component Library:** Uses Shadcn UI for fully customizable, accessible React components styled with Tailwind CSS.

## Aknowledgements

Inspired by modern approaches to building real-time analytics dashboards.
Big thanks to the open source community and all tool maintainers.

## 🛠️ Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have suggestions or improvements.
Let me know if you'd also like to include example code snippets (like the custom server setup or SSE client code) directly in the README, or add diagrams showing the architecture!

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
