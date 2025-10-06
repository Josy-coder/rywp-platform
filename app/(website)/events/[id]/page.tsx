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

export default function EventDetailPage() {
  const params = useParams();
  const [isVisible, setIsVisible] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Sample event data - in production this would come from your database
  const event1 = {
    title: "Knowledge Sharing Session on Climate-Resilient WASH",
    date: "April 25, 2025",
    time: "2:00 PM - 5:00 PM EAT",
    eventDate: new Date("2025-04-25T14:00:00"),
    location: {
      type: "hybrid",
      physical: "Kigali Convention Centre, Hall 3",
      virtual: "Registration required for virtual link",
    },
    banner: "/images/events/climate-wash-session.jpg",
    overview:
      "Join us for an interactive knowledge sharing session focused on building climate resilience in water, sanitation, and hygiene (WASH)...",
    objectives: [/* ... */],
    targetParticipants: [/* ... */],
    expectedOutcomes: [/* ... */],
    agenda: {
      available: true,
      downloadUrl: "/downloads/agenda-climate-wash.pdf",
      schedule: [/* ... */],
    },
    speakers: [/* ... */],
    registration: {
      status: "open",
      deadline: "April 20, 2025",
      fee: "Free for RYWP members, 10,000 RWF for non-members",
      capacity: 150,
      registered: 87,
    },
    organizer: "Rwanda Young Water Professionals (RYWP)",
    partners: ["Ministry of Environment", "WASAC", "UNICEF Rwanda"],
  };

// Now use `typeof event1` as the value type
  const events: { [key: string]: typeof event1 } = {
    "1": event1,
  };

  const event = events[params.id as string] || events["1"];


  // Countdown timer
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const eventTime = event.eventDate.getTime();
      const distance = eventTime - now;

      if (distance > 0) {
        setTimeRemaining({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };

    const interval = setInterval(calculateTimeRemaining, 1000);
    calculateTimeRemaining();

    return () => clearInterval(interval);
  }, [event.eventDate]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <span className="text-white text-2xl">Event Banner Image</span>
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
                href="/events"
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
                Back to Events
              </Link>
              <h1 className="text-5xl font-light mb-6 mt-4">{event.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-lg">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {event.date}
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {event.time}
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
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
                  {event.location.physical}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Timer */}
      <section className="py-8 bg-dark-blue text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm mb-4 opacity-90">Event Starts In:</p>
            <div className="flex justify-center gap-8">
              <div>
                <div className="text-4xl font-light mb-1">
                  {timeRemaining.days}
                </div>
                <div className="text-sm opacity-75">Days</div>
              </div>
              <div>
                <div className="text-4xl font-light mb-1">
                  {timeRemaining.hours}
                </div>
                <div className="text-sm opacity-75">Hours</div>
              </div>
              <div>
                <div className="text-4xl font-light mb-1">
                  {timeRemaining.minutes}
                </div>
                <div className="text-sm opacity-75">Minutes</div>
              </div>
              <div>
                <div className="text-4xl font-light mb-1">
                  {timeRemaining.seconds}
                </div>
                <div className="text-sm opacity-75">Seconds</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-light text-gray-900 mb-6">
              Event Overview
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {event.overview}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">
                  Objectives
                </h3>
                <div className="space-y-2">
                  {event.objectives.map(
                    (
                      objective:
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
                        | undefined,
                      index: Key | null | undefined,
                    ) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-light-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p className="text-gray-600 text-sm">{objective}</p>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">
                  Target Participants
                </h3>
                <div className="space-y-2">
                  {event.targetParticipants
                    .slice(0, 4)
                    .map(
                      (
                        participant:
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
                          | undefined,
                        index: Key | null | undefined,
                      ) => (
                        <div key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-darker-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <p className="text-gray-600 text-sm">{participant}</p>
                        </div>
                      ),
                    )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">
                  Expected Outcomes
                </h3>
                <div className="space-y-2">
                  {event.expectedOutcomes.map(
                    (
                      outcome:
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
                        | undefined,
                      index: Key | null | undefined,
                    ) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-lighter-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p className="text-gray-600 text-sm">{outcome}</p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Agenda */}
      {event.agenda.available && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-light text-gray-900">
                  Agenda / Program
                </h2>
                <a
                  href={event.agenda.downloadUrl}
                  className="flex items-center text-dark-blue hover:text-light-blue transition-colors duration-300"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download PDF
                </a>
              </div>

              <div className="bg-white">
                {event.agenda.schedule.map(
                  (
                    item: {
                      time:
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
                      activity:
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
                    <div
                      key={index}
                      className={`p-6 flex items-start gap-6 ${
                        index !== event.agenda.schedule.length - 1
                          ? "border-b border-gray-200"
                          : ""
                      }`}
                    >
                      <div className="text-dark-blue font-medium whitespace-nowrap">
                        {item.time}
                      </div>
                      <div className="text-gray-700">{item.activity}</div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Location Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-light text-gray-900 mb-8">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-8">
                <h3 className="text-xl font-medium text-gray-900 mb-4">
                  In-Person Attendance
                </h3>
                <div className="flex items-start mb-4">
                  <svg
                    className="w-6 h-6 text-dark-blue mr-3 mt-1 flex-shrink-0"
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
                  <p className="text-gray-700">{event.location.physical}</p>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Please register to receive detailed directions and parking
                  information.
                </p>
                <Link
                  href={`/events/${params.id}/register`}
                  className="inline-block bg-dark-blue text-white px-6 py-3 hover:bg-light-blue transition-colors duration-300"
                >
                  Register for In-Person
                </Link>
              </div>

              <div className="bg-gray-50 p-8">
                <h3 className="text-xl font-medium text-gray-900 mb-4">
                  Virtual Attendance
                </h3>
                <div className="flex items-start mb-4">
                  <svg
                    className="w-6 h-6 text-dark-blue mr-3 mt-1 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                  <p className="text-gray-700">{event.location.virtual}</p>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Virtual participants will receive the meeting link via email
                  after registration.
                </p>
                <Link
                  href={`/events/${params.id}/register`}
                  className="inline-block bg-light-blue text-white px-6 py-3 hover:bg-dark-blue transition-colors duration-300"
                >
                  Register for Virtual
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Info */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-light text-gray-900 mb-8">
              Registration Information
            </h2>
            <div className="bg-white p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="text-sm text-gray-600 mb-2">
                    Registration Status
                  </div>
                  <div className="text-2xl font-light text-dark-blue capitalize">
                    {event.registration.status}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-2">
                    Registration Deadline
                  </div>
                  <div className="text-2xl font-light text-dark-blue">
                    {event.registration.deadline}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-2">
                    Registration Fee
                  </div>
                  <div className="text-xl font-light text-gray-900">
                    {event.registration.fee}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-2">Capacity</div>
                  <div className="text-xl font-light text-gray-900">
                    {event.registration.registered} /{" "}
                    {event.registration.capacity} registered
                  </div>
                  <div className="w-full bg-gray-200 h-2 mt-2">
                    <div
                      className="bg-light-blue h-2"
                      style={{
                        width: `${(event.registration.registered / event.registration.capacity) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="text-center pt-8 border-t border-gray-200">
                <Link
                  href={`/events/${params.id}/register`}
                  className="inline-block bg-dark-blue text-white px-12 py-4 text-lg hover:bg-light-blue transition-colors duration-300"
                >
                  Register Now
                </Link>
                <p className="text-sm text-gray-600 mt-4">
                  Secure your spot before registration closes on{" "}
                  {event.registration.deadline}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-light mb-4">Have Questions?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact our events team for more information about this event
          </p>
          <Link
            href="/contact"
            className="inline-block border border-light-blue text-light-blue px-8 py-3 hover:bg-light-blue hover:text-white transition-all duration-300"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}