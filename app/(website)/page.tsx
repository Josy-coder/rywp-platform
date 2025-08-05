"use client";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-gray-900">
          This is the Homepage
        </h1>
        <p className="text-center text-gray-600 mt-4">
          Welcome to Rwanda Young Water Professionals (RYWP)
        </p>

        <div className="mt-8 text-center">
          <p className="text-gray-500">
            This is a public page - no authentication required
          </p>
        </div>
      </div>
    </div>
  );
}