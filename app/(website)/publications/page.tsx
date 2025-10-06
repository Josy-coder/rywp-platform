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
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Publication Library</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse our collection of research, analysis, and thought leadership across different publication types
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

          {/* Publications Grid */}
          <div className="space-y-8">
            {/* Policy Briefs */}
            {(activeCategory === 'all' || activeCategory === 'policy-briefs') && (
              <div id="policy-briefs">
                {activeCategory === 'all' && (
                  <h3 className="text-2xl font-light text-gray-900 mb-6">Policy Briefs</h3>
                )}
                <div className="space-y-6">
                  {policyBriefs.map((brief, index) => (
                    <div key={index} className="bg-white p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-xl font-medium text-gray-900 mb-2">{brief.title}</h4>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                            <span>{brief.date}</span>
                            <span>•</span>
                            <span>{brief.authors.join(", ")}</span>
                            <span>•</span>
                            <span>{brief.pages} pages</span>
                            <span>•</span>
                            <span>{brief.downloads} downloads</span>
                          </div>
                        </div>
                        <div className="ml-6">
                          <Link
                            href={brief.downloadUrl}
                            className="bg-dark-blue text-white px-4 py-2 text-sm hover:bg-light-blue transition-colors duration-300"
                          >
                            Download PDF
                          </Link>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{brief.abstract}</p>

                      <div className="flex flex-wrap gap-2">
                        {brief.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="bg-gray-100 text-gray-700 px-3 py-1 text-sm">
                              {tag}
                            </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Articles & Blogs */}
            {(activeCategory === 'all' || activeCategory === 'articles') && (
              <div id="articles">
                {activeCategory === 'all' && (
                  <h3 className="text-2xl font-light text-gray-900 mb-6 mt-12">Articles & Blog Posts</h3>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {articles.map((article, index) => (
                    <div key={index} className="bg-white p-6">
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-light-blue text-white px-2 py-1 text-xs">{article.type}</span>
                          <span className="text-sm text-gray-600">{article.readTime}</span>
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">{article.title}</h4>
                        <div className="text-sm text-gray-600 mb-3">
                          By {article.author} • {article.publication} • {article.date}
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 text-sm">{article.abstract}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="bg-gray-100 text-gray-700 px-2 py-1 text-xs">
                              {tag}
                            </span>
                        ))}
                      </div>

                      <Link
                        href={article.externalUrl}
                        className="text-dark-blue hover:text-light-blue transition-colors duration-300 text-sm font-medium"
                      >
                        Read Article →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Press Releases */}
            {(activeCategory === 'all' || activeCategory === 'press-releases') && (
              <div id="press-releases">
                {activeCategory === 'all' && (
                  <h3 className="text-2xl font-light text-gray-900 mb-6 mt-12">Press Releases</h3>
                )}
                <div className="space-y-6">
                  {pressReleases.map((release, index) => (
                    <div key={index} className="bg-white p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900 mb-2">{release.title}</h4>
                          <div className="text-sm text-gray-600 mb-3">
                            {release.date} • {release.location}
                          </div>
                        </div>
                        <div className="ml-6">
                          <Link
                            href={release.downloadUrl}
                            className="bg-lighter-blue text-white px-4 py-2 text-sm hover:bg-dark-blue transition-colors duration-300"
                          >
                            Download
                          </Link>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{release.summary}</p>

                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Key Points:</h5>
                        <div className="space-y-1">
                          {release.keyPoints.map((point, pointIndex) => (
                            <div key={pointIndex} className="flex items-start">
                              <div className="w-2 h-2 bg-lighter-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-gray-600 text-sm">{point}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 text-sm text-gray-600">
                          <strong>Media Contact:</strong> {release.contactPerson}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Reports */}
            {(activeCategory === 'all' || activeCategory === 'technical-reports') && (
              <div id="technical-reports">
                {activeCategory === 'all' && (
                  <h3 className="text-2xl font-light text-gray-900 mb-6 mt-12">Technical Reports</h3>
                )}
                <div className="space-y-8">
                  {technicalReports.map((report, index) => (
                    <div key={index} className="bg-white p-8">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                          <h4 className="text-xl font-medium text-gray-900 mb-3">{report.title}</h4>
                          <div className="text-sm text-gray-600 mb-4">
                            {report.authors.join(", ")} • {report.institution} • {report.date}
                          </div>

                          <p className="text-gray-600 mb-6">{report.summary}</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Key Findings:</h5>
                              <div className="space-y-2">
                                {report.keyFindings.map((finding, findingIndex) => (
                                  <div key={findingIndex} className="flex items-start">
                                    <div className="w-2 h-2 bg-dark-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                    <span className="text-gray-600 text-sm">{finding}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Methodology:</h5>
                              <p className="text-gray-600 text-sm mb-4">{report.methodology}</p>

                              <h5 className="font-medium text-gray-900 mb-2">Policy Implications:</h5>
                              <p className="text-gray-600 text-sm">{report.implications}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col justify-between">
                          <div className="bg-gray-50 p-6 mb-6">
                            <h5 className="font-medium text-gray-900 mb-4">Report Details</h5>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Pages:</span>
                                <span className="font-medium">{report.pages}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Downloads:</span>
                                <span className="font-medium">{report.downloads}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Type:</span>
                                <span className="font-medium">Technical Report</span>
                              </div>
                            </div>
                          </div>

                          <Link
                            href={report.downloadUrl}
                            className="w-full block text-center bg-dark-blue text-white py-3 hover:bg-light-blue transition-colors duration-300"
                          >
                            Download Full Report
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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