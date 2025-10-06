"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function EventsPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeView, setActiveView] = useState('upcoming');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const upcomingEvents = [
    {
      title: "Rwanda Water Week 2025",
      date: "March 18-22, 2025",
      time: "9:00 AM - 5:00 PM",
      location: "Kigali Convention Centre",
      type: "Conference",
      category: "major",
      description: "Annual national conference bringing together water professionals, policymakers, and stakeholders to discuss Rwanda's water future.",
      agenda: ["Policy roundtables", "Technical presentations", "Innovation showcase", "Networking sessions"],
      registration: "Open",
      fee: "Free for RYWP members"
    },
    {
      title: "Youth Water Innovation Challenge",
      date: "April 10, 2025",
      time: "8:00 AM - 6:00 PM",
      location: "University of Rwanda, Kigali",
      type: "Competition",
      category: "knowledge-sharing",
      description: "Student competition to develop innovative solutions for water challenges in Rwanda.",
      agenda: ["Pitch presentations", "Technical judging", "Mentorship sessions", "Awards ceremony"],
      registration: "Open until March 15",
      fee: "Free for participants"
    },
    {
      title: "Community Water Systems Training",
      date: "April 25-26, 2025",
      time: "9:00 AM - 4:00 PM",
      location: "Eastern Hub, Kayonza",
      type: "Training",
      category: "knowledge-sharing",
      description: "Hands-on training for community water system operators and managers.",
      agenda: ["System maintenance", "Water quality testing", "Financial management", "Community engagement"],
      registration: "Limited to 30 participants",
      fee: "$25 per participant"
    },
    {
      title: "Water Policy Forum",
      date: "May 8, 2025",
      time: "2:00 PM - 5:00 PM",
      location: "MININFRA Conference Hall, Kigali",
      type: "Forum",
      category: "knowledge-sharing",
      description: "High-level dialogue on water governance and policy implementation in Rwanda.",
      agenda: ["Policy updates", "Implementation challenges", "Stakeholder feedback", "Way forward"],
      registration: "By invitation",
      fee: "Free"
    },
    {
      title: "Technical Skills Workshop: GIS for Water",
      date: "May 22, 2025",
      time: "9:00 AM - 5:00 PM",
      location: "Kigali Hub Training Center",
      type: "Workshop",
      category: "knowledge-sharing",
      description: "Advanced GIS applications for water resource mapping and analysis.",
      agenda: ["GIS fundamentals", "Water mapping techniques", "Data analysis", "Project applications"],
      registration: "Open",
      fee: "$50 for non-members"
    },
    {
      title: "Annual RYWP General Assembly",
      date: "June 15, 2025",
      time: "9:00 AM - 3:00 PM",
      location: "Serena Hotel, Kigali",
      type: "Assembly",
      category: "major",
      description: "Annual meeting of all RYWP members to review progress and plan future activities.",
      agenda: ["Annual reports", "Strategic planning", "Elections", "Member recognition"],
      registration: "RYWP members only",
      fee: "Free for members"
    }
  ];

  const pastEvents = [
    {
      title: "Water Infrastructure Summit 2024",
      date: "November 12-13, 2024",
      location: "Kigali Convention Centre",
      type: "Conference",
      description: "Two-day summit on sustainable water infrastructure development in Rwanda.",
      attendance: 350,
      outcomes: ["Policy recommendations", "Partnership agreements", "Technical guidelines"]
    },
    {
      title: "Community Engagement Workshop Series",
      date: "October 5-20, 2024",
      location: "Multiple Hubs",
      type: "Training",
      description: "Multi-location workshop series on effective community engagement strategies.",
      attendance: 150,
      outcomes: ["Trained facilitators", "Engagement toolkit", "Community partnerships"]
    },
    {
      title: "Young Professionals Networking Night",
      date: "September 28, 2024",
      location: "Impact Hub Kigali",
      type: "Networking",
      description: "Informal networking event for young water professionals across sectors.",
      attendance: 80,
      outcomes: ["New connections", "Collaboration ideas", "Mentorship matches"]
    }
  ];

  const knowledgeSharingSessions = [
    {
      title: "Monthly Technical Webinar Series",
      schedule: "First Thursday of every month",
      time: "3:00 PM - 4:00 PM",
      format: "Virtual",
      description: "Regular webinars featuring technical presentations from water professionals.",
      upcomingTopics: [
        "Smart Water Meters Implementation - March 7",
        "Wastewater Treatment Innovations - April 4",
        "Rural Water Supply Challenges - May 2"
      ]
    },
    {
      title: "Hub Learning Circles",
      schedule: "Bi-weekly",
      time: "6:00 PM - 7:30 PM",
      format: "In-person at each hub",
      description: "Peer-to-peer learning sessions where members share experiences and best practices.",
      topics: ["Project case studies", "Technical challenges", "Career development", "Industry trends"]
    },
    {
      title: "Research Presentation Series",
      schedule: "Quarterly",
      time: "2:00 PM - 5:00 PM",
      format: "Hybrid (In-person + Virtual)",
      description: "Platform for researchers to present findings and receive feedback from practitioners.",
      focus: ["Applied research", "Policy analysis", "Technology assessment", "Impact evaluation"]
    }
  ];

  const mediaGallery = [
    {
      event: "Rwanda Water Week 2024",
      type: "Conference",
      date: "March 2024",
      mediaCount: { photos: 45, videos: 8 },
      highlights: ["Opening ceremony", "Panel discussions", "Exhibition showcase", "Networking sessions"]
    },
    {
      event: "Community Water Project Launch",
      type: "Project Event",
      date: "February 2024",
      mediaCount: { photos: 32, videos: 5 },
      highlights: ["Groundbreaking ceremony", "Community speeches", "Technical demonstrations", "Local media coverage"]
    },
    {
      event: "Youth Innovation Challenge 2024",
      type: "Competition",
      date: "January 2024",
      mediaCount: { photos: 28, videos: 12 },
      highlights: ["Student presentations", "Judging process", "Award ceremony", "Innovation showcase"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <span className="text-white text-2xl">Events & Gatherings Image</span>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className={`text-white max-w-3xl transition-all duration-700 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <h1 className="text-5xl font-light mb-4">Events & Media</h1>
              <p className="text-xl font-light opacity-90">
                Connect, learn, and collaborate through our diverse events and knowledge sharing initiatives
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Categories Overview */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-dark-blue mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Major Events</h3>
              <p className="text-gray-600">Annual conferences, summits, and large-scale gatherings that bring together the entire water community.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-light-blue mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Knowledge Sharing</h3>
              <p className="text-gray-600">Regular workshops, training sessions, and learning opportunities for professional development.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-lighter-blue mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Media Gallery</h3>
              <p className="text-gray-600">Photo and video documentation of our events, projects, and community activities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Navigation */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Event Calendar</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay updated with our upcoming events and explore our past activities
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-white p-1 rounded-lg">
              <button
                onClick={() => setActiveView('upcoming')}
                className={`px-8 py-3 transition-colors duration-300 ${
                  activeView === 'upcoming'
                    ? 'bg-dark-blue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Upcoming Events
              </button>
              <button
                onClick={() => setActiveView('past')}
                className={`px-8 py-3 transition-colors duration-300 ${
                  activeView === 'past'
                    ? 'bg-dark-blue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Past Events
              </button>
            </div>
          </div>

          {/* Upcoming Events */}
          {activeView === 'upcoming' && (
            <div id="upcoming" className="space-y-8">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="bg-white p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-2xl font-medium text-gray-900">{event.title}</h3>
                        <span className={`px-3 py-1 text-sm text-white ${
                          event.category === 'major' ? 'bg-dark-blue' : 'bg-light-blue'
                        }`}>
                          {event.type}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm text-gray-600">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {event.date}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {event.time}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {event.location}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {event.fee}
                        </div>
                      </div>

                      <p className="text-gray-600 mb-6">{event.description}</p>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Event Agenda:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {event.agenda.map((item, agendaIndex) => (
                            <div key={agendaIndex} className="flex items-center">
                              <div className="w-2 h-2 bg-light-blue rounded-full mr-3 flex-shrink-0"></div>
                              <span className="text-gray-600 text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between">
                      <div className="bg-gray-50 p-6 mb-6">
                        <h4 className="font-medium text-gray-900 mb-4">Registration</h4>
                        <p className="text-sm text-gray-600 mb-4">{event.registration}</p>
                        <div className="space-y-3">
                          <div className="text-sm">
                            <span className="text-gray-600">Fee: </span>
                            <span className="font-medium">{event.fee}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Link
                          href="/register"
                          className="w-full block text-center bg-dark-blue text-white py-3 hover:bg-light-blue transition-colors duration-300"
                        >
                          Register Now
                        </Link>
                        <Link
                          href="/events/details"
                          className="w-full block text-center border border-dark-blue text-dark-blue py-3 hover:bg-dark-blue hover:text-white transition-colors duration-300"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Past Events */}
          {activeView === 'past' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {pastEvents.map((event, index) => (
                <div key={index} className="bg-white p-6">
                  <h3 className="text-xl font-medium text-gray-900 mb-3">{event.title}</h3>
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">{event.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-medium">{event.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Attendance:</span>
                      <span className="font-medium">{event.attendance} participants</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{event.description}</p>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Key Outcomes:</h4>
                    <div className="space-y-1">
                      {event.outcomes.map((outcome, outcomeIndex) => (
                        <div key={outcomeIndex} className="flex items-start">
                          <div className="w-2 h-2 bg-lighter-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-600 text-sm">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Media Gallery */}
      <section id="media-gallery" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Media Gallery</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Visual documentation of our events, projects, and community activities
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {mediaGallery.map((gallery, index) => (
              <div key={index} className="bg-white overflow-hidden">
                <div className="bg-gray-300 h-48 flex items-center justify-center">
                  <span className="text-gray-600">Event Photos</span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{gallery.event}</h3>
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <span>{gallery.type}</span>
                    <span>•</span>
                    <span>{gallery.date}</span>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <span className="text-gray-600">{gallery.mediaCount.photos} Photos</span>
                    <span className="text-gray-600">{gallery.mediaCount.videos} Videos</span>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Highlights:</h4>
                    <div className="flex flex-wrap gap-2">
                      {gallery.highlights.map((highlight, highlightIndex) => (
                        <span key={highlightIndex} className="bg-gray-100 text-gray-700 px-2 py-1 text-xs">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href="/gallery"
                    className="text-dark-blue hover:text-light-blue transition-colors duration-300 text-sm font-medium"
                  >
                    View Gallery →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/gallery"
              className="inline-block bg-dark-blue text-white px-8 py-3 hover:bg-light-blue transition-colors duration-300"
            >
              Browse All Media
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-light text-white mb-4">Didn&#39;t Find Your Event?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect with Rwanda&#39;s water community and advance your professional development
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="border border-light-blue text-light-blue px-8 py-3 hover:bg-light-blue hover:text-white transition-all duration-300"
            >
              Suggest an Event
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}