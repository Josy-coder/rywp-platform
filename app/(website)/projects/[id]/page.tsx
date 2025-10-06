"use client";
import Link from "next/link";
import {
  useState,
  useEffect,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import { useParams } from "next/navigation";

export default function ProjectDetailPage() {
  const params = useParams();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Sample project data - in production this would come from your database
  const projectData = {
      title: "Smart Water Management System - Kigali",
      banner: "/images/projects/smart-water-kigali.jpg",
      overview:
        "Implementation of IoT-based smart water meters and monitoring systems across Kigali's water distribution network to improve efficiency and reduce losses. This transformative project integrates cutting-edge technology with traditional water infrastructure management.",
      objectives: [
        "Install 5,000 smart water meters across Kigali",
        "Reduce water losses by 25% through real-time leak detection",
        "Implement comprehensive real-time monitoring dashboard",
        "Train 50 technical staff on smart water technologies and maintenance",
      ],
      keyActivities: [
        {
          icon: "📊",
          title: "System Design & Planning",
          description:
            "Comprehensive network assessment and smart meter deployment strategy",
        },
        {
          icon: "🔧",
          title: "Infrastructure Installation",
          description:
            "Installation of IoT sensors and smart meters across distribution network",
        },
        {
          icon: "💻",
          title: "Dashboard Development",
          description:
            "Real-time monitoring platform for water flow and leak detection",
        },
        {
          icon: "👥",
          title: "Capacity Building",
          description:
            "Training programs for technical staff and system administrators",
        },
      ],
      partners: [
        {
          name: "City of Kigali",
          role: "Primary implementing partner and infrastructure owner",
        },
        { name: "WASAC", role: "Technical partner and water service provider" },
        {
          name: "Smart City Rwanda",
          role: "Technology provider and system integrator",
        },
      ],
      funders: [
        {
          name: "World Bank",
          role: "Primary funding through Urban Development Grant",
        },
        {
          name: "FONERWA",
          role: "Co-financing for climate adaptation components",
        },
      ],
      duration: {
        start: "January 2024",
        end: "December 2026",
        total: "36 months",
      },
      geographicalCoverage: {
        map: "/images/maps/kigali-coverage.jpg",
        areas: ["Gasabo District", "Kicukiro District", "Nyarugenge District"],
        description:
          "Project covers all three districts of Kigali City with focus on high-density urban areas",
      },
      rywpRole: [
        "Technical advisory on smart water technology implementation",
        "Capacity building and training program design and delivery",
        "Community engagement and public awareness campaigns",
        "Monitoring and evaluation framework development",
      ],
      impact: {
        stats: [
          { value: "250,000", label: "Urban residents benefiting" },
          { value: "5,000", label: "Smart meters installed" },
          { value: "25%", label: "Reduction in water losses" },
          { value: "50", label: "Staff trained" },
        ],
        infographics: "/images/infographics/smart-water-impact.jpg",
        testimonials: [
          {
            quote:
              "The smart water system has transformed how we manage our water distribution. We can now detect and fix leaks within hours instead of days.",
            author: "Jean Pierre Mugabo",
            title: "WASAC Operations Manager",
          },
        ],
      },
      updates: [
        {
          date: "February 2025",
          title: "Milestone Achievement",
          description:
            "Successfully installed 3,000 smart meters across Gasabo District",
          link: "#",
        },
        {
          date: "January 2025",
          title: "Training Completion",
          description:
            "First cohort of 25 technical staff completed advanced training",
          link: "#",
        },
        {
          date: "December 2024",
          title: "Dashboard Launch",
          description:
            "Real-time monitoring dashboard went live for pilot areas",
          link: "#",
        },
      ],
      downloads: [
        { title: "Project Brief (PDF)", size: "2.4 MB", link: "#" },
        { title: "Technical Report Q1 2025", size: "5.1 MB", link: "#" },
        { title: "Impact Infographic", size: "1.8 MB", link: "#" },
        { title: "Photo Gallery (ZIP)", size: "15.3 MB", link: "#" },
      ],
      status: "ongoing",
      progress: 65,
  };

  const projects: { [key: string]: typeof projectData } = {
    "1": projectData,
  };

  const project = projects[params.id as string] || projects["1"];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <span className="text-white text-2xl">Project Banner Image</span>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div
              className={`text-white max-w-4xl transition-all duration-700 transform ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <Link
                href="/projects"
                className="text-white hover:text-light-blue mb-4 inline-flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Projects
              </Link>
              <h1 className="text-5xl font-light mb-4 mt-4">{project.title}</h1>
              <div className="flex items-center gap-4">
                <span
                  className={`px-4 py-2 text-sm text-white ${
                    project.status === "ongoing"
                      ? "bg-light-blue"
                      : "bg-green-500"
                  }`}
                >
                  {project.status === "ongoing" ? "Ongoing" : "Completed"}
                </span>
                <span className="text-lg">
                  {project.duration.start} - {project.duration.end}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-light text-gray-900 mb-6">
              Project Overview
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {project.overview}
            </p>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-light text-gray-900 mb-8">
              Objectives
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.objectives.map((objective, index) => (
                <div key={index} className="flex items-start bg-white p-6">
                  <div className="w-8 h-8 bg-dark-blue text-white flex items-center justify-center font-bold mr-4 flex-shrink-0 mt-1">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{objective}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Activities */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-light text-gray-900 mb-8">
              Key Activities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.keyActivities.map(
                (
                  activity: {
                    icon:
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactElement<
                          unknown,
                          string | JSXElementConstructor<any>
                        >
                      | Iterable<ReactNode>
                      | ReactPortal
                      | Promise<
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactPortal
                          | ReactElement<
                              unknown,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | null
                          | undefined
                        >
                      | null
                      | undefined;
                    title:
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactElement<
                          unknown,
                          string | JSXElementConstructor<any>
                        >
                      | Iterable<ReactNode>
                      | ReactPortal
                      | Promise<
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactPortal
                          | ReactElement<
                              unknown,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | null
                          | undefined
                        >
                      | null
                      | undefined;
                    description:
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactElement<
                          unknown,
                          string | JSXElementConstructor<any>
                        >
                      | Iterable<ReactNode>
                      | ReactPortal
                      | Promise<
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactPortal
                          | ReactElement<
                              unknown,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | null
                          | undefined
                        >
                      | null
                      | undefined;
                  },
                  index: Key | null | undefined,
                ) => (
                  <div key={index} className="border border-gray-200 p-6">
                    <div className="text-4xl mb-4">{activity.icon}</div>
                    <h3 className="text-xl font-medium text-gray-900 mb-3">
                      {activity.title}
                    </h3>
                    <p className="text-gray-600">{activity.description}</p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Partners & Funders */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-light text-gray-900 mb-8">
              Partners & Funders
            </h2>

            <div className="mb-12">
              <h3 className="text-xl font-medium text-gray-900 mb-6">
                Implementing Partners
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {project.partners.map((partner, index) => (
                  <div key={index} className="bg-white p-6 text-center">
                    <div className="w-16 h-16 bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-xs text-gray-500">Logo</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      {partner.name}
                    </h4>
                    <p className="text-sm text-gray-600">{partner.role}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-6">
                Funders
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.funders.map((funder, index) => (
                  <div key={index} className="bg-white p-6 text-center">
                    <div className="w-16 h-16 bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-xs text-gray-500">Logo</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      {funder.name}
                    </h4>
                    <p className="text-sm text-gray-600">{funder.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Duration */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-light text-gray-900 mb-8">Duration</h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 text-center">
                <div className="text-sm text-gray-600 mb-2">Start Date</div>
                <div className="text-2xl font-light text-dark-blue">
                  {project.duration.start}
                </div>
              </div>
              <div className="bg-gray-50 p-6 text-center">
                <div className="text-sm text-gray-600 mb-2">End Date</div>
                <div className="text-2xl font-light text-dark-blue">
                  {project.duration.end}
                </div>
              </div>
              <div className="bg-gray-50 p-6 text-center">
                <div className="text-sm text-gray-600 mb-2">Total Duration</div>
                <div className="text-2xl font-light text-dark-blue">
                  {project.duration.total}
                </div>
              </div>
            </div>

            {project.status === "ongoing" && (
              <div className="mt-8">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    Project Progress
                  </span>
                  <span className="text-sm font-medium text-dark-blue">
                    {project.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-3">
                  <div
                    className="bg-dark-blue h-3"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Geographical Coverage */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-light text-gray-900 mb-8">
              Geographical Coverage
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="bg-gray-300 h-64 flex items-center justify-center mb-4">
                  <span className="text-gray-600">Coverage Map</span>
                </div>
                <p className="text-gray-600">
                  {project.geographicalCoverage.description}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">
                  Coverage Areas
                </h3>
                <div className="space-y-3">
                  {project.geographicalCoverage.areas.map((area, index) => (
                    <div key={index} className="flex items-center bg-white p-4">
                      <svg
                        className="w-5 h-5 text-dark-blue mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                      </svg>
                      <span className="text-gray-700">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RYWP Role */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-light text-gray-900 mb-8">
              RYWP Role
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.rywpRole.map((role, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-light-blue rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <p className="text-gray-700">{role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact & Results */}
      <section className="py-16 bg-dark-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-light mb-8">Impact & Results</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {project.impact.stats.map((stat: any, index: any) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-light mb-2">{stat.value}</div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>

            {project.impact.testimonials &&
              project.impact.testimonials.length > 0 && (
                <div className="bg-white bg-opacity-10 p-8">
                  <h3 className="text-xl font-medium mb-6">Testimonials</h3>
                  {project.impact.testimonials.map((testimonial: any, index: any) => (
                    <div key={index} className="mb-6 last:mb-0">
                      <p className="text-lg mb-4 italic">
                        &quot;{testimonial.quote}&quot;
                      </p>
                      <div className="text-sm">
                        <div className="font-medium">{testimonial.author}</div>
                        <div className="opacity-75">{testimonial.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </section>

      {/* Updates & News */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-light text-gray-900 mb-8">
              Updates & News
            </h2>
            <div className="space-y-6">
              {project.updates.map((update, index) => (
                <div
                  key={index}
                  className="bg-white p-6 border-l-4 border-light-blue"
                >
                  <div className="text-sm text-gray-600 mb-2">
                    {update.date}
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    {update.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{update.description}</p>
                  <Link
                    href={update.link}
                    className="text-dark-blue hover:text-light-blue transition-colors duration-300 text-sm font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Downloads */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-light text-gray-900 mb-8">
              Downloads
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.downloads.map((download, index) => (
                <div
                  key={index}
                  className="border border-gray-200 p-6 flex items-center justify-between hover:border-dark-blue transition-colors duration-300"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-8 h-8 text-dark-blue mr-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <div className="font-medium text-gray-900">
                        {download.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {download.size}
                      </div>
                    </div>
                  </div>
                  <a
                    href={download.link}
                    className="text-dark-blue hover:text-light-blue"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-light mb-4">
            Interested in Partnering?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join us in transforming Rwanda&apos;s water landscape through
            collaborative projects
          </p>
          <Link
            href="/contact"
            className="inline-block bg-light-blue text-white px-8 py-3 hover:bg-dark-blue transition-colors duration-300"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}