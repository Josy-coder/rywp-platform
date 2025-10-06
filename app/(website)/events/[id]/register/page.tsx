"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function EventRegistrationPage() {
  const params = useParams();
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    currentRole: '',
    organization: '',
    organizationWebsite: '',
    industry: '',
    linkedinProfile: '',
    isYWPMember: '',
    aboutYourself: '',
    email: '',
    acceptPrivacyPolicy: false,
    receiveUpdates: false,
    previouslyAttended: '',
    expectations: ''
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Event registration submitted:', formData);
    // Show confirmation message and send confirmation email
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className={`max-w-4xl mx-auto transition-all duration-700 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <Link href={`/events/${params.id}`} className="text-dark-blue hover:text-light-blue mb-4 inline-flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Event Details
            </Link>
            <h1 className="text-5xl font-light text-gray-900 mb-4 mt-4">Event Registration</h1>
            <p className="text-xl text-gray-600">
              Complete the form below to register for this event
            </p>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-gray-50 p-8">
              {/* Personal Information */}
              <div className="mb-12">
                <h2 className="text-2xl font-light text-gray-900 mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  <div className="md:col-span-2">
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
                </div>
              </div>

              {/* Professional Information */}
              <div className="mb-12">
                <h2 className="text-2xl font-light text-gray-900 mb-6">Professional Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Role *</label>
                    <input
                      type="text"
                      name="currentRole"
                      required
                      value={formData.currentRole}
                      onChange={handleInputChange}
                      placeholder="e.g., Water Engineer, Project Manager"
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization *</label>
                    <input
                      type="text"
                      name="organization"
                      required
                      value={formData.organization}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization Website</label>
                    <input
                      type="url"
                      name="organizationWebsite"
                      value={formData.organizationWebsite}
                      onChange={handleInputChange}
                      placeholder="https://"
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                    <select
                      name="industry"
                      required
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark-blue"
                    >
                      <option value="">Select Industry</option>
                      <option value="education">Education</option>
                      <option value="ngo">NGO</option>
                      <option value="private-sector">Private Sector</option>
                      <option value="research">Research</option>
                      <option value="government">Government Institution</option>
                      <option value="international">International Organization</option>
                      <option value="others">Others</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Personal LinkedIn Profile (Optional)</label>
                    <input
                      type="url"
                      name="linkedinProfile"
                      value={formData.linkedinProfile}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark-blue"
                    />
                  </div>
                </div>
              </div>

              {/* Membership & Motivation */}
              <div className="mb-12">
                <h2 className="text-2xl font-light text-gray-900 mb-6">About You</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Are you a YWP Member? *</label>
                    <div className="flex gap-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="isYWPMember"
                          value="yes"
                          required
                          checked={formData.isYWPMember === 'yes'}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="isYWPMember"
                          value="no"
                          required
                          checked={formData.isYWPMember === 'no'}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tell us a bit about yourself: Why would you like to join this event? *
                    </label>
                    <textarea
                      name="aboutYourself"
                      required
                      rows={5}
                      value={formData.aboutYourself}
                      onChange={handleInputChange}
                      placeholder="Share your interest in this event and what you hope to gain from attending..."
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Have you previously attended a RYWP event? *
                    </label>
                    <select
                      name="previouslyAttended"
                      required
                      value={formData.previouslyAttended}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark-blue"
                    >
                      <option value="">Select an option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expectations from the Event *
                    </label>
                    <select
                      name="expectations"
                      required
                      value={formData.expectations}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-dark-blue"
                    >
                      <option value="">Select your primary expectation</option>
                      <option value="networking">Networking</option>
                      <option value="learning">Learning</option>
                      <option value="partnerships">Partnerships</option>
                      <option value="knowledge-sharing">Knowledge sharing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Consent */}
              <div className="mb-8 p-6 bg-white border border-gray-200">
                <h3 className="text-xl font-medium text-gray-900 mb-6">Consent</h3>
                <div className="space-y-4">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="acceptPrivacyPolicy"
                      required
                      checked={formData.acceptPrivacyPolicy}
                      onChange={handleInputChange}
                      className="mt-1 mr-3 flex-shrink-0"
                    />
                    <span className="text-sm text-gray-700">
                      I accept the{' '}
                      <Link href="/privacy-policy" className="text-dark-blue hover:text-light-blue underline">
                        Privacy Policy
                      </Link>{' '}
                      *
                    </span>
                  </label>

                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="receiveUpdates"
                      checked={formData.receiveUpdates}
                      onChange={handleInputChange}
                      className="mt-1 mr-3 flex-shrink-0"
                    />
                    <span className="text-sm text-gray-700">
                      I would like to receive event-related updates and opportunities
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-dark-blue text-white px-12 py-4 text-lg font-medium hover:bg-light-blue transition-colors duration-300"
                >
                  Register
                </button>
                <p className="text-sm text-gray-600 mt-4">
                  You will receive a confirmation email with event details and access information after registration.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Information Box */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-light-blue bg-opacity-10 border border-light-blue p-8">
              <h3 className="text-xl font-medium text-gray-900 mb-4">What to Expect After Registration</h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-light-blue mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p>Confirmation email with event agenda and joining instructions</p>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-light-blue mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p>Virtual attendees will receive meeting link 24 hours before the event</p>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-light-blue mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p>In-person attendees will receive parking and venue details</p>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-light-blue mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p>Reminder email will be sent 48 hours before the event</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}