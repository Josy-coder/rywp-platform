"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <span className="text-white text-2xl">Contact Us Image</span>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="text-white max-w-3xl">
              <h1 className="text-5xl font-light mb-4">Get in Touch</h1>
              <p className="text-xl font-light opacity-90">
                Connect with our team to discuss partnerships, projects, or membership opportunities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Information */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <div className="flex items-center mb-6">
                <div className="w-1 h-12 bg-dark-blue mr-4"></div>
                <h2 className="text-3xl font-light text-gray-900">Send us a Message</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark-blue transition-colors duration-300"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark-blue transition-colors duration-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Inquiry Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark-blue transition-colors duration-300"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="membership">Membership</option>
                    <option value="partnership">Partnership</option>
                    <option value="project">Project Collaboration</option>
                    <option value="media">Media & Press</option>
                    <option value="technical">Technical Support</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark-blue transition-colors duration-300"
                    placeholder="Brief subject of your message"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark-blue transition-colors duration-300 resize-vertical"
                    placeholder="Please provide details about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-dark-blue text-white py-4 text-lg font-medium hover:bg-light-blue transition-colors duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <div className="flex items-center mb-6">
                <div className="w-1 h-12 bg-light-blue mr-4"></div>
                <h2 className="text-3xl font-light text-gray-900">Contact Information</h2>
              </div>

              <div className="space-y-8">
                {/* Main Office */}
                <div className="bg-gray-50 p-6">
                  <h3 className="text-xl font-medium text-gray-900 mb-4">Main Office</h3>
                  <div className="space-y-3 text-gray-600">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-dark-blue mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p>KG 123 St, Kimisagara</p>
                        <p>P.O. Box 1234, Kigali, Rwanda</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-dark-blue mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <p>+250 788 123 456</p>
                    </div>

                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-dark-blue mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <p>info@rywp.rw</p>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-4">Business Hours</h3>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>8:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>9:00 AM - 1:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>

                {/* Quick Contacts */}
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-4">Quick Contacts</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-900">Membership</p>
                        <p className="text-sm text-gray-600">Join our network</p>
                      </div>
                      <Link href="mailto:membership@rywp.rw" className="text-dark-blue hover:text-light-blue">
                        membership@rywp.rw
                      </Link>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-900">Partnerships</p>
                        <p className="text-sm text-gray-600">Collaborate with us</p>
                      </div>
                      <Link href="mailto:partnerships@rywp.rw" className="text-dark-blue hover:text-light-blue">
                        partnerships@rywp.rw
                      </Link>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50">
                      <div>
                        <p className="font-medium text-gray-900">Media</p>
                        <p className="text-sm text-gray-600">Press inquiries</p>
                      </div>
                      <Link href="mailto:media@rywp.rw" className="text-dark-blue hover:text-light-blue">
                        media@rywp.rw
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Address & Map */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-1 h-12 bg-lighter-blue mr-4"></div>
                <h2 className="text-3xl font-light text-gray-900">Visit Our Office</h2>
              </div>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Our main office is located in the heart of Kigali, easily accessible by public transport.
                We welcome visitors by appointment and encourage partners and members to schedule meetings
                to discuss collaboration opportunities.
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-dark-blue rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <p className="text-gray-600">Located near major government offices and development partners</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-light-blue rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <p className="text-gray-600">Accessible by public transport (Bus stops: Kimisagara, Nyabugogo)</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-lighter-blue rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <p className="text-gray-600">Parking available for visitors</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-300 h-80 flex items-center justify-center">
                <span className="text-gray-600 text-xl">Interactive Map</span>
              </div>
              <p className="text-center text-sm text-gray-600 mt-4">
                Click to view interactive map with directions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section id="newsletter" className="py-24 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-light text-white mb-4">Stay Connected</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for monthly updates on projects, events, and opportunities in Rwanda&#39;s water sector
          </p>

          <div className="max-w-md mx-auto mb-8">
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

          <p className="text-sm text-gray-400">
            We respect your privacy and will never share your information. Unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* Social Media Links */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-light text-gray-900 mb-8">Follow Us</h2>
          <div className="flex justify-center space-x-6">
            <a href="#" className="w-12 h-12 bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-dark-blue hover:text-white transition-all duration-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="w-12 h-12 bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-dark-blue hover:text-white transition-all duration-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/>
              </svg>
            </a>
            <a href="#" className="w-12 h-12 bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-dark-blue hover:text-white transition-all duration-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" className="w-12 h-12 bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-dark-blue hover:text-white transition-all duration-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}