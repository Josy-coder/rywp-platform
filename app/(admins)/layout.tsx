"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { Notifications } from "@/components/notifications-panel";
import { cn } from "@/lib/utils";

export default function AdminLayout({
                                      children,
                                    }: {
  children: React.ReactNode;
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);

    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const closeNotifications = () => {
    setNotificationsOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const shouldCollapseSidebar = isDesktop && notificationsOpen;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar
          onNotificationsToggle={toggleNotifications}
          notificationsOpen={notificationsOpen}
          onMobileMenuToggle={toggleMobileMenu}
          isMobileMenuOpen={isMobileMenuOpen}
        />
      </div>

      <div className="flex flex-1 pt-16"> 
        
        <div className="hidden lg:block fixed left-0 top-16 bottom-0 z-40">
          <Sidebar
            isCollapsed={shouldCollapseSidebar}
            isMobileOpen={isMobileMenuOpen}
            onMobileClose={closeMobileMenu}
          />
        </div>

        
        <div className="lg:hidden">
          <Sidebar
            isCollapsed={shouldCollapseSidebar}
            isMobileOpen={isMobileMenuOpen}
            onMobileClose={closeMobileMenu}
          />
        </div>

        
        <main
          className={cn(
            "flex-1 transition-all duration-500 ease-in-out overflow-y-auto h-[calc(100vh-4rem)]",

            isDesktop && !shouldCollapseSidebar && !notificationsOpen && "ml-64",
            isDesktop && shouldCollapseSidebar && notificationsOpen && "ml-16 mr-80",
            isDesktop && !shouldCollapseSidebar && notificationsOpen && "ml-64 mr-80",
            isDesktop && shouldCollapseSidebar && !notificationsOpen && "ml-16",

            !isDesktop && "ml-0 mr-0"
          )}
        >
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>


        {notificationsOpen && (
          <div className="fixed top-16 right-0 bottom-0 z-30">
            <Notifications
              isOpen={notificationsOpen}
              onClose={closeNotifications}
            />
          </div>
        )}

      </div>

      
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}
    </div>
  );
}