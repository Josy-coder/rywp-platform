"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCheck,
  FolderOpen,
  BookOpen,
  Calendar,
  Handshake,
  Briefcase,
  Mail
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Image from "next/image";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Organization",
    href: "/dashboard/organization",
    icon: Building2,
  },
  {
    title: "Our Hubs",
    href: "/dashboard/hubs",
    icon: Users,
  },
  {
    title: "Membership",
    href: "/dashboard/membership",
    icon: UserCheck,
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: FolderOpen,
  },
  {
    title: "Publications",
    href: "/dashboard/publications",
    icon: BookOpen,
  },
  {
    title: "Events & Media",
    href: "/dashboard/events",
    icon: Calendar,
  },
  {
    title: "Partners",
    href: "/dashboard/partners",
    icon: Handshake,
  },
  {
    title: "Opportunities",
    href: "/dashboard/opportunities",
    icon: Briefcase,
  },
  {
    title: "Newsletter",
    href: "/dashboard/newsletter",
    icon: Mail,
  },
];

interface SidebarProps {
  isCollapsed?: boolean;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ isCollapsed = false, isMobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  const SidebarContent = ({ showTooltips = false }: { showTooltips?: boolean }) => (
    <TooltipProvider>
      <div className={cn("p-4 lg:p-6", isCollapsed && showTooltips && "px-3")}>
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            const LinkContent = (
              <Link
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out",
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-700 hover:bg-[#29c3ec] hover:text-white",
                  isCollapsed && showTooltips && "justify-center px-3 py-2.5"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {(!isCollapsed || !showTooltips) && <span>{item.title}</span>}
              </Link>
            );

            if (isCollapsed && showTooltips) {
              return (
                <Tooltip key={item.href} delayDuration={300}>
                  <TooltipTrigger asChild>
                    {LinkContent}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return (
              <div key={item.href}>
                {LinkContent}
              </div>
            );
          })}
        </nav>
      </div>
    </TooltipProvider>
  );

  return (
    <>

      <aside
        className={cn(
          "bg-white border-r border-gray-200 transition-all duration-500 ease-in-out overflow-hidden shadow-sm",
          isCollapsed ? "w-20" : "w-64",
          "h-full"
        )}
      >
        <div className="h-full overflow-y-auto">
          <SidebarContent showTooltips={isCollapsed} />
        </div>
      </aside>


      <Sheet open={isMobileOpen} onOpenChange={onMobileClose}>
        <SheetContent side="left" className="p-0 w-64">
          <SheetHeader className="p-6 border-b">
            <SheetTitle className="text-left flex items-center space-x-3">
              <Image
                src="/images/logo-4.png"
                alt="RYWP Logo"
                width={150}
                height={30}
                className="h-6 w-auto"
              />
            </SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100vh-8rem)] overflow-y-auto">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}