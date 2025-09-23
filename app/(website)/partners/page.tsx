"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function PartnersPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const partners = [
    {
      name: "Ministry of Infrastructure (MININFRA)",
      category: "government",
      type: "Strategic Partner",
      description: "Collaboration on national water policy development and infrastructure projects",
      partnership: "Policy development, regulatory framework, national water strategy",
      duration: "2022 - Present",
      logo: "/images/partners/mininfra.png"
    },
    {
      name: "Rwanda Water and Sanitation Corporation (WASAC)",
      category: "government",
      type: "Implementation Partner",
      description: "Joint implementation of water supply and treatment projects across Rwanda",
      partnership: "Infrastructure projects, technical expertise sharing, capacity building",
      duration: "2022 - Present",
      logo: "/images/partners/wasac.png"
    },
    {
      name: "University of Rwanda - College of Science and Technology",
      category: "academic",
      type: "Academic Partner",
      description: "Research collaboration and student exchange programs",
      partnership: "Research projects, student internships, joint publications, technical training",
      duration: "2023 - Present",
      logo: "/images/partners/ur.png"
    },
    {
      name: "Carnegie Mellon University Africa",
      category: "academic",
      type: "Research Partner",
      description: "Technology innovation and engineering solutions for water challenges",
      partnership: "Technology development, research grants, innovation challenges",
      duration: "2023 - 2026",
      logo: "/images/partners/cmu-africa.png"
    },
    {
      name: "USAID Rwanda",
      category: "international",
      type: "Funding Partner",
      description: "Supporting community water access and governance programs",
      partnership: "Project funding, capacity building, monitoring and evaluation",
      duration: "2023 - 2025",
      logo: "/images/partners/usaid.png"
    },
    {
      name: "World Bank Group",
      category: "international",
      type: "Development Partner",
      description: "Technical assistance and project financing for water infrastructure",
      partnership: "Project financing, technical advisory, knowledge sharing",
      duration: "2024 - Present",
      logo: "/images/partners/worldbank.png"
    },
    {
      name: "UN-Water",
      category: "international",
      type: "Network Partner",
      description: "Global water advocacy and knowledge sharing platform",
      partnership: "Advocacy campaigns, global networking, best practices sharing",
      duration: "2023 - Present",
      logo: "/images/partners/unwater.png"
    },
    {
      name: "Inyenyeri Water Solutions",
      category: "private",
      type: "Technology Partner",
      description: "Private sector collaboration on innovative water treatment solutions",
      partnership: "Technology deployment, pilot projects, market development",
      duration: "2023 - Present",
      logo: "/images/partners/inyenyeri.png"
    },
    {
      name: "Aqua-Tech Rwanda Ltd",
      category: "private",
      type: "Implementation Partner",
      description: "Engineering services and equipment supply for water projects",
      partnership: "Engineering services, equipment supply, maintenance support",
      duration: "2022 - Present",
      logo: "/images/partners/aquatech.png"
    },
    {
      name: "Water for People Rwanda",
      category: "ngo",
      type: "Development Partner",
      description: "Community-based water and sanitation programs",
      partnership: "Community engagement, project implementation, sustainability training",
      duration: "2022 - Present",
      logo: "/images/partners/waterforpeople.png"
    },
    {
      name: "WaterAid Rwanda",
      category: "ngo",
      type: "Advocacy Partner",
      description: "Water, sanitation, and hygiene advocacy and programming",
      partnership: "Advocacy initiatives, community programs, policy influence",
      duration: "2023 - Present",
      logo: "/images/partners/wateraid.png"
    },
    {
      name: "Rwanda Environment Management Authority (REMA)",
      category: "government",
      type: "Regulatory Partner",
      description: "Environmental compliance and watershed management collaboration",
      partnership: "Environmental assessments, watershed management, compliance monitoring",
      duration: "2022 - Present",
      logo: "/images/partners/rema.png"
    }
  ];

  const categories = [
    { key: 'all', label: 'All Partners', count: partners.length },
    { key: 'government', label: 'Government', count: partners.filter(p => p.category === 'government').length },
    { key: 'international', label: 'International', count: partners.filter(p => p.category === 'international').length },
    { key: 'academic', label: 'Academic', count: partners.filter(p => p.category === 'academic').length },
    { key: 'private', label: 'Private Sector', count: partners.filter(p => p.category === 'private').length },
    { key: 'ngo', label: 'NGOs/CSOs', count: partners.filter(p => p.category === 'ngo').length }
  ];

  const filteredPartners = activeCategory === 'all'
    ? partners
    : partners.filter(partner => partner.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <span className="text-white text-2xl">Partnership Network Image</span>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className={`text-white max-w-3xl transition-all duration-700 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <h1 className="text-5xl font-light mb-4">Our Partners</h1>
              <p className="text-xl font-light opacity-90">
                Building strategic alliances to accelerate water solutions across Rwanda
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Approach */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-1 h-12 bg-dark-blue mr-4"></div>
                <h2 className="text-3xl font-light text-gray-900">Partnership Approach</h2>
              </div>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                RYWP believes in the power of collaboration. Our partnerships span government agencies,
                international organizations, academic institutions, private sector companies, and civil society organizations.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Together, we leverage diverse expertise, resources, and networks to create sustainable
                water solutions that benefit all Rwandans.
              </p>
            </div>

            <div className="relative">
              <div className="bg-gray-300 h-80 flex items-center justify-center">
                <span className="text-gray-600 text-xl">Partnership Ecosystem Diagram</span>
              </div>
            </div>
          </div>

          {/* Partnership Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-200">
            <div className="text-center">
              <div className="text-4xl font-light text-dark-blue mb-2">12+</div>
              <div className="text-gray-600">Active Partners</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-dark-blue mb-2">5</div>
              <div className="text-gray-600">Partner Categories</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-dark-blue mb-2">25+</div>
              <div className="text-gray-600">Joint Projects</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-dark-blue mb-2">$2M+</div>
              <div className="text-gray-600">Leveraged Funding</div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Directory */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Partner Directory</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our diverse network of partners across different sectors and collaboration areas
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center mb-12 gap-2">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`px-6 py-3 transition-colors duration-300 ${
                  activeCategory === category.key
                    ? 'bg-dark-blue text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>

          {/* Partners Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredPartners.map((partner, index) => (
              <div key={index} className="bg-white p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-xl font-medium text-gray-900">{partner.name}</h3>
                      <span className="bg-light-blue text-white px-3 py-1 text-sm">{partner.type}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{partner.description}</p>
                  </div>
                  <div className="bg-gray-300 w-16 h-16 flex items-center justify-center ml-4 flex-shrink-0">
                    <span className="text-gray-600 text-xs text-center">Logo</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Partnership Areas:</h4>
                    <p className="text-gray-600 text-sm">{partner.partnership}</p>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Duration: {partner.duration}</span>
                    <div className={`w-3 h-3 rounded-full ${
                      partner.category === 'government' ? 'bg-dark-blue' :
                        partner.category === 'international' ? 'bg-light-blue' :
                          partner.category === 'academic' ? 'bg-lighter-blue' :
                            partner.category === 'private' ? 'bg-gray-700' :
                              'bg-green-500'
                    }`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Impact */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Partnership Impact</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Measuring the collective impact of our collaborative efforts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-dark-blue mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-light text-gray-900 mb-2">150,000+</h3>
              <h4 className="text-lg font-medium text-gray-900 mb-4">People Reached</h4>
              <p className="text-gray-600">Through joint projects and initiatives with our partner network</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-light-blue mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-2xl font-light text-gray-900 mb-2">25+</h3>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Completed Projects</h4>
              <p className="text-gray-600">Successfully delivered through strategic partnerships</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-lighter-blue mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-light text-gray-900 mb-2">$2.5M+</h3>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Resources Mobilized</h4>
              <p className="text-gray-600">In funding and in-kind contributions from partnership network</p>
            </div>
          </div>
        </div>
      </section>

      {/* Become a Partner */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-light text-gray-900 mb-8">Become a Partner</h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Join our network of organizations committed to transforming Rwanda&#39;s water sector through collaboration and innovation
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-6">
                <div className="w-12 h-12 bg-dark-blue mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Strategic Partnerships</h3>
                <p className="text-gray-600 text-sm">Long-term collaboration on policy, advocacy, and large-scale initiatives</p>
              </div>

              <div className="bg-white p-6">
                <div className="w-12 h-12 bg-light-blue mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Project Partnerships</h3>
                <p className="text-gray-600 text-sm">Collaborative implementation of specific water and sanitation projects</p>
              </div>

              <div className="bg-white p-6">
                <div className="w-12 h-12 bg-lighter-blue mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Knowledge Partnerships</h3>
                <p className="text-gray-600 text-sm">Research collaboration, capacity building, and knowledge exchange</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-dark-blue text-white px-8 py-3 hover:bg-light-blue transition-colors duration-300"
              >
                Explore Partnership
              </Link>
              <Link
                href="/downloads/partnership-framework.pdf"
                className="border border-dark-blue text-dark-blue px-8 py-3 hover:bg-dark-blue hover:text-white transition-all duration-300"
              >
                Download Partnership Framework
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-light text-white mb-4">Strengthen Our Network</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Together, we can accelerate progress toward sustainable water solutions for all Rwandans
          </p>

          <Link
            href="/contact"
            className="inline-block bg-light-blue text-white px-8 py-4 text-lg hover:bg-dark-blue transition-colors duration-300"
          >
            Start a Conversation
          </Link>
        </div>
      </section>
    </div>
  );
}