"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";

export default function WebsiteNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setActiveDropdown(null);
  };

  const handleDropdownToggle = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  return (
    <>
      {/* Add custom styles */}
      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideOutLeft {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-10px);
          }
        }

        .dropdown-enter {
          animation: slideInLeft 0.2s ease-out forwards;
        }

        .dropdown-item {
          transition: all 0.15s ease-in-out;
          animation: slideInLeft 0.2s ease-out forwards;
        }

        .dropdown-item:nth-child(1) { animation-delay: 0ms; }
        .dropdown-item:nth-child(2) { animation-delay: 50ms; }
        .dropdown-item:nth-child(3) { animation-delay: 100ms; }
        .dropdown-item:nth-child(4) { animation-delay: 150ms; }
        .dropdown-item:nth-child(5) { animation-delay: 200ms; }
        .dropdown-item:nth-child(6) { animation-delay: 250ms; }

        .nav-item {
          position: relative;
          transition: all 0.3s ease-in-out;
        }

        .nav-item::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -2px;
          left: 50%;
          background: var(--dark-blue);
          transition: all 0.3s ease-in-out;
          transform: translateX(-50%);
        }

        .nav-item:hover::after {
          width: 100%;
        }

        .mobile-dropdown {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-in-out, opacity 0.2s ease-in-out;
          opacity: 0;
        }

        .mobile-dropdown.active {
          max-height: 300px;
          opacity: 1;
        }

        .mobile-nav-item {
          position: relative;
          transition: all 0.3s ease-in-out;
        }

        .mobile-nav-item::before {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          top: 50%;
          left: 0;
          background: var(--dark-blue);
          transition: all 0.3s ease-in-out;
          transform: translateY(-50%);
        }

        .mobile-nav-item:hover::before {
          width: 4px;
        }
      `}</style>

      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" onClick={closeDropdown}>
                <Image
                  src="/images/logo.png"
                  alt="RYWP logo"
                  width={130}
                  height={50}
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <Link
                href="/"
                className="nav-item px-3 py-2 text-sm font-bold text-gray-700 hover:text-dark-blue hover:bg-gray-50 rounded-md transition-colors"
                onClick={closeDropdown}
              >
                Home
              </Link>

              {/* About Dropdown */}
              <div className="relative">
                <button
                  className="nav-item px-3 py-2 text-sm font-bold text-gray-700 hover:text-dark-blue hover:bg-gray-50 rounded-md transition-colors flex items-center"
                  onClick={() => handleDropdownToggle('about')}
                  onMouseEnter={() => setActiveDropdown('about')}
                >
                  About
                  <svg className="ml-1 h-4 w-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeDropdown === 'about' && (
                  <div
                    className="absolute left-0 mt-2 w-64 bg-light-blue text-gray-700 font-bold rounded-md shadow-lg border border-gray-200 py-2 dropdown-enter"
                    onMouseLeave={closeDropdown}
                  >
                    <Link href="/about#vision-mission" className="dropdown-item block px-4 py-2 text-sm hover:bg-gray-700 hover:text-light-blue">Vision & Mission</Link>
                    <Link href="/about#core-values" className="dropdown-item block px-4 py-2 text-sm hover:bg-gray-700 hover:text-light-blue">Core Values</Link>
                    <Link href="/about#history" className="dropdown-item block px-4 py-2 text-sm hover:bg-gray-700 hover:text-light-blue">History & Founding Story</Link>
                    <Link href="/about#founding-members" className="dropdown-item block px-4 py-2 text-sm hover:bg-gray-700 hover:text-light-blue">Founding Members</Link>
                    <Link href="/about#management-team" className="dropdown-item block px-4 py-2 text-sm hover:bg-gray-700 hover:text-light-blue">Hub Management Team</Link>
                    <Link href="/about#staff-team" className="dropdown-item block px-4 py-2 text-sm hover:bg-gray-700 hover:text-light-blue">Staff Team</Link>
                  </div>
                )}
              </div>

              {/* Hubs Dropdown */}
              <div className="relative">
                <button
                  className="nav-item px-3 py-2 text-sm font-bold text-gray-700 hover:text-dark-blue hover:bg-gray-50 rounded-md transition-colors flex items-center"
                  onClick={() => handleDropdownToggle('hubs')}
                  onMouseEnter={() => setActiveDropdown('hubs')}
                >
                  Our Hubs
                  <svg className="ml-1 h-4 w-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeDropdown === 'hubs' && (
                  <div
                    className="absolute left-0 mt-2 w-64 bg-light-blue text-gray-700 font-bold rounded-md shadow-lg border border-gray-200 py-2 dropdown-enter"
                    onMouseLeave={closeDropdown}
                  >
                    <Link href="/hubs#intro" className="dropdown-item block px-4 py-2 text-sm hover:bg-gray-700 hover:text-light-blue">Introduction to Hubs</Link>
                    <Link href="/hubs#membership" className="dropdown-item block px-4 py-2 text-sm hover:bg-gray-700 hover:text-light-blue">How to Become a Member</Link>
                    <Link href="/hubs#terms-of-reference" className="dropdown-item block px-4 py-2 text-sm hover:bg-gray-700 hover:text-light-blue">Terms of Reference</Link>
                    <Link href="/hubs#hub-leads" className="dropdown-item block px-4 py-2 text-sm hover:bg-gray-700 hover:text-light-blue">Hub Leads</Link>
                  </div>
                )}
              </div>

              {/* Projects Dropdown */}
              <div className="relative">
                <button
                  className="nav-item px-3 py-2 text-sm font-bold text-gray-700 hover:text-dark-blue hover:bg-gray-50 rounded-md transition-colors flex items-center"
                  onClick={() => handleDropdownToggle('projects')}
                  onMouseEnter={() => setActiveDropdown('projects')}
                >
                  Projects
                  <svg className="ml-1 h-4 w-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeDropdown === 'projects' && (
                  <div
                    className="absolute left-0 mt-2 w-64 bg-light-blue text-gray-700 font-bold rounded-md shadow-lg border border-gray-200 py-2 dropdown-enter"
                    onMouseLeave={closeDropdown}
                  >
                    <Link href="/projects#all-projects" className="dropdown-item block px-4 py-2 text-sm hover:bg-gray-700 hover:text-light-blue">All Projects</Link>
                    <Link href="/projects#wash-projects" className="dropdown-item block px-4 py-2 text-sm hover:bg-gray-700 hover:text-light-blue">WASH Projects</Link>
                    <Link href="/projects#nature-based" className="dropdown-item block px-4 py-2 text-sm hover:bg-gray-700 hover:text-light-blue">Nature-Based Solutions</Link>
                    <Link href="/projects#ongoing" className="dropdown-item block px-4 py-2 text-sm hover:bg-gray-700 hover:text-light-blue">Ongoing Projects</Link>
                    <Link href="/projects#completed" className="dropdown-item block px-4 py-2 text-sm hover:bg-gray-700 hover:text-light-blue">Completed Projects</Link>
                  </div>
                )}
              </div>

              {/* Publications Dropdown */}
              <div className="relative">
                <button
                  className="nav-item px-3 py-2 text-sm font-bold text-gray-700 hover:text-dark-blue hover:bg-gray-50 rounded-md transition-colors flex items-center"
                  onClick={() => handleDropdownToggle('publications')}
                  onMouseEnter={() => setActiveDropdown('publications')}
                >
                  Publications
                  <svg className="ml-1 h-4 w-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeDropdown === 'publications' && (
                  <div
                    className="absolute left-0 mt-2 w-64 bg-light-blue text-gray-700 font-bold rounded-md shadow-lg border border-gray-200 py-2 dropdown-enter"
                    onMouseLeave={closeDropdown}
                  >
                    <Link href="/publications#policy-briefs" className="dropdown-item block px-4 py-2 text-sm hover:bg-gray-700 hover:text-light-blue">Policy Briefs</Link>
                    <Link href="/publications#articles" className="dropdown-item block px-4 py-2 text-sm hover:bg-gray-700 hover:text-light-blue">Articles & Blog Posts</Link>
                    <Link href="/publications#press-releases" className="dropdown-item block px-4 py-2 text-sm hover:bg-gray-700 hover:text-light-blue">Press Releases</Link>
                    <Link href="/publications#technical-reports" className="dropdown-item block px-4 py-2 text-sm hover:bg-gray-700 hover:text-light-blue">Technical Reports</Link>
                  </div>
                )}
              </div>

              {/* Events Dropdown */}
              <div className="relative">
                <button
                  className="nav-item px-3 py-2 text-sm font-bold text-gray-700 hover:text-dark-blue hover:bg-gray-50 rounded-md transition-colors flex items-center"
                  onClick={() => handleDropdownToggle('events')}
                  onMouseEnter={() => setActiveDropdown('events')}
                >
                  Events
                  <svg className="ml-1 h-4 w-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeDropdown === 'events' && (
                  <div
                    className="absolute left-0 mt-2 w-64 bg-light-blue text-gray-700 font-bold rounded-md shadow-lg border border-gray-200 py-2 dropdown-enter"
                    onMouseLeave={closeDropdown}
                  >
                    <Link href="/events#upcoming" className="dropdown-item block px-4 py-2 text-sm hover:bg-gray-700 hover:text-light-blue">Upcoming Events</Link>
                    <Link href="/events#knowledge-sharing" className="dropdown-item block px-4 py-2 text-sm hover:bg-gray-700 hover:text-light-blue">Knowledge Sharing Sessions</Link>
                    <Link href="/events#media-gallery" className="dropdown-item block px-4 py-2 text-sm hover:bg-gray-700 hover:text-light-blue">Media Gallery</Link>
                  </div>
                )}
              </div>

              <Link
                href="/membership"
                className="nav-item px-3 py-2 text-sm font-bold text-gray-700 hover:text-dark-blue hover:bg-gray-50 rounded-md transition-colors"
                onClick={closeDropdown}
              >
                Membership
              </Link>

              <Link
                href="/partners"
                className="nav-item px-3 py-2 text-sm font-bold text-gray-700 hover:text-dark-blue hover:bg-gray-50 rounded-md transition-colors"
                onClick={closeDropdown}
              >
                Partners
              </Link>

              <Link
                href="/careers"
                className="nav-item px-3 py-2 text-sm font-bold text-gray-700 hover:text-dark-blue hover:bg-gray-50 rounded-md transition-colors"
                onClick={closeDropdown}
              >
                Careers
              </Link>

              <Link
                href="/contact"
                className="nav-item px-3 py-2 text-sm font-bold text-gray-700 hover:text-dark-blue hover:bg-gray-50 rounded-md transition-colors"
                onClick={closeDropdown}
              >
                Contact
              </Link>
            </div>

            {/* Sign In Button & Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              <Link
                href="/signin"
                className="bg-dark-blue text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-light-blue transition-colors transform hover:scale-105"
                onClick={closeDropdown}
              >
                Sign In
              </Link>

              {/* Mobile menu button */}
              <button
                className="lg:hidden p-2 rounded-md text-gray-700 hover:text-dark-blue hover:bg-gray-50 transition-all duration-200"
                onClick={toggleMenu}
              >
                <svg className="h-6 w-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <div className="space-y-1">
                <Link
                  href="/"
                  className="mobile-nav-item block px-3 py-2 text-base font-bold text-gray-700 hover:text-dark-blue hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>

                {/* Mobile About Dropdown */}
                <div>
                  <button
                    className="mobile-nav-item w-full text-left px-3 py-2 text-base font-bold text-gray-700 hover:text-dark-blue hover:bg-gray-50 rounded-md flex items-center justify-between transition-colors"
                    onClick={() => handleDropdownToggle('mobile-about')}
                  >
                    About
                    <svg
                      className={`h-5 w-5 transform transition-transform duration-300 ${activeDropdown === 'mobile-about' ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`mobile-dropdown ${activeDropdown === 'mobile-about' ? 'active' : ''}`}>
                    <div className="pl-6 space-y-1 bg-light-blue rounded-md mx-3 mt-2">
                      <Link href="/about#vision-mission" className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-700 hover:text-light-blue rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>Vision & Mission</Link>
                      <Link href="/about#core-values" className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-700 hover:text-light-blue rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>Core Values</Link>
                      <Link href="/about#history" className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-700 hover:text-light-blue rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>History & Founding Story</Link>
                      <Link href="/about#founding-members" className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-700 hover:text-light-blue rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>Founding Members</Link>
                      <Link href="/about#management-team" className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-700 hover:text-light-blue rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>Hub Management Team</Link>
                      <Link href="/about#staff-team" className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-700 hover:text-light-blue rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>Staff Team</Link>
                    </div>
                  </div>
                </div>

                {/* Mobile Hubs Dropdown */}
                <div>
                  <button
                    className="mobile-nav-item w-full text-left px-3 py-2 text-base font-bold text-gray-700 hover:text-dark-blue hover:bg-gray-50 rounded-md flex items-center justify-between transition-colors"
                    onClick={() => handleDropdownToggle('mobile-hubs')}
                  >
                    Our Hubs
                    <svg
                      className={`h-5 w-5 transform transition-transform duration-300 ${activeDropdown === 'mobile-hubs' ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`mobile-dropdown ${activeDropdown === 'mobile-hubs' ? 'active' : ''}`}>
                    <div className="pl-6 space-y-1 bg-light-blue rounded-md mx-3 mt-2">
                      <Link href="/hubs#intro" className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-700 hover:text-light-blue rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>Introduction to Hubs</Link>
                      <Link href="/hubs#membership" className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-700 hover:text-light-blue rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>How to Become a Member</Link>
                      <Link href="/hubs#terms-of-reference" className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-700 hover:text-light-blue rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>Terms of Reference</Link>
                      <Link href="/hubs#hub-leads" className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-700 hover:text-light-blue rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>Hub Leads</Link>
                    </div>
                  </div>
                </div>

                {/* Mobile Projects Dropdown */}
                <div>
                  <button
                    className="mobile-nav-item w-full text-left px-3 py-2 text-base font-bold text-gray-700 hover:text-dark-blue hover:bg-gray-50 rounded-md flex items-center justify-between transition-colors"
                    onClick={() => handleDropdownToggle('mobile-projects')}
                  >
                    Projects
                    <svg
                      className={`h-5 w-5 transform transition-transform duration-300 ${activeDropdown === 'mobile-projects' ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`mobile-dropdown ${activeDropdown === 'mobile-projects' ? 'active' : ''}`}>
                    <div className="pl-6 space-y-1 bg-light-blue rounded-md mx-3 mt-2">
                      <Link href="/projects#all-projects" className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-700 hover:text-light-blue rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>All Projects</Link>
                      <Link href="/projects#wash-projects" className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-700 hover:text-light-blue rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>WASH Projects</Link>
                      <Link href="/projects#nature-based" className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-700 hover:text-light-blue rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>Nature-Based Solutions</Link>
                      <Link href="/projects#ongoing" className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-700 hover:text-light-blue rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>Ongoing Projects</Link>
                      <Link href="/projects#completed" className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-700 hover:text-light-blue rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>Completed Projects</Link>
                    </div>
                  </div>
                </div>

                {/* Mobile Publications Dropdown */}
                <div>
                  <button
                    className="mobile-nav-item w-full text-left px-3 py-2 text-base font-bold text-gray-700 hover:text-dark-blue hover:bg-gray-50 rounded-md flex items-center justify-between transition-colors"
                    onClick={() => handleDropdownToggle('mobile-publications')}
                  >
                    Publications
                    <svg
                      className={`h-5 w-5 transform transition-transform duration-300 ${activeDropdown === 'mobile-publications' ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`mobile-dropdown ${activeDropdown === 'mobile-publications' ? 'active' : ''}`}>
                    <div className="pl-6 space-y-1 bg-light-blue rounded-md mx-3 mt-2">
                      <Link href="/publications#policy-briefs" className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-700 hover:text-light-blue rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>Policy Briefs</Link>
                      <Link href="/publications#articles" className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-700 hover:text-light-blue rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>Articles & Blog Posts</Link>
                      <Link href="/publications#press-releases" className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-700 hover:text-light-blue rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>Press Releases</Link>
                      <Link href="/publications#technical-reports" className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-700 hover:text-light-blue rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>Technical Reports</Link>
                    </div>
                  </div>
                </div>

                {/* Mobile Events Dropdown */}
                <div>
                  <button
                    className="mobile-nav-item w-full text-left px-3 py-2 text-base font-bold text-gray-700 hover:text-dark-blue hover:bg-gray-50 rounded-md flex items-center justify-between transition-colors"
                    onClick={() => handleDropdownToggle('mobile-events')}
                  >
                    Events
                    <svg
                      className={`h-5 w-5 transform transition-transform duration-300 ${activeDropdown === 'mobile-events' ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`mobile-dropdown ${activeDropdown === 'mobile-events' ? 'active' : ''}`}>
                    <div className="pl-6 space-y-1 bg-light-blue rounded-md mx-3 mt-2">
                      <Link href="/events#upcoming" className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-700 hover:text-light-blue rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>Upcoming Events</Link>
                      <Link href="/events#knowledge-sharing" className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-700 hover:text-light-blue rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>Knowledge Sharing Sessions</Link>
                      <Link href="/events#media-gallery" className="block px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-700 hover:text-light-blue rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>Media Gallery</Link>
                    </div>
                  </div>
                </div>

                <Link
                  href="/membership"
                  className="mobile-nav-item block px-3 py-2 text-base font-bold text-gray-700 hover:text-dark-blue hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Membership
                </Link>

                <Link
                  href="/partners"
                  className="mobile-nav-item block px-3 py-2 text-base font-bold text-gray-700 hover:text-dark-blue hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Partners
                </Link>

                <Link
                  href="/careers"
                  className="mobile-nav-item block px-3 py-2 text-base font-bold text-gray-700 hover:text-dark-blue hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Careers
                </Link>

                <Link
                  href="/contact"
                  className="mobile-nav-item block px-3 py-2 text-base font-bold text-gray-700 hover:text-dark-blue hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}