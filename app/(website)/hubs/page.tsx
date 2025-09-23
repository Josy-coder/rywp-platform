"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function HubsPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeHub, setActiveHub] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const hubs = [
    {
      name: "Kigali Hub",
      region: "Central Rwanda",
      description: "Our flagship hub focusing on urban water management, policy development, and innovation in water treatment technologies.",
      objectives: [
        "Urban water system optimization",
        "Smart water technology implementation",
        "Policy advocacy and development",
        "Public-private partnership facilitation"
      ],
      recentActivities: [
        "Smart meter pilot project in Nyarugenge District",
        "Water quality monitoring workshop series",
        "Policy brief on urban water tariffs",
        "Partnership with City of Kigali on water master plan"
      ],
      lead: {
        name: "Samuel Rwigema",
        role: "Hub Coordinator",
        email: "samuel@rywp.rw",
        phone: "+250 788 123 456"
      },
      members: 145,
      projects: 8
    },
    {
      name: "Eastern Hub",
      region: "Eastern Province",
      description: "Focused on rural water access, agricultural water management, and community-based water initiatives in Eastern Rwanda.",
      objectives: [
        "Rural water access expansion",
        "Irrigation system development",
        "Community water management training",
        "Water-agriculture nexus solutions"
      ],
      recentActivities: [
        "Community borehole rehabilitation in Rwamagana",
        "Farmer training on drip irrigation systems",
        "Water user association capacity building",
        "Groundwater mapping initiative"
      ],
      lead: {
        name: "Grace Mutesi",
        role: "Hub Coordinator",
        email: "grace@rywp.rw",
        phone: "+250 788 234 567"
      },
      members: 98,
      projects: 6
    },
    {
      name: "Western Hub",
      region: "Western Province",
      description: "Specializing in watershed management, environmental conservation, and nature-based water solutions in Western Rwanda.",
      objectives: [
        "Watershed protection and restoration",
        "Eco-friendly water treatment systems",
        "Community conservation programs",
        "Climate resilience building"
      ],
      recentActivities: [
        "Reforestation project along Kivu Lake shores",
        "Constructed wetland pilot for wastewater treatment",
        "Community training on rainwater harvesting",
        "Erosion control measures in Nyamasheke"
      ],
      lead: {
        name: "Eric Habimana",
        role: "Hub Coordinator",
        email: "eric@rywp.rw",
        phone: "+250 788 345 678"
      },
      members: 87,
      projects: 5
    },
    {
      name: "Northern Hub",
      region: "Northern Province",
      description: "Dedicated to capacity building, youth engagement, and innovative water technologies in Northern Rwanda.",
      objectives: [
        "Youth leadership development",
        "Technical skills training",
        "Innovation and research support",
        "Cross-border water cooperation"
      ],
      recentActivities: [
        "Youth water leadership bootcamp in Musanze",
        "Solar-powered water pumping system installation",
        "Research collaboration with University of Rwanda",
        "Cross-border water dialogue with Uganda"
      ],
      lead: {
        name: "Claudine Uwase",
        role: "Hub Coordinator",
        email: "claudine@rywp.rw",
        phone: "+250 788 456 789"
      },
      members: 76,
      projects: 4
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <span className="text-white text-2xl">Hubs Network Image</span>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className={`text-white max-w-3xl transition-all duration-700 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <h1 className="text-5xl font-light mb-4">Our Hubs</h1>
              <p className="text-xl font-light opacity-90">
                Four regional centers of excellence driving water innovation across Rwanda
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction to Hubs */}
      <section id="intro" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-1 h-12 bg-dark-blue mr-4"></div>
                <h2 className="text-3xl font-light text-gray-900">Hub Network</h2>
              </div>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Our regional hub system ensures that RYWP&#39;s impact reaches every corner of Rwanda.
                Each hub operates with local autonomy while maintaining strong connections to our
                national network and shared objectives.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Through this decentralized approach, we can address region-specific water challenges
                while fostering knowledge exchange and collaboration between different areas of the country.
              </p>
            </div>

            <div className="relative">
              <div className="bg-gray-300 h-80 flex items-center justify-center">
                <span className="text-gray-600 text-xl">Rwanda Map with Hubs</span>
              </div>
            </div>
          </div>

          {/* Hub Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-200">
            <div className="text-center">
              <div className="text-4xl font-light text-dark-blue mb-2">4</div>
              <div className="text-gray-600">Regional Hubs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-dark-blue mb-2">406</div>
              <div className="text-gray-600">Total Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-dark-blue mb-2">23</div>
              <div className="text-gray-600">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-dark-blue mb-2">30</div>
              <div className="text-gray-600">Districts Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Hub Details */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Hub Details</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore each of our regional hubs and discover their unique focus areas and achievements
            </p>
          </div>

          {/* Hub Navigation */}
          <div className="flex flex-wrap justify-center mb-12 gap-4">
            {hubs.map((hub, index) => (
              <button
                key={index}
                onClick={() => setActiveHub(index)}
                className={`px-6 py-3 transition-colors duration-300 ${
                  activeHub === index
                    ? 'bg-dark-blue text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {hub.name}
              </button>
            ))}
          </div>

          {/* Active Hub Content */}
          <div className="bg-white p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Hub Overview */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-3xl font-light text-gray-900 mb-2">{hubs[activeHub].name}</h3>
                    <p className="text-light-blue font-medium">{hubs[activeHub].region}</p>
                  </div>
                  <div className="flex space-x-6 text-center">
                    <div>
                      <div className="text-2xl font-light text-dark-blue">{hubs[activeHub].members}</div>
                      <div className="text-sm text-gray-600">Members</div>
                    </div>
                    <div>
                      <div className="text-2xl font-light text-dark-blue">{hubs[activeHub].projects}</div>
                      <div className="text-sm text-gray-600">Projects</div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  {hubs[activeHub].description}
                </p>

                {/* Objectives */}
                <div className="mb-8">
                  <h4 className="text-xl font-medium text-gray-900 mb-4">Key Objectives</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hubs[activeHub].objectives.map((objective, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-light-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-600">{objective}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activities */}
                <div>
                  <h4 className="text-xl font-medium text-gray-900 mb-4">Recent Activities</h4>
                  <div className="space-y-4">
                    {hubs[activeHub].recentActivities.map((activity, index) => (
                      <div key={index} className="border-l-4 border-lighter-blue pl-4">
                        <p className="text-gray-600">{activity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hub Lead Contact */}
              <div>
                <div className="bg-gray-50 p-6">
                  <h4 className="text-xl font-medium text-gray-900 mb-4">Hub Coordinator</h4>
                  <div className="bg-gray-300 w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-gray-600 text-xs">Photo</span>
                  </div>
                  <div className="text-center mb-6">
                    <h5 className="text-lg font-medium text-gray-900 mb-1">{hubs[activeHub].lead.name}</h5>
                    <p className="text-dark-blue font-medium text-sm mb-4">{hubs[activeHub].lead.role}</p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex items-center justify-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {hubs[activeHub].lead.email}
                      </p>
                      <p className="flex items-center justify-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {hubs[activeHub].lead.phone}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`mailto:${hubs[activeHub].lead.email}`}
                    className="w-full block text-center bg-dark-blue text-white py-3 hover:bg-light-blue transition-colors duration-300"
                  >
                    Contact Hub
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Become a Member */}
      <section id="membership" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">How to Become a Member</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join your regional hub and become part of Rwanda&#39;s water professional network
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-dark-blue mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl rounded-full">
                  1
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Choose Your Hub</h3>
                <p className="text-gray-600 text-sm">Select the regional hub that aligns with your location and interests</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-light-blue mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl rounded-full">
                  2
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Submit Application</h3>
                <p className="text-gray-600 text-sm">Complete our online application form with your background and motivation</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-lighter-blue mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl rounded-full">
                  3
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Review Process</h3>
                <p className="text-gray-600 text-sm">Our team reviews your application and conducts a brief interview</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gray-700 mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl rounded-full">
                  4
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome & Onboard</h3>
                <p className="text-gray-600 text-sm">Join your hub community and start participating in activities</p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                href="/membership"
                className="inline-block bg-dark-blue text-white px-8 py-4 text-lg hover:bg-light-blue transition-colors duration-300"
              >
                Start Your Application
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Terms of Reference */}
      <section id="terms-of-reference" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light text-gray-900 mb-4">Terms of Reference</h2>
              <p className="text-xl text-gray-600">
                Governance framework and operational guidelines for our hub network
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-light text-gray-900 mb-6">Hub Governance</h3>
                <div className="space-y-4 text-gray-600">
                  <p>Each hub operates under a structured governance framework that ensures accountability, transparency, and effective coordination with the national RYWP network.</p>
                  <p>Hub coordinators are elected by members for two-year terms and work closely with the national executive committee to align local activities with broader organizational objectives.</p>
                </div>

                <h3 className="text-2xl font-light text-gray-900 mb-6 mt-8">Member Responsibilities</h3>
                <div className="space-y-4 text-gray-600">
                  <p>Members are expected to actively participate in hub activities, contribute to project implementation, and uphold RYWP&#39;s core values in all professional interactions.</p>
                  <p>Regular attendance at hub meetings and constructive participation in collaborative initiatives are key expectations for all members.</p>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-light text-gray-900 mb-6">Resource Management</h3>
                <div className="space-y-4 text-gray-600">
                  <p>Hubs manage local resources including project funds, equipment, and partnerships while maintaining transparency through regular financial reporting to the national office.</p>
                  <p>All procurement and financial decisions follow established guidelines to ensure proper stewardship of organizational resources.</p>
                </div>

                <h3 className="text-2xl font-light text-gray-900 mb-6 mt-8">Quality Standards</h3>
                <div className="space-y-4 text-gray-600">
                  <p>All hub activities must meet RYWP&#39;s quality standards for technical excellence, community engagement, and professional development outcomes.</p>
                  <p>Regular monitoring and evaluation processes ensure continuous improvement and alignment with national priorities.</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                href="/downloads/rywp-hub-terms-of-reference.pdf"
                className="inline-flex items-center bg-light-blue text-white px-8 py-3 hover:bg-dark-blue transition-colors duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Full Terms of Reference (PDF)
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}