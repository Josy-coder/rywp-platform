"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ProjectsPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const projects = [
    {
      id: 1,
      title: "Smart Water Management System - Kigali",
      location: "Kigali City",
      theme: "wash",
      status: "ongoing",
      duration: "2024 - 2026",
      budget: "$750,000",
      description: "Implementation of IoT-based smart water meters and monitoring systems across Kigali's water distribution network to improve efficiency and reduce losses.",
      partners: ["City of Kigali", "WASAC", "Smart City Rwanda"],
      objectives: [
        "Install 5,000 smart water meters",
        "Reduce water losses by 25%",
        "Implement real-time monitoring dashboard",
        "Train 50 technical staff on smart water technologies"
      ],
      progress: 65,
      beneficiaries: "250,000 urban residents",
      lead: "Samuel Rwigema",
      image: "/images/projects/smart-water-kigali.jpg"
    },
    {
      id: 2,
      title: "Community Water Resilience Initiative",
      location: "Eastern Province",
      theme: "nature-based",
      status: "ongoing",
      duration: "2023 - 2025",
      budget: "$450,000",
      description: "Building climate-resilient water infrastructure in rural communities through nature-based solutions and community participation.",
      partners: ["MININFRA", "USAID Rwanda", "Local Communities"],
      objectives: [
        "Construct 15 community-managed water systems",
        "Establish water user associations in 20 villages",
        "Train 200 community water technicians",
        "Implement watershed protection measures"
      ],
      progress: 80,
      beneficiaries: "45,000 rural residents",
      lead: "Grace Mutesi",
      image: "/images/projects/community-resilience-eastern.jpg"
    },
    {
      id: 3,
      title: "Youth Water Leadership Program",
      location: "National",
      theme: "capacity-building",
      status: "ongoing",
      duration: "2023 - 2026",
      budget: "$300,000",
      description: "Comprehensive leadership development program for young water professionals to build capacity and promote innovation in Rwanda's water sector.",
      partners: ["University of Rwanda", "IWA Young Water Professionals", "World Bank"],
      objectives: [
        "Train 500 young water professionals",
        "Establish mentorship networks",
        "Create innovation challenges and competitions",
        "Develop water leadership curriculum"
      ],
      progress: 45,
      beneficiaries: "500+ young professionals",
      lead: "Claudine Uwase",
      image: "/images/projects/youth-leadership-program.jpg"
    },
    {
      id: 4,
      title: "Lake Kivu Watershed Protection Project",
      location: "Western Province",
      theme: "nature-based",
      status: "completed",
      duration: "2022 - 2024",
      budget: "$600,000",
      description: "Comprehensive watershed management program focused on protecting Lake Kivu's water quality through community-based conservation and sustainable land use practices.",
      partners: ["REMA", "FONERWA", "Local Cooperatives"],
      objectives: [
        "Reforest 500 hectares of watershed area",
        "Establish 25 community conservation groups",
        "Implement soil conservation measures",
        "Monitor water quality improvements"
      ],
      progress: 100,
      beneficiaries: "75,000 residents",
      lead: "Eric Habimana",
      image: "/images/projects/kivu-watershed-protection.jpg",
      outcomes: [
        "580 hectares successfully reforested",
        "30 community conservation groups established",
        "Water quality improved by 35%",
        "Soil erosion reduced by 60% in project areas"
      ]
    },
    {
      id: 5,
      title: "Rural Water Supply Enhancement Program",
      location: "Northern Province",
      theme: "wash",
      status: "ongoing",
      duration: "2024 - 2027",
      budget: "$850,000",
      description: "Comprehensive program to improve rural water supply infrastructure and ensure sustainable service delivery in remote areas of Northern Province.",
      partners: ["MININFRA", "World Vision Rwanda", "District Governments"],
      objectives: [
        "Construct 30 new boreholes with solar pumping",
        "Rehabilitate 50 existing water points",
        "Train 100 community water technicians",
        "Establish water tariff collection systems"
      ],
      progress: 25,
      beneficiaries: "60,000 rural residents",
      lead: "David Nsengimana",
      image: "/images/projects/rural-water-northern.jpg"
    },
    {
      id: 6,
      title: "Wastewater Treatment Innovation Pilot",
      location: "Huye District",
      theme: "innovation",
      status: "completed",
      duration: "2023 - 2024",
      budget: "$200,000",
      description: "Pilot project testing innovative constructed wetland systems for decentralized wastewater treatment in secondary cities.",
      partners: ["University of Rwanda", "Carnegie Mellon Africa", "Huye District"],
      objectives: [
        "Design and construct pilot treatment facility",
        "Test treatment efficiency over 12 months",
        "Develop operation and maintenance protocols",
        "Assess scalability for other secondary cities"
      ],
      progress: 100,
      beneficiaries: "5,000 residents",
      lead: "Alice Mukashema",
      image: "/images/projects/wastewater-innovation-huye.jpg",
      outcomes: [
        "90% pollutant removal efficiency achieved",
        "Treatment costs reduced by 40% vs conventional systems",
        "Operation protocols developed and tested",
        "Scalability study completed for 10 secondary cities"
      ]
    },
    {
      id: 7,
      title: "Water Quality Monitoring Network",
      location: "Multiple Districts",
      theme: "monitoring",
      status: "ongoing",
      duration: "2023 - 2026",
      budget: "$400,000",
      description: "Establishing a comprehensive water quality monitoring network using low-cost sensors and community-based monitoring protocols.",
      partners: ["REMA", "WaterAid Rwanda", "Rwanda Standards Board"],
      objectives: [
        "Deploy 200 water quality sensors",
        "Train 150 community monitors",
        "Develop real-time monitoring platform",
        "Create water quality database"
      ],
      progress: 60,
      beneficiaries: "100,000+ water users",
      lead: "Olivier Ntirenganya",
      image: "/images/projects/water-quality-monitoring.jpg"
    }
  ];

  const themes = [
    { key: 'all', label: 'All Projects', count: projects.length },
    { key: 'wash', label: 'WASH Projects', count: projects.filter(p => p.theme === 'wash').length },
    { key: 'nature-based', label: 'Nature-Based Solutions', count: projects.filter(p => p.theme === 'nature-based').length },
    { key: 'innovation', label: 'Innovation & Technology', count: projects.filter(p => p.theme === 'innovation').length },
    { key: 'capacity-building', label: 'Capacity Building', count: projects.filter(p => p.theme === 'capacity-building').length },
    { key: 'monitoring', label: 'Monitoring & Assessment', count: projects.filter(p => p.theme === 'monitoring').length }
  ];

  const statuses = [
    { key: 'all', label: 'All Status' },
    { key: 'ongoing', label: 'Ongoing' },
    { key: 'completed', label: 'Completed' }
  ];

  const filteredProjects = projects.filter(project => {
    const themeMatch = activeFilter === 'all' || project.theme === activeFilter;
    return themeMatch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <span className="text-white text-2xl">Projects & Implementation Image</span>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className={`text-white max-w-3xl transition-all duration-700 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <h1 className="text-5xl font-light mb-4">Projects & Implementation</h1>
              <p className="text-xl font-light opacity-90">
                Transforming communities through innovative water solutions and sustainable development initiatives
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Overview */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-1 h-12 bg-dark-blue mr-4"></div>
                <h2 className="text-3xl font-light text-gray-900">Our Impact</h2>
              </div>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Since 2022, RYWP has implemented diverse water projects across Rwanda,
                ranging from smart water systems in urban areas to community-based solutions in rural regions.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our project portfolio demonstrates our commitment to innovation, sustainability,
                and community-centered approaches to water development.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-gray-50">
                <div className="text-3xl font-light text-dark-blue mb-2">23</div>
                <div className="text-gray-600">Active Projects</div>
              </div>
              <div className="text-center p-6 bg-gray-50">
                <div className="text-3xl font-light text-dark-blue mb-2">435K+</div>
                <div className="text-gray-600">People Served</div>
              </div>
              <div className="text-center p-6 bg-gray-50">
                <div className="text-3xl font-light text-dark-blue mb-2">$3.2M</div>
                <div className="text-gray-600">Total Investment</div>
              </div>
              <div className="text-center p-6 bg-gray-50">
                <div className="text-3xl font-light text-dark-blue mb-2">15</div>
                <div className="text-gray-600">Partner Organizations</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Directory */}
      <section id="all-projects" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Project Portfolio</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our diverse range of water projects across different themes and locations
            </p>
          </div>

          {/* Project Filters */}
          <div className="flex flex-wrap justify-center mb-12 gap-2">
            {themes.map((theme) => (
              <button
                key={theme.key}
                onClick={() => setActiveFilter(theme.key)}
                className={`px-6 py-3 transition-colors duration-300 ${
                  activeFilter === theme.key
                    ? 'bg-dark-blue text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {theme.label} ({theme.count})
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white overflow-hidden">
                <div className="bg-gray-300 h-48 flex items-center justify-center">
                  <span className="text-gray-600">Project Image</span>
                </div>

                <div className="p-8">
                  <h3 className="text-xl font-medium text-gray-900 mb-4">{project.title}</h3>

                  <div className="mb-4 text-sm text-gray-600">
                    <span className="font-medium">Duration:</span> {project.duration}
                  </div>

                  <p className="text-gray-600 mb-6">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.partners.slice(0, 3).map((partner, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 text-xs">
                        {partner}
                      </span>
                    ))}
                    {project.partners.length > 3 && (
                      <span className="bg-gray-100 text-gray-500 px-3 py-1 text-xs">+{project.partners.length - 3} more</span>
                    )}
                  </div>

                  <Link
                    href={`/projects/${project.id}`}
                    className="w-full block text-center bg-dark-blue text-white py-3 hover:bg-light-blue transition-colors duration-300"
                  >
                    View Project Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Project Impact Map */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-1 h-12 bg-lighter-blue mr-4"></div>
                <h2 className="text-3xl font-light text-gray-900">Geographic Coverage</h2>
              </div>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Our projects span all provinces of Rwanda, with strategic focus on areas with the greatest need
                and potential for sustainable impact.
              </p>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white">
                  <span className="font-medium text-gray-900">Kigali City</span>
                  <span className="text-dark-blue">5 projects</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white">
                  <span className="font-medium text-gray-900">Eastern Province</span>
                  <span className="text-dark-blue">7 projects</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white">
                  <span className="font-medium text-gray-900">Western Province</span>
                  <span className="text-dark-blue">4 projects</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white">
                  <span className="font-medium text-gray-900">Northern Province</span>
                  <span className="text-dark-blue">4 projects</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white">
                  <span className="font-medium text-gray-900">Southern Province</span>
                  <span className="text-dark-blue">3 projects</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-300 h-96 flex items-center justify-center">
                <span className="text-gray-600 text-xl">Interactive Project Map</span>
              </div>
              <p className="text-center text-sm text-gray-600 mt-4">
                Click on regions to explore projects by location
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-light text-white mb-4">Partner with Us</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our mission to transform Rwanda&#39;s water landscape through collaborative project implementation
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-light-blue text-white px-8 py-3 hover:bg-dark-blue transition-colors duration-300"
            >
              Propose a Project
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}