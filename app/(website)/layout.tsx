import React from "react";
import Link from "next/link";
import WebsiteNavbar from "@/components/website-navbar";
import { Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

export default function WebsiteLayout({
                                        children,
                                      }: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen flex flex-col">
      <WebsiteNavbar />
      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4">RYWP</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Rwanda Young Water Professionals - Empowering the next generation of water professionals to build sustainable water solutions.
              </p>
              <div className="mt-6 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <Instagram className="h-5 w-5"/>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <Linkedin className="h-5 w-5"/>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <Twitter className="h-5 w-5"/>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">YouTube</span>
                  <Youtube className="h-5 w-5"/>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about#vision-mission" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/hubs" className="text-gray-300 hover:text-white transition-colors">Our Hubs</Link></li>
                <li><Link href="/projects" className="text-gray-300 hover:text-white transition-colors">Projects</Link></li>
                <li><Link href="/membership" className="text-gray-300 hover:text-white transition-colors">Join Us</Link></li>
                <li><Link href="/events" className="text-gray-300 hover:text-white transition-colors">Events</Link></li>
                <li><Link href="/careers" className="text-gray-300 hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-md font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/publications#policy-briefs" className="text-gray-300 hover:text-white transition-colors">Publications</Link></li>
                <li><Link href="/publications#articles" className="text-gray-300 hover:text-white transition-colors">Articles & Blogs</Link></li>
                <li><Link href="/publications#press-releases" className="text-gray-300 hover:text-white transition-colors">Press Releases</Link></li>
                <li><Link href="/publications#technical-reports" className="text-gray-300 hover:text-white transition-colors">Technical Reports</Link></li>
                <li><Link href="/events#media-gallery" className="text-gray-300 hover:text-white transition-colors">Media Gallery</Link></li>
                <li><Link href="/contact#newsletter" className="text-gray-300 hover:text-white transition-colors">Newsletter</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-md font-semibold mb-4">Contact & Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/partners" className="text-gray-300 hover:text-white transition-colors">Partners</Link></li>
                <li className="pt-2 border-t border-gray-700">
                  <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link>
                </li>
                <li><Link href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <p className="text-sm text-gray-300 text-center lg:text-left">
                &copy; 2025 Rwanda Young Water Professionals. All rights reserved.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-end items-center space-x-6">
                <span className="text-sm text-gray-400">Supported by our partners:</span>
                <div className="flex items-center space-x-4 opacity-60">
                  <div className="w-16 h-8 bg-gray-600 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-300">Partner</span>
                  </div>
                  <div className="w-16 h-8 bg-gray-600 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-300">Partner</span>
                  </div>
                  <div className="w-16 h-8 bg-gray-600 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-300">Partner</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}