"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Bell, CheckCircle, AlertCircle, Info, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface NotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockNotifications = [
  {
    id: 1,
    type: "membership",
    title: "New Membership Application",
    message: "John Doe has submitted a membership application",
    time: "2 minutes ago",
    isRead: false,
    icon: Users,
  },
  {
    id: 2,
    type: "publication",
    title: "Publication Pending Review",
    message: "Article 'Water Quality in Rwanda' needs approval",
    time: "1 hour ago",
    isRead: false,
    icon: AlertCircle,
  },
  {
    id: 3,
    type: "hub",
    title: "Hub Application Approved",
    message: "Sarah Wilson has been approved for Water Quality Hub",
    time: "3 hours ago",
    isRead: true,
    icon: CheckCircle,
  },
  {
    id: 4,
    type: "event",
    title: "Event Registration Open",
    message: "Water Summit 2024 registration is now open",
    time: "1 day ago",
    isRead: true,
    icon: Info,
  },
  {
    id: 5,
    type: "system",
    title: "System Maintenance",
    message: "Scheduled maintenance on Sunday 3:00 AM - 5:00 AM",
    time: "2 days ago",
    isRead: true,
    icon: Bell,
  },
  {
    id: 6,
    type: "membership",
    title: "New Member Joined",
    message: "Welcome Marie Claire to the RYWP community",
    time: "3 days ago",
    isRead: true,
    icon: Users,
  },
  {
    id: 7,
    type: "publication",
    title: "Publication Published",
    message: "Your article 'Sustainable Water Management' is now live",
    time: "1 week ago",
    isRead: true,
    icon: CheckCircle,
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "membership":
      return Users;
    case "publication":
      return AlertCircle;
    case "hub":
      return CheckCircle;
    case "event":
      return Info;
    default:
      return Bell;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case "membership":
      return "text-[#007eff]";
    case "publication":
      return "text-amber-600";
    case "hub":
      return "text-green-600";
    case "event":
      return "text-[#29c3ec]";
    default:
      return "text-gray-600";
  }
};

export function Notifications({ isOpen, onClose }: NotificationsProps) {

  const NotificationContent = () => (
    <div className="flex flex-col h-full">

      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary flex-shrink-0">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-white">Notifications</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/10 lg:flex hidden"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>


      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-4">
          <div className="py-4 space-y-3">
            {mockNotifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No notifications yet</p>
              </div>
            ) : (
              mockNotifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type);
                const iconColor = getNotificationColor(notification.type);

                return (
                  <Card
                    key={notification.id}
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-gray-50 border-l-4",
                      !notification.isRead
                        ? "ring-1 ring-primary/20 bg-primary/5 border-l-primary"
                        : "border-l-gray-200"
                    )}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start space-x-3">
                        <div className={cn("flex-shrink-0 mt-0.5", iconColor)}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 ml-2" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 break-words">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>


      <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
        <Button variant="outline" className="w-full text-sm">
          Mark All as Read
        </Button>
      </div>
    </div>
  );

  return (
    <>

      <div
        className={cn(
          "hidden lg:block w-80 bg-white border-l border-gray-200 shadow-lg transform transition-all duration-500 ease-in-out",
          "h-full",
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}
      >
        <NotificationContent />
      </div>


      <Sheet open={isOpen && typeof window !== 'undefined' && window.innerWidth < 1024} onOpenChange={onClose}>
        <SheetContent side="right" className="p-0 w-full sm:w-80">
          <SheetHeader className="p-4 border-b bg-primary">
            <SheetTitle className="text-left text-white flex items-center space-x-2">
              <span>Notifications</span>
            </SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100vh-6rem)] flex flex-col">
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full px-4">
                <div className="py-4 space-y-3">
                  {mockNotifications.map((notification) => {
                    const IconComponent = getNotificationIcon(notification.type);
                    const iconColor = getNotificationColor(notification.type);

                    return (
                      <Card
                        key={notification.id}
                        className={cn(
                          "cursor-pointer transition-colors hover:bg-gray-50 border-l-4",
                          !notification.isRead
                            ? "ring-1 ring-primary/20 bg-primary/5 border-l-primary"
                            : "border-l-gray-200"
                        )}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start space-x-3">
                            <div className={cn("flex-shrink-0 mt-0.5", iconColor)}>
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-900 truncate">
                                  {notification.title}
                                </h3>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 ml-2" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1 break-words">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
            <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
              <Button variant="outline" className="w-full text-sm">
                Mark All as Read
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}