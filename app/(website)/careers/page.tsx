"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CareersPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const jobOpenings = [
    {
      title: "Water Systems Engineer",
      department: "Technical",
      location: "Kigali Hub",
      type: "Full-time",
      level: "Mid-level",
      deadline: "March 15, 2025",
      description: "Design and implement sustainable water infrastructure solutions across Rwanda",
      requirements: [
        "Bachelor's degree in Civil or Environmental Engineering",
        "3+ years experience in water systems design",
        "Knowledge of AutoCAD and GIS software",
        "Fluency in English and Kinyarwanda"
      ]
    },
    {
      title: "Community Engagement Coordinator",
      department: "Operations",
      location: "Eastern Hub",
      type: "Full-time",
      level: "Entry-level",
      deadline: "March 20, 2025",
      description: "Lead community outreach programs and stakeholder engagement initiatives",
      requirements: [
        "Bachelor's degree in Social Sciences or related field",
        "Strong communication and interpersonal skills",
        "Experience in community development preferred",
        "Willingness to travel within Eastern Province"
      ]
    },
    {
      title: "Research Associate",
      department: "Research",
      location: "Kigali Hub",
      type: "Contract",
      level: "Entry-level",
      deadline: "April 5, 2025",
      description: "Support research initiatives on water governance and policy analysis",
      requirements: [
        "Master's degree in Water Resources, Public Policy, or related field",
        "Strong analytical and writing skills",
        "Experience with statistical software (R, SPSS)",
        "Interest in water policy and governance"
      ]
    }
  ];

  const internships = [
    {
      title: "Engineering Internship Program",
      duration: "6 months",
      location: "Multiple Hubs",
      deadline: "February 28, 2025",
      description: "Hands-on experience in water infrastructure projects and technical design",
      eligibility: "Final year engineering students or recent graduates"
    },
    {
      title: "Communications & Media Internship",
      duration: "4 months",
      location: "Kigali Hub",
      deadline: "March 10, 2025",
      description: "Support content creation, social media management, and public relations",
      eligibility: "Students in Communications, Journalism, or Marketing"
    },
    {
      title: "Research & Data Analysis Internship",
      duration: "5 months",
      location: "Remote/Kigali",
      deadline: "March 25, 2025",
      description: "Assist with data collection, analysis, and research report preparation",
      eligibility: "Graduate students in relevant fields"
    }
  ];

  const fellowships = [
    {
      title: "RYWP Young Leaders Fellowship",
      duration: "12 months",
      value: "$15,000",
      deadline: "April 15, 2025",
      description: "Comprehensive leadership development program for emerging water professionals",
      benefits: [
        "Monthly stipend and project funding",
        "Mentorship from senior professionals",
        "International conference participation",
        "Certificate in Water Leadership"
      ]
    },
    {
      title: "Innovation Challenge Fellowship",
      duration: "8 months",
      value: "$10,000",
      deadline: "May 1, 2025",
      description: "Support innovative water solutions with funding and technical mentorship",
      benefits: [
        "Seed funding for innovative projects",
        "Access to RYWP's technical expertise",
        "Networking with industry leaders",
        "Prototype development support"
      ]
    }
  ];

  const proposals = [
    {
      title: "Community Water Access Initiative",
      funding: "$50,000 - $100,000",
      deadline: "June 30, 2025",
      focus: "Rural water access and sanitation projects",
      eligibility: "NGOs, community organizations, and social enterprises"
    },
    {
      title: "Water Technology Innovation Grant",
      funding: "$25,000 - $75,000",
      deadline: "July 15, 2025",
      focus: "Development of innovative water treatment technologies",
      eligibility: "Startups, researchers, and technology companies"
    },
    {
      title: "Youth Engagement Program Grant",
      funding: "$15,000 - $40,000",
      deadline: "August 1, 2025",
      focus: "Educational and capacity building programs for young people",
      eligibility: "Educational institutions and youth organizations"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <span className="text-white text-2xl">Careers & Opportunities Image</span>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className={`text-white max-w-3xl transition-all duration-700 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <h1 className="text-5xl font-light mb-4">Careers & Opportunities</h1>
              <p className="text-xl font-light opacity-90">
                Join our network to transform Rwanda&#39;s water landscape through meaningful career opportunities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join RYWP */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-1 h-12 bg-dark-blue mr-4"></div>
                <h2 className="text-3xl font-light text-gray-900">Why Join RYWP?</h2>
              </div>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                At RYWP, you&#39;ll be part of a dynamic team committed to solving Rwanda&#39;s water challenges
                while building your career in a supportive, innovation-driven environment.
              </p>

              <div className="space-y-6">
                <div className="border-l-4 border-dark-blue pl-6">
                  <h3 className="font-medium text-gray-900 mb-2">Meaningful Impact</h3>
                  <p className="text-gray-600">Work on projects that directly improve communities and advance sustainable development</p>
                </div>
                <div className="border-l-4 border-light-blue pl-6">
                  <h3 className="font-medium text-gray-900 mb-2">Professional Growth</h3>
                  <p className="text-gray-600">Access to training, mentorship, and career advancement opportunities</p>
                </div>
                <div className="border-l-4 border-lighter-blue pl-6">
                  <h3 className="font-medium text-gray-900 mb-2">Collaborative Culture</h3>
                  <p className="text-gray-600">Work with passionate professionals in a supportive team environment</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-300 h-96 flex items-center justify-center">
                <span className="text-gray-600 text-xl">Team Working Image</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities Tabs */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Current Opportunities</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our current openings across different categories and find the right opportunity for you
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center mb-12 gap-2">
            {[
              { key: 'jobs', label: 'Job Openings', count: jobOpenings.length },
              { key: 'internships', label: 'Internships', count: internships.length },
              { key: 'fellowships', label: 'Fellowships', count: fellowships.length },
              { key: 'proposals', label: 'Call for Proposals', count: proposals.length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 transition-colors duration-300 ${
                  activeTab === tab.key
                    ? 'bg-dark-blue text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Job Openings */}
          {activeTab === 'jobs' && (
            <div className="space-y-8">
              {jobOpenings.map((job, index) => (
                <div key={index} className="bg-white p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <h3 className="text-2xl font-medium text-gray-900">{job.title}</h3>
                        <span className="bg-dark-blue text-white px-3 py-1 text-sm">{job.type}</span>
                        <span className="bg-light-blue text-white px-3 py-1 text-sm">{job.level}</span>
                      </div>

                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                        <span>📍 {job.location}</span>
                        <span>🏢 {job.department}</span>
                        <span>📅 Deadline: {job.deadline}</span>
                      </div>

                      <p className="text-gray-600 mb-6">{job.description}</p>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Key Requirements:</h4>
                        <ul className="space-y-2">
                          {job.requirements.map((req, reqIndex) => (
                            <li key={reqIndex} className="flex items-start">
                              <div className="w-2 h-2 bg-light-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-gray-600">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between">
                      <div className="bg-gray-50 p-6 mb-6">
                        <h4 className="font-medium text-gray-900 mb-4">Quick Info</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Department:</span>
                            <span className="font-medium">{job.department}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Location:</span>
                            <span className="font-medium">{job.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-medium">{job.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Level:</span>
                            <span className="font-medium">{job.level}</span>
                          </div>
                        </div>
                      </div>

                      <Link
                        href="/apply"
                        className="w-full block text-center bg-dark-blue text-white py-3 hover:bg-light-blue transition-colors duration-300"
                      >
                        Apply Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Internships */}
          {activeTab === 'internships' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {internships.map((internship, index) => (
                <div key={index} className="bg-white p-8">
                  <h3 className="text-xl font-medium text-gray-900 mb-4">{internship.title}</h3>
                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{internship.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{internship.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deadline:</span>
                      <span className="font-medium">{internship.deadline}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{internship.description}</p>
                  <p className="text-sm text-gray-600 mb-6"><strong>Eligibility:</strong> {internship.eligibility}</p>

                  <Link
                    href="/apply"
                    className="w-full block text-center bg-light-blue text-white py-3 hover:bg-dark-blue transition-colors duration-300"
                  >
                    Apply for Internship
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Fellowships */}
          {activeTab === 'fellowships' && (
            <div className="space-y-8">
              {fellowships.map((fellowship, index) => (
                <div key={index} className="bg-white p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-2xl font-medium text-gray-900">{fellowship.title}</h3>
                        <span className="bg-lighter-blue text-white px-3 py-1 text-sm">{fellowship.value}</span>
                      </div>

                      <div className="space-y-2 mb-6 text-sm text-gray-600">
                        <p>⏱️ Duration: {fellowship.duration}</p>
                        <p>📅 Deadline: {fellowship.deadline}</p>
                      </div>

                      <p className="text-gray-600 mb-6">{fellowship.description}</p>

                      <Link
                        href="/apply"
                        className="inline-block bg-dark-blue text-white px-8 py-3 hover:bg-light-blue transition-colors duration-300"
                      >
                        Apply for Fellowship
                      </Link>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Program Benefits:</h4>
                      <div className="space-y-3">
                        {fellowship.benefits.map((benefit, benefitIndex) => (
                          <div key={benefitIndex} className="flex items-start">
                            <div className="w-2 h-2 bg-lighter-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-600">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Call for Proposals */}
          {activeTab === 'proposals' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {proposals.map((proposal, index) => (
                <div key={index} className="bg-white p-6">
                  <h3 className="text-xl font-medium text-gray-900 mb-4">{proposal.title}</h3>
                  <div className="space-y-3 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Funding Range:</span>
                      <span className="font-medium text-light-blue">{proposal.funding}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deadline:</span>
                      <span className="font-medium">{proposal.deadline}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{proposal.focus}</p>
                  <p className="text-sm text-gray-600 mb-6"><strong>Eligible Applicants:</strong> {proposal.eligibility}</p>

                  <Link
                    href="/apply"
                    className="w-full block text-center bg-lighter-blue text-white py-3 hover:bg-dark-blue transition-colors duration-300"
                  >
                    Submit Proposal
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}