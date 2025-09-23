"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const heroSlides = [
    {
      image: "/images/water-treatment.jpg",
      title: "Clean Water Innovation",
      subtitle: "Advancing sustainable water solutions across Rwanda"
    },
    {
      image: "/images/youth-training.jpg",
      title: "Empowering Young Professionals",
      subtitle: "Building the next generation of water experts"
    },
    {
      image: "/images/community-project.jpg",
      title: "Community Impact",
      subtitle: "Transforming lives through water access initiatives"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Image Slider */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <span className="text-white text-2xl">Hero Image {index + 1}</span>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
          ))}
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className={`text-white max-w-2xl transition-all duration-700 transform ${
              isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
            }`}>
              <h1 className="text-6xl font-light mb-6 leading-tight">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-xl mb-8 font-light opacity-90">
                {heroSlides[currentSlide].subtitle}
              </p>
              <Link
                href="/membership"
                className="inline-block bg-light-blue text-white px-8 py-3 text-lg font-medium hover:bg-dark-blue transition-colors duration-300"
              >
                Join Our Mission
              </Link>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Navigation Shortcuts - Asymmetric Layout */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-12 gap-8">
            {/* Left side - Latest News */}
            <div className="col-span-12 lg:col-span-7">
              <div className="bg-gray-50 p-12 h-full">
                <div className="flex items-center mb-6">
                  <div className="w-1 h-12 bg-dark-blue mr-4"></div>
                  <h2 className="text-3xl font-light text-gray-900">Latest News</h2>
                </div>
                <p className="text-gray-600 mb-8 text-lg">
                  Stay informed about our recent projects, partnerships, and impact across Rwanda&#39;s water sector.
                </p>
                <Link
                  href="/news"
                  className="inline-flex items-center text-dark-blue font-medium hover:text-light-blue transition-colors duration-300"
                >
                  Read Updates
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right side - Quick Actions */}
            <div className="col-span-12 lg:col-span-5 space-y-8">
              <div className="bg-dark-blue p-8 text-white">
                <h3 className="text-xl font-medium mb-4">Upcoming Events</h3>
                <p className="mb-6 opacity-90">Join our next workshop or networking session</p>
                <Link href="/events" className="text-light-blue hover:text-white transition-colors duration-300">
                  View Calendar →
                </Link>
              </div>

              <div className="border border-gray-200 p-8">
                <h3 className="text-xl font-medium mb-4 text-gray-900">Membership</h3>
                <p className="text-gray-600 mb-6">Connect with water professionals across Rwanda</p>
                <Link href="/membership" className="text-dark-blue hover:text-light-blue transition-colors duration-300">
                  Join Now →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles & Publications - Full Width */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Knowledge Hub</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Research, insights, and technical expertise from our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-light-blue mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4">Policy Briefs</h3>
              <p className="text-gray-600 mb-6">Evidence-based recommendations for water governance</p>
              <Link href="/publications#policy-briefs" className="text-dark-blue hover:text-light-blue transition-colors duration-300">
                Read More →
              </Link>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-darker-blue mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4">Technical Reports</h3>
              <p className="text-gray-600 mb-6">In-depth analysis and project documentation</p>
              <Link href="/publications#technical-reports" className="text-dark-blue hover:text-light-blue transition-colors duration-300">
                Explore →
              </Link>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-lighter-blue mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4">Articles & Blogs</h3>
              <p className="text-gray-600 mb-6">Insights and perspectives from our experts</p>
              <Link href="/publications#articles" className="text-dark-blue hover:text-light-blue transition-colors duration-300">
                Read Articles →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Project Highlights - Side by Side */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-1 h-12 bg-light-blue mr-4"></div>
                <h2 className="text-3xl font-light text-gray-900">Project Highlights</h2>
              </div>
              <p className="text-gray-600 text-lg mb-8">
                Discover how we&#39;re transforming communities through innovative water solutions,
                from urban treatment facilities to rural access programs.
              </p>

              <div className="space-y-6">
                <div className="border-l-4 border-dark-blue pl-6">
                  <h3 className="font-medium text-gray-900 mb-2">Clean Water Initiative</h3>
                  <p className="text-gray-600">Expanding access to 15+ communities</p>
                </div>
                <div className="border-l-4 border-light-blue pl-6">
                  <h3 className="font-medium text-gray-900 mb-2">Youth Training Program</h3>
                  <p className="text-gray-600">500+ professionals trained nationwide</p>
                </div>
                <div className="border-l-4 border-lighter-blue pl-6">
                  <h3 className="font-medium text-gray-900 mb-2">Nature-Based Solutions</h3>
                  <p className="text-gray-600">Eco-friendly treatment systems</p>
                </div>
              </div>

              <Link
                href="/projects"
                className="inline-block mt-8 bg-dark-blue text-white px-8 py-3 hover:bg-light-blue transition-colors duration-300"
              >
                View All Projects
              </Link>
            </div>

            <div className="relative">
              <div className="bg-gray-300 h-96 flex items-center justify-center">
                <span className="text-gray-600 text-xl">Project Gallery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter & Contact Split */}
      <section className="py-24 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Newsletter */}
            <div>
              <h2 className="text-3xl font-light text-white mb-4">Stay Informed</h2>
              <p className="text-gray-300 mb-8 text-lg">
                Monthly updates on our projects, opportunities, and water sector insights.
              </p>

              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-light-blue"
                />
                <button className="bg-light-blue text-white px-6 py-3 hover:bg-dark-blue transition-colors duration-300">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Contact CTA */}
            <div>
              <h2 className="text-3xl font-light text-white mb-4">Ready to Collaborate?</h2>
              <p className="text-gray-300 mb-8 text-lg">
                Connect with our team to discuss partnerships, projects, or membership opportunities.
              </p>

              <div className="space-y-4">
                <Link
                  href="/contact"
                  className="block bg-transparent border border-light-blue text-light-blue px-8 py-3 text-center hover:bg-light-blue hover:text-white transition-all duration-300"
                >
                  Get in Touch
                </Link>
                <Link
                  href="/membership"
                  className="block bg-light-blue text-white px-8 py-3 text-center hover:bg-dark-blue transition-colors duration-300"
                >
                  Join Our Network
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}