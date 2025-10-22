"use client";

import Image from "next/image";

export default function ComingSoonPage() {
  return (
    <div className="h-screen bg-gradient-to-br from-white via-blue-50/30 to-white flex items-center justify-center p-4 overflow-hidden">
      <div className="max-w-4xl w-full text-center space-y-2">

        <div className="flex justify-center">
          <Image
            src="/images/logo.png"
            alt="RYWP Logo"
            width={200}
            height={80}
            priority
            className="object-contain"
          />
        </div>


        <div className="py-4">
          <svg
            viewBox="0 0 800 300"
            className="w-full max-w-xl mx-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background Elements */}
            <defs>
              <linearGradient
                id="waterGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#007eff", stopOpacity: 0.8 }}
                />
                <stop
                  offset="50%"
                  style={{ stopColor: "#29c3ec", stopOpacity: 0.6 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#0fccce", stopOpacity: 0.8 }}
                />
              </linearGradient>

              <linearGradient
                id="skyGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#007eff", stopOpacity: 0.1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#29c3ec", stopOpacity: 0.2 }}
                />
              </linearGradient>
            </defs>

            {/* Sky Background */}
            <rect
              x="0"
              y="0"
              width="800"
              height="250"
              fill="url(#skyGradient)"
            />

            {/* Mountains/Hills in background */}
            <path
              d="M 0 150 Q 150 120 300 140 T 600 130 T 800 150 L 800 300 L 0 300 Z"
              fill="#083266"
              opacity="0.1"
            />

            <path
              d="M 0 170 Q 200 140 400 160 T 800 165 L 800 300 L 0 300 Z"
              fill="#083266"
              opacity="0.15"
            />

            {/* Water Droplet - Main Feature */}
            <g transform="translate(400, 120)">
              {/* Main droplet */}
              <path
                d="M 0 -50 C -25 -35 -40 -10 -40 15 C -40 40 -22 55 0 55 C 22 55 40 40 40 15 C 40 -10 25 -35 0 -50 Z"
                fill="url(#waterGradient)"
              >
                <animateTransform
                  attributeName="transform"
                  type="scale"
                  values="1;1.05;1"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </path>

              {/* Highlight on droplet */}
              <ellipse
                cx="-12"
                cy="-8"
                rx="10"
                ry="15"
                fill="white"
                opacity="0.4"
              />

              {/* Small shine spot */}
              <circle cx="-16" cy="-16" r="4" fill="white" opacity="0.6" />
            </g>

            {/* Ripples around droplet */}
            <g transform="translate(400, 175)">
              <ellipse
                cx="0"
                cy="0"
                rx="50"
                ry="6"
                fill="none"
                stroke="#29c3ec"
                strokeWidth="2"
                opacity="0.3"
              >
                <animate
                  attributeName="rx"
                  values="50;70;50"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.3;0.1;0.3"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </ellipse>

              <ellipse
                cx="0"
                cy="0"
                rx="70"
                ry="8"
                fill="none"
                stroke="#007eff"
                strokeWidth="2"
                opacity="0.2"
              >
                <animate
                  attributeName="rx"
                  values="70;90;70"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.2;0.05;0.2"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              </ellipse>
            </g>

            {/* Floating particles */}
            <circle cx="200" cy="80" r="3" fill="#29c3ec" opacity="0.4">
              <animate
                attributeName="cy"
                values="80;70;80"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.4;0.7;0.4"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>

            <circle cx="600" cy="90" r="4" fill="#007eff" opacity="0.3">
              <animate
                attributeName="cy"
                values="90;80;90"
                dur="4s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.3;0.6;0.3"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>

            <circle cx="300" cy="60" r="2" fill="#0fccce" opacity="0.5">
              <animate
                attributeName="cy"
                values="60;50;60"
                dur="3.5s"
                repeatCount="indefinite"
              />
            </circle>

            <circle cx="500" cy="70" r="3" fill="#29c3ec" opacity="0.4">
              <animate
                attributeName="cy"
                values="70;60;70"
                dur="4.5s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Ground/Base */}
            <rect
              x="0"
              y="250"
              width="800"
              height="50"
              fill="#083266"
              opacity="0.05"
            />
          </svg>
        </div>

        {/* Coming Soon Message */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-[#083266]">
              Under Renovation
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              We&apos;re making improvements to serve you better. Our new and
              improved website will be live very soon!
            </p>
          </div>

          {/* Loading Animation */}
          <div className="flex items-center justify-center gap-2 py-3">
            <div
              className="w-3 h-3 rounded-full bg-[#007eff] animate-bounce"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-3 h-3 rounded-full bg-[#29c3ec] animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-3 h-3 rounded-full bg-[#0fccce] animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>

          {/* Contact Info */}
          <div className="pt-4 space-y-1">
            <p className="text-gray-500 text-sm">
              For urgent inquiries, reach us at:
            </p>
            <a
              href="mailto:info@rywp.org"
              className="text-[#007eff] hover:text-[#29c3ec] transition-colors font-medium text-base"
            >
              info@rywp.org
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 text-xs text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Rwanda Young Water Professionals.
            All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
