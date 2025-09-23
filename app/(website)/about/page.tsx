"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const foundingMembers = [
    { name: "Jean Claude Uwimana", role: "Co-Founder & Strategic Advisor", expertise: "Water Policy & Governance", image: "/images/team/jean-claude.jpg" },
    { name: "Marie Claire Mukamana", role: "Co-Founder & Technical Director", expertise: "Environmental Engineering", image: "/images/team/marie-claire.jpg" },
    { name: "Patrick Nkurunziza", role: "Co-Founder & Operations Lead", expertise: "Project Management", image: "/images/team/patrick.jpg" },
    { name: "Diane Uwimana", role: "Co-Founder & Community Relations", expertise: "Social Development", image: "/images/team/diane.jpg" }
  ];

  const managementTeam = [
    { name: "Samuel Rwigema", role: "Executive Director", hub: "Kigali Hub", expertise: "Water Systems Management", image: "/images/team/samuel.jpg" },
    { name: "Grace Mutesi", role: "Research Coordinator", hub: "Eastern Hub", expertise: "Water Quality Analysis", image: "/images/team/grace.jpg" },
    { name: "Eric Habimana", role: "Partnerships Manager", hub: "Western Hub", expertise: "Stakeholder Engagement", image: "/images/team/eric.jpg" },
    { name: "Claudine Uwase", role: "Training Director", hub: "Northern Hub", expertise: "Capacity Building", image: "/images/team/claudine.jpg" }
  ];

  const staffTeam = [
    { name: "David Nsengimana", role: "Project Coordinator", department: "Implementation", image: "/images/team/david.jpg" },
    { name: "Immaculee Nyirahabimana", role: "Communications Officer", department: "Outreach", image: "/images/team/immaculee.jpg" },
    { name: "Olivier Ntirenganya", role: "Technical Specialist", department: "Engineering", image: "/images/team/olivier.jpg" },
    { name: "Jeanne Uwimana", role: "Finance Manager", department: "Operations", image: "/images/team/jeanne.jpg" },
    { name: "Claude Niyonsenga", role: "Field Coordinator", department: "Implementation", image: "/images/team/claude.jpg" },
    { name: "Alice Mukashema", role: "Data Analyst", department: "Research", image: "/images/team/alice.jpg" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <span className="text-white text-2xl">About Us Hero Image</span>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className={`text-white max-w-3xl transition-all duration-700 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <h1 className="text-5xl font-light mb-4">About RYWP</h1>
              <p className="text-xl font-light opacity-90">
                Empowering Rwanda&#39;s next generation of water professionals through collaboration, innovation, and sustainable solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section id="vision-mission" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-1 h-12 bg-dark-blue mr-4"></div>
                <h2 className="text-3xl font-light text-gray-900">Our Vision</h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                A Rwanda where every community has access to safe, sustainable water services,
                managed by skilled young professionals who drive innovation and excellence in the water sector.
              </p>
            </div>

            <div>
              <div className="flex items-center mb-6">
                <div className="w-1 h-12 bg-light-blue mr-4"></div>
                <h2 className="text-3xl font-light text-gray-900">Our Mission</h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                To build capacity, foster collaboration, and advance sustainable water solutions
                through a dynamic network of young water professionals committed to transforming
                Rwanda&#39;s water landscape.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section id="core-values" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide our work and define our commitment to Rwanda&#39;s water future
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-dark-blue mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">Innovation</h3>
              <p className="text-gray-600">Embracing creative solutions and cutting-edge technologies to address water challenges.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-light-blue mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">Collaboration</h3>
              <p className="text-gray-600">Building partnerships and fostering teamwork across sectors and communities.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-lighter-blue mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">Excellence</h3>
              <p className="text-gray-600">Maintaining high standards in all our projects and professional development initiatives.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gray-700 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-900">Sustainability</h3>
              <p className="text-gray-600">Promoting long-term environmental and social responsibility in water management.</p>
            </div>
          </div>
        </div>
      </section>

      {/* History & Founding Story */}
      <section id="history" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-1 h-12 bg-light-blue mr-4"></div>
                <h2 className="text-3xl font-light text-gray-900">Our Story</h2>
              </div>

              <div className="space-y-6">
                <div className="border-l-4 border-dark-blue pl-6">
                  <h3 className="font-medium text-gray-900 mb-2">2022: The Beginning</h3>
                  <p className="text-gray-600">
                    Founded by four passionate water professionals who recognized the need for a
                    unified platform to empower young talent in Rwanda&#39;s water sector.
                  </p>
                </div>

                <div className="border-l-4 border-light-blue pl-6">
                  <h3 className="font-medium text-gray-900 mb-2">2023: Building Networks</h3>
                  <p className="text-gray-600">
                    Established regional hubs across Rwanda, launched our first training programs,
                    and began implementing community water projects.
                  </p>
                </div>

                <div className="border-l-4 border-lighter-blue pl-6">
                  <h3 className="font-medium text-gray-900 mb-2">2024: Expanding Impact</h3>
                  <p className="text-gray-600">
                    Grew to over 500 members, completed 15+ projects, and established partnerships
                    with government agencies and international organizations.
                  </p>
                </div>

                <div className="border-l-4 border-gray-400 pl-6">
                  <h3 className="font-medium text-gray-900 mb-2">2025: Looking Forward</h3>
                  <p className="text-gray-600">
                    Continuing to innovate and scale our impact across Rwanda&#39;s water landscape
                    while mentoring the next generation of water professionals.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-300 h-96 flex items-center justify-center">
                <span className="text-gray-600 text-xl">Founding Story Image</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founding Members */}
      <section id="founding-members" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Founding Members</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The visionary leaders who established RYWP and continue to guide our strategic direction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {foundingMembers.map((member, index) => (
              <div key={index} className="bg-white p-6">
                <div className="bg-gray-300 h-48 mb-6 flex items-center justify-center">
                  <span className="text-gray-600">Photo</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">{member.name}</h3>
                <p className="text-dark-blue font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.expertise}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hub Management Team */}
      <section id="management-team" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Hub Management Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Regional leaders driving our initiatives across Rwanda&#39;s four operational hubs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {managementTeam.map((member, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-300 h-56 mb-6 flex items-center justify-center">
                  <span className="text-gray-600">Photo</span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">{member.name}</h3>
                <p className="text-light-blue font-medium mb-1">{member.role}</p>
                <p className="text-dark-blue text-sm mb-2">{member.hub}</p>
                <p className="text-gray-600 text-sm">{member.expertise}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Staff Team */}
      <section id="staff-team" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Staff Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Dedicated professionals who ensure our day-to-day operations run smoothly and effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {staffTeam.map((member, index) => (
              <div key={index} className="bg-white p-6 flex items-center space-x-4">
                <div className="bg-gray-300 w-20 h-20 flex-shrink-0 flex items-center justify-center">
                  <span className="text-gray-600 text-xs">Photo</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-dark-blue font-medium text-sm mb-1">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.department}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-light text-white mb-4">Join Our Mission</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Be part of Rwanda&#39;s water transformation. Connect with passionate professionals and make a lasting impact.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/membership"
              className="bg-light-blue text-white px-8 py-3 hover:bg-dark-blue transition-colors duration-300"
            >
              Become a Member
            </Link>
            <Link
              href="/contact"
              className="border border-light-blue text-light-blue px-8 py-3 hover:bg-light-blue hover:text-white transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}