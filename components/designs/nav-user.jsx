"use client"

import { ChevronsUpDown } from "lucide-react"

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar"
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar"
import { useUser } from "@clerk/nextjs"

export function NavUser() {
	const { isMobile } = useSidebar()

	const { user } = useUser();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
				>
					<Avatar className="h-8 w-8 rounded-lg">
						<AvatarImage src={user?.imageUrl} alt={'user.fullName'} />
						<AvatarFallback className="rounded-lg">AI</AvatarFallback>
					</Avatar>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-medium">{user?.fullName}</span>
						<span className="truncate text-xs">{user?.primaryEmailAddress?.emailAddress}</span>
					</div>
					<ChevronsUpDown className="ml-auto size-4" />
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
