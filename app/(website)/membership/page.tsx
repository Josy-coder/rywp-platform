"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function MembershipPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('benefits');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profession: '',
    experience: '',
    organization: '',
    location: '',
    hub: '',
    motivation: '',
    skills: [],
    interests: []
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const membershipBenefits = [
    {
      title: "Professional Development",
      description: "Access to training programs, workshops, and certification opportunities",
      features: [
        "Monthly technical training sessions",
        "Leadership development programs",
        "Professional certification pathways",
        "Mentorship opportunities with senior professionals"
      ]
    },
    {
      title: "Networking & Community",
      description: "Connect with water professionals across Rwanda and internationally",
      features: [
        "Regional hub meetings and events",
        "Annual national conference access",
        "Online community platform",
        "International water professional networks"
      ]
    },
    {
      title: "Career Opportunities",
      description: "Priority access to job openings, internships, and project opportunities",
      features: [
        "Exclusive job board access",
        "Project collaboration opportunities",
        "Internship and fellowship programs",
        "Career guidance and support"
      ]
    },
    {
      title: "Knowledge Resources",
      description: "Access to research, publications, and technical resources",
      features: [
        "Technical publication library",
        "Research collaboration opportunities",
        "Policy briefings and updates",
        "Best practices database"
      ]
    }
  ];

  const membershipDetails = {
    name: "RYWP Member",
    price: "30,000 RWF",
    duration: "Annual",
    description: "Join Rwanda's leading network of young water professionals",
    features: [
      "Full access to all events and workshops",
      "Hub participation and voting rights",
      "Professional development programs",
      "Networking platform access",
      "Project collaboration opportunities",
      "Mentorship program participation",
      "Technical training sessions",
      "Career guidance and support",
      "Research collaboration opportunities",
      "Policy working group participation"
    ],
    eligibility: "Water sector professionals, students, and enthusiasts"
  };

  const applicationSteps = [
    {
      step: 1,
      title: "Choose Membership Type",
      description: "Select the membership tier that best fits your profile and career stage"
    },
    {
      step: 2,
      title: "Complete Application",
      description: "Fill out the online application form with your background and motivations"
    },
    {
      step: 3,
      title: "Review Process",
      description: "Our membership committee reviews your application (typically 5-7 business days)"
    },
    {
      step: 4,
      title: "Welcome & Onboarding",
      description: "Join your hub community and start participating in RYWP activities"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Membership application submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <span className="text-white text-2xl">Community Membership Image</span>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className={`text-white max-w-3xl transition-all duration-700 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <h1 className="text-5xl font-light mb-4">Join Our Community</h1>
              <p className="text-xl font-light opacity-90">
                Become part of Rwanda's leading network of young water professionals
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
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                RYWP membership connects you with a dynamic community of water professionals
                committed to transforming Rwanda's water landscape through innovation, collaboration, and excellence.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Whether you're just starting your career or are an experienced professional,
                RYWP provides the platform, resources, and network to accelerate your impact in the water sector.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-gray-50">
                <div className="text-3xl font-light text-dark-blue mb-2">500+</div>
                <div className="text-gray-600">Active Members</div>
              </div>
              <div className="text-center p-6 bg-gray-50">
                <div className="text-3xl font-light text-dark-blue mb-2">4</div>
                <div className="text-gray-600">Regional Hubs</div>
              </div>
              <div className="text-center p-6 bg-gray-50">
                <div className="text-3xl font-light text-dark-blue mb-2">50+</div>
                <div className="text-gray-600">Events Annually</div>
              </div>
              <div className="text-center p-6 bg-gray-50">
                <div className="text-3xl font-light text-dark-blue mb-2">25+</div>
                <div className="text-gray-600">Partner Organizations</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Information Tabs */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Membership Information</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore membership benefits, tiers, and application process
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('benefits')}
                className={`px-8 py-3 transition-colors duration-300 ${
                  activeTab === 'benefits'
                    ? 'bg-dark-blue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Benefits
              </button>
              <button
                onClick={() => setActiveTab('tiers')}
                className={`px-8 py-3 transition-colors duration-300 ${
                  activeTab === 'tiers'
                    ? 'bg-dark-blue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Membership Details
              </button>
              <button
                onClick={() => setActiveTab('process')}
                className={`px-8 py-3 transition-colors duration-300 ${
                  activeTab === 'process'
                    ? 'bg-dark-blue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Application Process
              </button>
            </div>
          </div>

          {/* Benefits Tab */}
          {activeTab === 'benefits' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {membershipBenefits.map((benefit, index) => (
                <div key={index} className="bg-white p-8">
                  <h3 className="text-xl font-medium text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 mb-6">{benefit.description}</p>

                  <div className="space-y-3">
                    {benefit.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-light-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Membership Details */}
          {activeTab === 'tiers' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-dark-blue text-white p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-light mb-2">{membershipDetails.name}</h3>
                  <div className="text-3xl font-light mb-2">{membershipDetails.price}</div>
                  <div className="text-sm opacity-75">{membershipDetails.duration}</div>
                </div>

                <p className="text-center mb-8 opacity-90">{membershipDetails.description}</p>

                <div className="space-y-3 mb-8">
                  {membershipDetails.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0 opacity-75"></div>
                      <span className="text-sm opacity-90">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center text-sm opacity-75 mb-8">
                  <strong>Open to:</strong> {membershipDetails.eligibility}
                </div>

                <button className="w-full bg-white text-dark-blue py-3 text-sm font-medium hover:bg-gray-100 transition-colors duration-300">
                  Apply for Membership
                </button>
              </div>
            </div>
          )}

          {/* Application Process Tab */}
          {activeTab === 'process' && (
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                {applicationSteps.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-dark-blue mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl rounded-full">
                      {step.step}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white p-8">
                <h3 className="text-2xl font-light text-gray-900 mb-6">Application Requirements</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Required Documents:</h4>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-dark-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-600 text-sm">Updated CV/Resume</span>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-dark-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-600 text-sm">Professional references (2)</span>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-dark-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-600 text-sm">Statement of motivation (500 words)</span>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-dark-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-600 text-sm">Academic certificates (for students)</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Selection Criteria:</h4>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-light-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-600 text-sm">Water sector experience or education</span>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-light-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-600 text-sm">Commitment to professional development</span>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-light-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-600 text-sm">Alignment with RYWP values</span>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-light-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-600 text-sm">Potential for community contribution</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Application Form */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light text-gray-900 mb-4">Apply for Membership</h2>
              <p className="text-xl text-gray-600">
                Complete the form below to begin your RYWP membership application
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-gray-50 p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-6">Personal Information</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark-blue"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-6">Professional Information</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Profession/Role *</label>
                      <input
                        type="text"
                        name="profession"
                        required
                        value={formData.profession}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark-blue"
                      >
                        <option value="">Select experience level</option>
                        <option value="student">Student</option>
                        <option value="0-2">0-2 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="6-10">6-10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Organization/Institution</label>
                      <input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location (District/City) *</label>
                      <input
                        type="text"
                        name="location"
                        required
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Hub *</label>
                      <select
                        name="hub"
                        required
                        value={formData.hub}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark-blue"
                      >
                        <option value="">Select your preferred hub</option>
                        <option value="kigali">Kigali Hub</option>
                        <option value="eastern">Eastern Hub</option>
                        <option value="western">Western Hub</option>
                        <option value="northern">Northern Hub</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Motivation Statement */}
              <div className="mt-8">
                <h3 className="text-xl font-medium text-gray-900 mb-6">Motivation & Goals</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you want to join RYWP? What do you hope to contribute and achieve? * (Max 500 words)
                  </label>
                  <textarea
                    name="motivation"
                    required
                    rows={6}
                    value={formData.motivation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark-blue"
                    placeholder="Share your motivation for joining RYWP and your professional goals..."
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="mt-8 p-6 bg-white border">
                <h4 className="font-medium text-gray-900 mb-4">Terms and Conditions</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>By submitting this application, I agree to:</p>
                  <div className="space-y-1 ml-4">
                    <div>• Abide by RYWP's code of conduct and professional standards</div>
                    <div>• Actively participate in hub activities and contribute to the community</div>
                    <div>• Pay annual membership fees according to selected tier</div>
                    <div>• Maintain accurate and updated profile information</div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="flex items-center">
                    <input type="checkbox" required className="mr-3" />
                    <span className="text-sm text-gray-600">
                      I have read and agree to the terms and conditions *
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 text-center">
                <button
                  type="submit"
                  className="bg-dark-blue text-white px-12 py-4 text-lg font-medium hover:bg-light-blue transition-colors duration-300"
                >
                  Submit Application
                </button>
                <p className="text-sm text-gray-600 mt-4">
                  You will receive a confirmation email once your application is submitted.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-light text-white mb-4">Ready to Make an Impact?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of water professionals working to transform Rwanda's water future
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#application"
              className="bg-light-blue text-white px-8 py-3 hover:bg-dark-blue transition-colors duration-300"
            >
              Apply Now
            </a>
            <Link
              href="/contact"
              className="border border-light-blue text-light-blue px-8 py-3 hover:bg-light-blue hover:text-white transition-all duration-300"
            >
              Have Questions?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}