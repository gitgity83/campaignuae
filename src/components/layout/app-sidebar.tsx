
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Users,
  Settings,
  FileText,
  Target,
  Bell,
  ChevronLeft,
  ChevronRight,
  Home,
  UserCheck,
  ClipboardList
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navigation = {
  admin: [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Campaigns", url: "/campaigns", icon: Target },
    { title: "User Management", url: "/users", icon: Users },
    { title: "Reports", url: "/reports", icon: FileText },
    { title: "Settings", url: "/settings", icon: Settings },
  ],
  supervisor: [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "My Campaigns", url: "/campaigns", icon: Target },
    { title: "Volunteers", url: "/volunteers", icon: UserCheck },
    { title: "Reports", url: "/reports", icon: FileText },
  ],
  volunteer: [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "My Tasks", url: "/tasks", icon: ClipboardList },
    { title: "Surveys", url: "/surveys", icon: BarChart3 },
  ]
};

export function AppSidebar() {
  const { collapsed, setCollapsed } = useSidebar();
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const userNavigation = navigation[user.role] || [];
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavClass = (path: string) => {
    return isActive(path) 
      ? "bg-primary-100 text-primary-700 font-medium border-r-2 border-primary-500" 
      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900";
  };

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg">CampaignHub</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 p-0"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`${getNavClass(item.url)} flex items-center px-3 py-2 rounded-md transition-colors`}
                    >
                      <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary-100 text-primary-700 text-sm font-medium">
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="w-8 h-8 p-0 text-gray-500 hover:text-gray-700"
            title="Sign out"
          >
            <Bell className="w-4 h-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
