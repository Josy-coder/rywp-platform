// app/(website)/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Globe, ArrowRight, Play, Award, Mail, Users, Target, Calendar, ChevronRight, Star, TrendingUp, Shield } from 'lucide-react';

// Hero Section Component  
function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M30 0c16.569 0 30 13.431 30 30s-13.431 30-30 30S0 46.569 0 30 13.431 0 30 0z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>


      {/* Floating Elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
    <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-indigo-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
  </div>

  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16">
    <div className={`transition-all duration-1000 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}>
      {/* Badge */}
      <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full text-blue-100 text-sm font-medium mb-8 hover:bg-blue-500/30 transition-all duration-300">
        <Globe className="w-4 h-4 mr-2" />
        Empowering Rwanda's Water Future
        <ChevronRight className="w-4 h-4 ml-2" />
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
        <span className="block">Safe Water,</span>
        <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Brighter Tomorrow
            </span>
      </h1>

      {/* Subtitle */}
      <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
        We are on a mission to conquer the water challenges in Rwanda through innovation,
        collaboration, and sustainable solutions that transform communities.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
        <a
          href="/membership"
          className="group bg-white text-blue-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center space-x-2"
        >
          <span>Join Our Mission</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </a>
        <a
          href="/projects"
          className="group bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300 flex items-center space-x-2"
        >
          <Play className="w-5 h-5" />
          <span>Watch Our Impact</span>
        </a>
      </div>

      {/* Enhanced Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
        {[
          { number: '500+', label: 'Water Professionals', icon: Users },
          { number: '50+', label: 'Active Projects', icon: Target },
          { number: '10+', label: 'Specialized Hubs', icon: Star },
          { number: '100K+', label: 'Lives Impacted', icon: TrendingUp }
        ].map((stat, index) => (
          <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="flex justify-center mb-3">
              <stat.icon className="w-8 h-8 text-blue-300 group-hover:text-white transition-colors" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
            <div className="text-blue-200 text-sm font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Scroll Indicator */}
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
    <div className="animate-bounce">
      <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
        <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
      </div>
    </div>
  </div>
</section>
);
}

// Featured Projects Section with Enhanced Animations
function FeaturedProjects() {
  const [hoveredProject, setHoveredProject] = useState(null);

  const projects = [
    {
      id: 1,
      title: "Clean Water Access in Rural Kayonza",
      description: "Providing sustainable water solutions to 5,000+ residents through innovative water treatment systems and community engagement programs.",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      status: "Ongoing",
      location: "Kayonza District",
      impact: "5,000+ People Served",
      progress: 75,
      year: "2024"
    },
    {
      id: 2,
      title: "Smart Water Management System",
      description: "Implementing IoT-based water monitoring systems in urban areas to optimize water distribution and reduce waste through real-time analytics.",
      image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      status: "Completed",
      location: "Kigali City",
      impact: "30% Water Savings",
      progress: 100,
      year: "2023"
    }
  ];

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
            <Target className="w-4 h-4 mr-2" />
            Our Impact
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Featured Projects
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover how we're making a real difference in Rwanda's water landscape through
            innovative projects and community partnerships that create lasting change.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-3 border border-gray-100"
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                    project.status === 'Ongoing'
                      ? 'bg-green-500/90 text-white'
                      : 'bg-blue-500/90 text-white'
                  }`}>
                    {project.status}
                  </span>
                </div>

                {/* Progress Bar for Ongoing Projects */}
                {project.status === 'Ongoing' && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full h-2">
                      <div
                        className="bg-white h-2 rounded-full transition-all duration-1000"
                        style={{ width: hoveredProject === project.id ? `${project.progress}%` : '0%' }}
                      ></div>
                    </div>
                    <p className="text-white text-xs mt-1">{project.progress}% Complete</p>
                  </div>
                )}

                {/* Location */}
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-800">
                    {project.location}
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-blue-600 font-semibold">{project.year}</span>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-blue-600">
                    <Award className="w-5 h-5" />
                    <span className="font-semibold text-sm">{project.impact}</span>
                  </div>
                  <a
                    href="/projects"
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center space-x-1 group-hover:translate-x-2 transition-transform duration-300"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Projects CTA */}
        <div className="text-center">
          <a
            href="/projects"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 group"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}

// Newsletter Section with Enhanced Design
function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (email && email.includes('@')) {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
      setEmail('');
    }
  };

  return (
    <section className="py-24 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;40&quot; height=&quot;40&quot; viewBox=&quot;0 0 40 40&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Cpath d=%22M20 20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

  {/* Floating Elements */}
  <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
  <div className="absolute bottom-10 right-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl"></div>
  <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-indigo-400/20 rounded-full blur-xl"></div>

  <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div className="mb-8">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6">
        <Mail className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
        Stay Connected
      </h2>
      <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
        Get the latest updates on our projects, events, and opportunities to make
        a difference in Rwanda's water sector. Join our community of changemakers.
      </p>
    </div>

    <div className="max-w-md mx-auto mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
        />
        <button
          onClick={handleSubmit}
          disabled={isSubmitted || isLoading}
          className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Subscribing...</span>
            </>
          ) : isSubmitted ? (
            <>
              <Shield className="w-4 h-4" />
              <span>Subscribed!</span>
            </>
          ) : (
            <span>Subscribe</span>
          )}
        </button>
      </div>
    </div>

    {/* Trust Indicators */}
    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-blue-200">
      <div className="flex items-center space-x-2">
        <Users className="w-5 h-5" />
        <span className="text-sm">1,000+ water professionals</span>
      </div>
      <div className="flex items-center space-x-2">
        <Shield className="w-5 h-5" />
        <span className="text-sm">No spam, unsubscribe anytime</span>
      </div>
      <div className="flex items-center space-x-2">
        <Calendar className="w-5 h-5" />
        <span className="text-sm">Weekly updates</span>
      </div>
    </div>
  </div>
</section>
);
}

// Main Homepage Component
export default function Homepage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedProjects />
      <NewsletterSection />
    </div>
  );
}