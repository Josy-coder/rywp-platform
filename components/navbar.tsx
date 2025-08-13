"use client";

import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Bell, ChevronDown, LogOut, User, Menu } from "lucide-react";
import Image from "next/image";

interface NavbarProps {
  onNotificationsToggle: () => void;
  notificationsOpen: boolean;
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export function Navbar({
                         onNotificationsToggle,
                         onMobileMenuToggle,
                       }: NavbarProps) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };


  const getRoleDisplay = (user: any) => {
    if (user.isSuperAdmin) return "Super Admin";
    if (user.isGlobalAdmin) return "Admin";
    if (user.hasTemporaryAdmin) return "Temp Admin";
    return "Member";
  };

  return (
    <nav className="bg-primary border-b border-primary/20 px-4 lg:px-4 py-3 flex items-center justify-between h-16">

      <div className="flex items-center space-x-3">

        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileMenuToggle}
          className="text-white hover:bg-white/10 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>


        <div className="hidden lg:flex items-center">
          <Image
            src="/images/logo-4.png"
            alt="RYWP Logo"
            width={200}
            height={100}
            className="h-24 w-full"
          />
        </div>
      </div>


      <div className="flex items-center space-x-2 lg:space-x-4">

        <Button
          variant="ghost"
          size="icon"
          onClick={onNotificationsToggle}
          className="text-white hover:bg-white/10 relative"
        >
          <Bell className="h-5 w-5" />

          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            3
          </Badge>
        </Button>


        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="text-white hover:text-white hover:bg-white/10 flex items-center space-x-2 px-2 lg:px-3 py-6"
            >

              <div className="hidden lg:flex flex-col items-start mr-2">
                <span className="text-sm font-medium truncate max-w-32 text-left">
                  {user?.name}
                </span>
                <Badge
                  variant="secondary"
                  className="text-xs h-4 px-1 bg-light-blue text-primary"
                >
                  {user && getRoleDisplay(user)}
                </Badge>
              </div>

              <Avatar className="h-7 w-7 lg:h-8 lg:w-8">
                <AvatarImage src={user?.profileImage} alt={user?.name} />
                <AvatarFallback className="bg-white/20 text-white text-xs lg:text-sm">
                  {user?.name ? getUserInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>

              <ChevronDown className="h-4 w-4 transition-transform duration-200 hidden lg:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <span className="font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
                <Badge
                  variant="secondary"
                  className="text-xs h-4 px-1 w-fit bg-light-blue text-primary"
                >
                  {user && getRoleDisplay(user)}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}