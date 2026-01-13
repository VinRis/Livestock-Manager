"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, ClipboardList, CalendarCheck, BarChart3, DollarSign, Settings, Sheep } from "lucide-react";

import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/livestock", label: "Livestock", icon: Sheep },
  { href: "/activity", label: "Activity", icon: ClipboardList },
  { href: "/tasks", label: "Tasks", icon: CalendarCheck },
  { href: "/finance", label: "Finance", icon: DollarSign },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  // We need to adjust grid columns based on the number of nav items.
  const gridColsClass = `grid-cols-${navLinks.length}`;

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-40 grid h-16 border-t bg-background/95 backdrop-blur-sm",
      gridColsClass
      )}>
      {navLinks.map((link) => {
        const isActive = (pathname === "/" && link.href === "/") || (pathname !== "/" && link.href !== "/" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "group flex flex-col items-center justify-center gap-1 p-1 text-sm font-medium text-muted-foreground",
              isActive && "text-primary"
            )}
          >
            <link.icon className="h-5 w-5" />
            <span className="text-[10px] text-center">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
