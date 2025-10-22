import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming Soon - Rwanda Young Water Professionals (RYWP)",
  description: "We're making improvements to serve you better. Our new and improved website will be live very soon!",
};

export default function ComingSoonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
