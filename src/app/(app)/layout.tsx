"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarCheck, ClipboardList, DollarSign, LayoutGrid, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, useSidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { CowIcon } from "@/components/icons";

const navLinks = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/livestock", label: "Livestock", icon: CowIcon },
  { href: "/activity", label: "Activity", icon: ClipboardList },
  { href: "/tasks", label: "Tasks", icon: CalendarCheck },
  { href: "/finance", label: "Finance", icon: DollarSign },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon" className="border-r">
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg font-headline">
             <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <CowIcon className="w-5 h-5" />
             </div>
            <span className="group-data-[collapsible=icon]:hidden">Livestock Lynx</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navLinks.map((link) => {
              const isActive = (pathname === "/" && link.href === "/") || (pathname !== "/" && link.href !== "/" && pathname.startsWith(link.href));
              return (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton asChild isActive={isActive} tooltip={link.label}>
                    <Link href={link.href}>
                      <link.icon />
                      <span>{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
             <SidebarMenuItem>
                <SidebarMenuButton tooltip="Profile">
                   <Avatar className="h-8 w-8">
                    <AvatarImage src="https://picsum.photos/seed/user/100/100" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">User Profile</span>
                </SidebarMenuButton>
             </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-col w-full md:pb-0 pb-16">
        {children}
      </div>
      <MobileNav />
    </SidebarProvider>
  );
}
