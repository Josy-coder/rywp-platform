"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, Droplets } from 'lucide-react';

// Navigation Component
function Navigation() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/', hasDropdown: false },
    {
      name: 'About Us',
      href: '/about',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Vision, Mission & Core Values', href: '/about#vision' },
        { name: 'History & Founding Story', href: '/about#history' },
        { name: 'Our Team', href: '/about#team' }
      ]
    },
    { name: 'Our Hubs', href: '/hubs', hasDropdown: false },
    { name: 'Projects & Implementation', href: '/projects', hasDropdown: false },
    {
      name: 'Publications',
      href: '/publications',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Policy Briefs', href: '/publications#policy-briefs' },
        { name: 'Articles & Blog Posts', href: '/publications#articles' },
        { name: 'Press Releases', href: '/publications#press-releases' },
        { name: 'Technical Reports', href: '/publications#technical-reports' }
      ]
    },
    { name: 'Events & Media', href: '/events', hasDropdown: false },
    { name: 'Membership', href: '/membership', hasDropdown: false },
    { name: 'Partners & Supporters', href: '/partners', hasDropdown: false },
    {
      name: 'Careers',
      href: '/careers',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Job Openings', href: '/careers#jobs' },
        { name: 'Internships & Fellowships', href: '/careers#internships' },
        { name: 'Calls for Proposals', href: '/careers#proposals' }
      ]
    },
    { name: 'Contact', href: '/contact', hasDropdown: false }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <Droplets className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold transition-colors ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                RYWP
              </h1>
              <p className={`text-xs transition-colors ${isScrolled ? 'text-gray-600' : 'text-blue-100'}`}>
                Water Professionals
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(index)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                    isScrolled
                      ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      : 'text-white hover:text-blue-200 hover:bg-white/10'
                  }`}
                >
                  <span>{item.name}</span>
                  {item.hasDropdown && (
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                      activeDropdown === index ? 'rotate-180' : ''
                    }`} />
                  )}
                </a>

                {/* Dropdown Menu */}
                {item.hasDropdown && activeDropdown === index && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {item.dropdownItems?.map((dropdownItem, dropdownIndex) => (
                      <a
                        key={dropdownIndex}
                        href={dropdownItem.href}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                      >
                        {dropdownItem.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="/signin"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              Sign In
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md transition-colors duration-200"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`w-6 h-0.5 transition-all duration-300 ${
                isScrolled ? 'bg-gray-900' : 'bg-white'
              } ${isMobileMenuOpen ? 'rotate-45 translate-y-0.5' : ''}`} />
              <span className={`w-6 h-0.5 mt-1.5 transition-all duration-300 ${
                isScrolled ? 'bg-gray-900' : 'bg-white'
              } ${isMobileMenuOpen ? '-rotate-45 -translate-y-0.5' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 animate-in slide-in-from-top duration-200">
            <div className="px-4 py-6 space-y-3">
              {navItems.map((item, index) => (
                <div key={index}>
                  <a
                    href={item.href}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    {item.name}
                  </a>
                  {item.hasDropdown && (
                    <div className="ml-4 mt-2 space-y-2">
                      {item.dropdownItems?.map((dropdownItem, dropdownIndex) => (
                        <a
                          key={dropdownIndex}
                          href={dropdownItem.href}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          {dropdownItem.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <a
                  href="/signin"
                  className="block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-center font-medium transition-colors"
                >
                  Sign In
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default function WebsiteLayout({
                                        children,
                                      }: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Rwanda Young Water Professionals",
    "alternateName": "RYWP",
    "url": "https://rywp.org",
    "logo": "https://rywp.org/logo.png",
    "description": "RYWP is empowering Rwanda's water future through innovation, collaboration, and sustainable solutions.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "Rwanda",
      "addressLocality": "Kigali"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+250-XXX-XXXX",
      "contactType": "General Inquiry",
      "email": "info@rywp.org"
    },
    "sameAs": [
      "https://linkedin.com/company/rywp",
      "https://twitter.com/RYWP_Rwanda",
      "https://facebook.com/RwandaYoungWaterProfessionals"
    ],
    "foundingDate": "2019",
    "founders": [
      {
        "@type": "Person",
        "name": "RYWP Founders"
      }
    ],
    "numberOfEmployees": "50-100",
    "industry": "Water Management and Engineering",
    "keywords": "water management, WASH, sustainable water solutions, water engineering, clean water access",
    "memberOf": {
      "@type": "Organization",
      "name": "Global Water Partnership"
    },
    "parentOrganization": {
      "@type": "GovernmentOrganization",
      "name": "Ministry of Infrastructure, Rwanda"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen flex flex-col bg-white">
        <Navigation />

        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Website Footer */}
        <footer className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                    <Droplets className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">RYWP</h3>
                    <p className="text-blue-300 text-sm">Rwanda Young Water Professionals</p>
                  </div>
                </div>
                <p className="text-gray-300 text-base leading-relaxed mb-6 max-w-md">
                  Empowering the next generation of water professionals in Rwanda through innovation,
                  collaboration, and sustainable solutions for a water-secure future.
                </p>
                <div className="flex space-x-4">
                  <a href="https://linkedin.com/company/rywp" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="https://twitter.com/RYWP_Rwanda" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="https://facebook.com/RwandaYoungWaterProfessionals" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="https://youtube.com/@RWYPRwanda" className="text-gray-400 hover:text-white transition-colors" aria-label="YouTube">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="/about" className="text-gray-300 hover:text-white transition-colors duration-200">About Us</a></li>
                  <li><a href="/hubs" className="text-gray-300 hover:text-white transition-colors duration-200">Our Hubs</a></li>
                  <li><a href="/projects" className="text-gray-300 hover:text-white transition-colors duration-200">Projects</a></li>
                  <li><a href="/publications" className="text-gray-300 hover:text-white transition-colors duration-200">Publications</a></li>
                  <li><a href="/events" className="text-gray-300 hover:text-white transition-colors duration-200">Events</a></li>
                  <li><a href="/membership" className="text-gray-300 hover:text-white transition-colors duration-200">Join Us</a></li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-white">Resources</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="/publications#policy-briefs" className="text-gray-300 hover:text-white transition-colors duration-200">Policy Briefs</a></li>
                  <li><a href="/careers" className="text-gray-300 hover:text-white transition-colors duration-200">Careers</a></li>
                  <li><a href="/partners" className="text-gray-300 hover:text-white transition-colors duration-200">Partners</a></li>
                  <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">Contact</a></li>
                  <li><a href="/sitemap" className="text-gray-300 hover:text-white transition-colors duration-200">Site Map</a></li>
                </ul>

                <div className="mt-8">
                  <h5 className="text-md font-semibold mb-4 text-white">Legal</h5>
                  <ul className="space-y-3 text-sm">
                    <li><a href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
                    <li><a href="/terms-of-service" className="text-gray-300 hover:text-white transition-colors duration-200">Terms of Service</a></li>
                    <li><a href="/cookie-policy" className="text-gray-300 hover:text-white transition-colors duration-200">Cookie Policy</a></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-12 pt-8 border-t border-gray-800">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Stay Updated</h4>
                  <p className="text-gray-300 text-sm">Get the latest news and updates from RYWP</p>
                </div>
                <div className="flex space-x-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-8 pt-8 border-t border-gray-800 text-center">
              <p className="text-sm text-gray-400">
                &copy; 2025 Rwanda Young Water Professionals (RYWP). All rights reserved. |
                <span className="text-gray-500"> Empowering Rwanda&#39;s Water Future</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}