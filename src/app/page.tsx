"use client";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Dashboard Header */}
      <header className="px-8 py-6 flex justify-between items-center border-b bg-white dark:bg-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Web Analytics Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Connecting to data sources...
        </p>
      </header>
    </div>
  );
}
