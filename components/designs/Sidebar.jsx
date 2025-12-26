"use client"

import * as React from "react"
import { usePathname } from "next/navigation";

import { FileVideo, GalleryVerticalEnd, Mic, PanelsTopLeft, ShieldPlus } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";
import { NavUser } from "./nav-user";

// This is sample data.
const data = {
  navMain: [
    {
      id: 1,
      name: 'Dashboard',
      path: '/dashboard',
      icon: PanelsTopLeft,
    },
    {
      id: 2,
      name: 'Create',
      path: '/dashboard/create',
      icon: FileVideo,
    },
    {
      id: 3,
      name: 'Audio',
      path: '/dashboard/audio',
      icon: Mic,
    },
    {
      id: 4,
      name: 'Upgrade',
      path: '/dashboard/upgrade',
      icon: ShieldPlus,
    },
  ],
}


export function AppSidebar({
  ...props
}) {

  const pathName = usePathname();

  return (
    <Sidebar variant="left" {...props}>

      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div
                  className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">AI Content Maker</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {data.navMain.map((item) => (

              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton asChild>
                  <Link href={item.path} className={`font-medium ${pathName == item.path && 'bg-primary text-white'}`}>
                    <item.icon />
                    <h2>{item.name}</h2>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Link href={'/dashboard/account'}>
          <NavUser />
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
