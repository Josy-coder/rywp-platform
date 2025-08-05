import React from "react";
import Link from "next/link";

export default function WebsiteLayout({
                                        children,
                                      }: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm border-b">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">RYWP</h1>
            </div>

            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600">About</Link>
              <Link href="/hubs" className="text-gray-700 hover:text-blue-600">Hubs</Link>
              <Link href="/projects" className="text-gray-700 hover:text-blue-600">Projects</Link>
              <Link href="/publications" className="text-gray-700 hover:text-blue-600">Publications</Link>
              <Link href="/events" className="text-gray-700 hover:text-blue-600">Events</Link>
              <Link href="/membership" className="text-gray-700 hover:text-blue-600">Membership</Link>
              <Link href="/partners" className="text-gray-700 hover:text-blue-600">Partners</Link>
              <Link href="/careers" className="text-gray-700 hover:text-blue-600">Careers</Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
            </div>

            <div className="flex items-center space-x-4">
              <a
                href="/signin"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Sign In
              </a>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">RYWP</h3>
              <p className="text-gray-300 text-sm">
                Rwanda Young Water Professionals - Empowering the next generation of water professionals.
              </p>
            </div>

            <div>
              <h4 className="text-md font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="text-gray-300 hover:text-white">About Us</a></li>
                <li><a href="/hubs" className="text-gray-300 hover:text-white">Our Hubs</a></li>
                <li><a href="/projects" className="text-gray-300 hover:text-white">Projects</a></li>
                <li><a href="/membership" className="text-gray-300 hover:text-white">Join Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-md font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/publications" className="text-gray-300 hover:text-white">Publications</a></li>
                <li><a href="/events" className="text-gray-300 hover:text-white">Events</a></li>
                <li><a href="/careers" className="text-gray-300 hover:text-white">Careers</a></li>
                <li><a href="/contact" className="text-gray-300 hover:text-white">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-md font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
                <li><a href="/terms" className="text-gray-300 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-300">
            <p>&copy; 2025 Rwanda Young Water Professionals. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}