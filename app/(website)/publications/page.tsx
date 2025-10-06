"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function PublicationsPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const policyBriefs = [
    {
      title: "Strengthening Water Governance in Rwanda: Policy Recommendations for Sustainable Management",
      date: "February 2025",
      authors: ["Grace Mutesi", "Samuel Rwigema", "Dr. Jean Baptiste Nsengiyumva"],
      abstract: "This policy brief examines current water governance structures in Rwanda and provides evidence-based recommendations for strengthening institutional frameworks and regulatory mechanisms.",
      pages: 12,
      downloads: 245,
      tags: ["Policy", "Governance", "Institutional Framework"],
      downloadUrl: "/publications/water-governance-policy-brief-2025.pdf"
    },
    {
      title: "Economic Valuation of Water Services in Rural Rwanda: Implications for Tariff Setting",
      date: "January 2025",
      authors: ["Eric Habimana", "Claudine Uwase"],
      abstract: "Analysis of economic value of water services in rural areas and recommendations for sustainable tariff structures that balance affordability with cost recovery.",
      pages: 16,
      downloads: 189,
      tags: ["Economics", "Rural Water", "Tariffs"],
      downloadUrl: "/publications/water-tariff-policy-brief-2025.pdf"
    },
    {
      title: "Climate Resilience in Water Infrastructure: Policy Framework for Rwanda",
      date: "December 2024",
      authors: ["Dr. Marie Claire Mukamana", "Patrick Nkurunziza"],
      abstract: "Comprehensive policy framework for building climate resilience into Rwanda's water infrastructure investments and operations.",
      pages: 20,
      downloads: 312,
      tags: ["Climate Change", "Infrastructure", "Resilience"],
      downloadUrl: "/publications/climate-resilience-policy-brief-2024.pdf"
    }
  ];

  const articles = [
    {
      title: "Innovation in Rural Water Supply: Lessons from Rwanda's Community-Based Approach",
      date: "March 2025",
      author: "Samuel Rwigema",
      publication: "Water Policy Journal",
      type: "Peer-reviewed Article",
      abstract: "This article examines Rwanda's community-based water supply model and its implications for sustainable rural water service delivery across sub-Saharan Africa.",
      readTime: "12 min read",
      tags: ["Rural Water", "Community Management", "Innovation"],
      externalUrl: "https://waterpolicyjournal.com/rwanda-community-water-2025"
    },
    {
      title: "Digital Transformation in Water Management: Rwanda's Smart Water Initiative",
      date: "February 2025",
      author: "Grace Mutesi",
      publication: "RYWP Blog",
      type: "Blog Post",
      abstract: "Exploring how digital technologies are revolutionizing water management in Rwanda, from smart meters to data-driven decision making.",
      readTime: "8 min read",
      tags: ["Digital Technology", "Smart Water", "Data Management"],
      externalUrl: "/blog/digital-transformation-water-management"
    },
    {
      title: "Gender Inclusivity in Water Sector Leadership: Progress and Challenges",
      date: "January 2025",
      author: "Claudine Uwase",
      publication: "International Water Association Magazine",
      type: "Feature Article",
      abstract: "Analysis of gender representation in water sector leadership roles in Rwanda and strategies for promoting inclusive leadership development.",
      readTime: "15 min read",
      tags: ["Gender Equality", "Leadership", "Professional Development"],
      externalUrl: "https://iwa-network.org/rwanda-gender-water-leadership-2025"
    },
    {
      title: "Youth Engagement in Water Governance: The RYWP Model",
      date: "December 2024",
      author: "Jean Claude Uwimana",
      publication: "RYWP Blog",
      type: "Blog Post",
      abstract: "How RYWP's approach to youth engagement is creating new pathways for young professionals to influence water policy and governance in Rwanda.",
      readTime: "10 min read",
      tags: ["Youth Engagement", "Governance", "Professional Development"],
      externalUrl: "/blog/youth-engagement-water-governance"
    }
  ];

  const pressReleases = [
    {
      title: "RYWP Launches New Water Innovation Hub in Eastern Province",
      date: "March 10, 2025",
      location: "Kayonza, Rwanda",
      summary: "RYWP announced the opening of its newest innovation hub focused on developing climate-resilient water solutions for rural communities.",
      keyPoints: [
        "$500,000 investment in hub infrastructure and equipment",
        "Partnership with University of Rwanda for research collaboration",
        "Expected to serve 15 districts in Eastern Province",
        "Focus on solar-powered water systems and smart monitoring"
      ],
      contactPerson: "Immaculee Nyirahabimana, Communications Officer",
      downloadUrl: "/press/rywp-eastern-hub-launch-march-2025.pdf"
    },
    {
      title: "RYWP Receives International Recognition for Community Water Programs",
      date: "February 22, 2025",
      location: "Kigali, Rwanda",
      summary: "The Stockholm Water Prize committee recognizes RYWP's innovative approach to community-based water management as a model for sub-Saharan Africa.",
      keyPoints: [
        "First Rwandan organization to receive Stockholm Water Prize recognition",
        "Recognition for 'Community Water Champions' program",
        "Impact: 50,000+ people gained improved water access",
        "Prize ceremony scheduled for World Water Week 2025"
      ],
      contactPerson: "Immaculee Nyirahabimana, Communications Officer",
      downloadUrl: "/press/stockholm-water-prize-recognition-feb-2025.pdf"
    },
    {
      title: "New Partnership Brings $2M Investment to Rwanda Water Sector",
      date: "January 15, 2025",
      location: "Kigali, Rwanda",
      summary: "RYWP and World Bank Group announce strategic partnership to accelerate water infrastructure development across Rwanda.",
      keyPoints: [
        "Three-year partnership agreement signed",
        "Focus on sustainable water infrastructure in secondary cities",
        "Technical assistance and capacity building components",
        "Expected to benefit 200,000+ urban residents"
      ],
      contactPerson: "Eric Habimana, Partnerships Manager",
      downloadUrl: "/press/world-bank-partnership-jan-2025.pdf"
    }
  ];

  const technicalReports = [
    {
      title: "Water Quality Assessment in Rural Rwanda: A Comprehensive Study of 500 Water Points",
      date: "February 2025",
      authors: ["Dr. Grace Mutesi", "David Nsengimana", "Alice Mukashema"],
      institution: "RYWP Research Division",
      pages: 85,
      summary: "Comprehensive assessment of water quality across 500 rural water points in Rwanda, including analysis of contamination sources and treatment recommendations.",
      methodology: "Field testing, laboratory analysis, statistical modeling",
      keyFindings: [
        "89% of tested water points meet WHO quality standards",
        "Seasonal contamination patterns identified",
        "Maintenance protocols significantly impact water quality",
        "Community training reduces contamination by 35%"
      ],
      implications: "Findings inform national water quality monitoring protocols and community training programs.",
      downloads: 156,
      downloadUrl: "/reports/water-quality-assessment-rural-rwanda-2025.pdf"
    },
    {
      title: "Economic Impact Assessment of Community Water Projects in Rwanda (2020-2024)",
      date: "January 2025",
      authors: ["Eric Habimana", "Olivier Ntirenganya", "Samuel Rwigema"],
      institution: "RYWP Economics Unit",
      pages: 92,
      summary: "Longitudinal study examining economic impacts of community water projects implemented between 2020-2024, including cost-benefit analysis and sustainability metrics.",
      methodology: "Economic modeling, household surveys, financial analysis",
      keyFindings: [
        "Average return on investment: 340% over 10 years",
        "Household income increased by 15% on average",
        "Women's economic participation increased by 22%",
        "Healthcare costs reduced by 28% in project communities"
      ],
      implications: "Data supports scaling of community-based water investment models across sub-Saharan Africa.",
      downloads: 203,
      downloadUrl: "/reports/economic-impact-community-water-projects-2025.pdf"
    },
    {
      title: "Climate Change Vulnerability Assessment for Rwanda's Water Infrastructure",
      date: "December 2024",
      authors: ["Dr. Marie Claire Mukamana", "Claudine Uwase", "Jean Baptiste Nsengiyumva"],
      institution: "RYWP Climate Research Center",
      pages: 67,
      summary: "Assessment of climate change impacts on Rwanda's water infrastructure with adaptation strategies and investment priorities.",
      methodology: "Climate modeling, infrastructure assessment, stakeholder consultation",
      keyFindings: [
        "60% of water infrastructure at moderate to high climate risk",
        "Eastern regions most vulnerable to drought impacts",
        "Infrastructure upgrade needs: $150M over next decade",
        "Nature-based solutions can reduce vulnerability by 40%"
      ],
      implications: "Findings inform national climate adaptation planning and infrastructure investment strategies.",
      downloads: 178,
      downloadUrl: "/reports/climate-vulnerability-water-infrastructure-2024.pdf"
    }
  ];

  const allPublications = [
    ...policyBriefs.map(pub => ({ ...pub, category: 'policy-briefs', type: 'Policy Brief' })),
    ...articles.map(pub => ({ ...pub, category: 'articles', type: pub.type })),
    ...pressReleases.map(pub => ({ ...pub, category: 'press-releases', type: 'Press Release' })),
    ...technicalReports.map(pub => ({ ...pub, category: 'technical-reports', type: 'Technical Report' }))
  ];

  const categories = [
    { key: 'all', label: 'All Publications', count: allPublications.length },
    { key: 'policy-briefs', label: 'Policy Briefs', count: policyBriefs.length },
    { key: 'articles', label: 'Articles & Blogs', count: articles.length },
    { key: 'press-releases', label: 'Press Releases', count: pressReleases.length },
    { key: 'technical-reports', label: 'Technical Reports', count: technicalReports.length }
  ];

  const filteredPublications = activeCategory === 'all'
    ? allPublications
    : allPublications.filter(pub => pub.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <span className="text-white text-2xl">Research & Publications Image</span>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className={`text-white max-w-3xl transition-all duration-700 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <h1 className="text-5xl font-light mb-4">Research & Publications</h1>
              <p className="text-xl font-light opacity-90">
                Evidence-based insights, analysis, and knowledge sharing from Rwanda&#39;s water professionals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Publication Categories Overview */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-1 h-12 bg-dark-blue mr-4"></div>
                <h2 className="text-3xl font-light text-gray-900">Knowledge Production</h2>
              </div>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Our publications reflect RYWP&#39;s commitment to evidence-based practice and knowledge sharing.
                We produce research that informs policy, guides implementation, and advances the water sector.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                From technical reports to policy briefs, our work contributes to Rwanda&#39;s water development
                and serves as a resource for the broader water community.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Publications Directory */}
      {/* Publications Directory with Sidebar Filter */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12">
            <div className="border-t-4 border-light-blue mb-4"></div>
            <h2 className="text-4xl font-light text-gray-900 mb-2">All Resources</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filter */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Filter by:</h3>

                <div className="border-t-4 border-light-blue mb-6"></div>

                {/* Type Filter */}
                <div className="mb-8">
                  <button className="flex items-center justify-between w-full mb-4">
                    <h4 className="font-medium text-gray-900">Type</h4>
                    <span className="text-gray-600">−</span>
                  </button>
                  <div className="space-y-3">
                    {categories.slice(1).map((category) => (
                      <label key={category.key} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeCategory === category.key || activeCategory === 'all'}
                          onChange={() => setActiveCategory(category.key)}
                          className="w-4 h-4 text-dark-blue border-gray-300 focus:ring-light-blue"
                        />
                        <span className="ml-3 text-gray-700">{category.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t-2 border-light-blue mb-6"></div>

                {/* Additional Filters Placeholders */}
                <div className="mb-8">
                  <button className="flex items-center justify-between w-full mb-4">
                    <h4 className="font-medium text-gray-900">Topic</h4>
                    <span className="text-gray-600">+</span>
                  </button>
                </div>

                <div className="border-t-2 border-light-blue mb-6"></div>

                <div className="mb-8">
                  <button className="flex items-center justify-between w-full mb-4">
                    <h4 className="font-medium text-gray-900">Region</h4>
                    <span className="text-gray-600">+</span>
                  </button>
                </div>

                <div className="border-t-2 border-light-blue mb-6"></div>

                <div className="mb-8">
                  <button className="flex items-center justify-between w-full mb-4">
                    <h4 className="font-medium text-gray-900">Initiatives</h4>
                    <span className="text-gray-600">+</span>
                  </button>
                </div>

                {/* Apply Filters Button */}
                <button className="w-full bg-dark-blue text-white py-3 px-6 hover:bg-light-blue transition-colors duration-300">
                  Apply filters
                </button>
              </div>
            </div>

            {/* Publications List */}
            <div className="lg:col-span-3">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-8">
                <p className="text-gray-600">
                  Showing 1-{filteredPublications.length} of {filteredPublications.length} results
                </p>
                <div className="flex gap-2">
                  <button className="bg-dark-blue text-white px-4 py-2 text-sm">
                    Latest
                  </button>
                  <button className="bg-white text-gray-700 border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
                    Oldest
                  </button>
                </div>
              </div>

              {/* Publications */}
              <div className="space-y-6">
                {filteredPublications.map((pub, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6">
                    <Link href={'#'} className="block group">
                      <h3 className="text-xl font-medium text-dark-blue mb-3 group-hover:text-light-blue transition-colors duration-300">
                        {pub.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        Abstract will be here
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-medium text-gray-700 uppercase">{pub.type}</span>
                        <span>•</span>
                        <span>{pub.date}</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Call to Action */}
      <section className="py-24 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-light text-white mb-4">Have Some Findings</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact us regarding new publications and research findings
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="border border-light-blue text-light-blue px-8 py-3 hover:bg-light-blue hover:text-white transition-all duration-300"
            >
              Submit Research
            </Link>
          </div>
        </div>
      </section>
    </div>
);
}