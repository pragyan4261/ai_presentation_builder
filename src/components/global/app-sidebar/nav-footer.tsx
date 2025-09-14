import { Button } from "@/components/ui/button";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { User } from "@/generated/prisma/client";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const NavFooter = ({ prsimaUser }: { prsimaUser: User }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  // handleUpgrading and subscription logic removed
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex flex-col gap-y-6 items-center group-data-[collapsible=icon]:hidden"></div>
      </SidebarMenuItem>
      <SignedIn>
        <SidebarMenuButton
          size={"lg"}
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <UserButton />{" "}
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden ">
            {" "}
            <span className="truncate font-semibold">{user?.fullName}</span>
            <span className="truncate text-gray-500 text-sm">
              {user?.emailAddresses[0]?.emailAddress}
            </span>
          </div>
        </SidebarMenuButton>
      </SignedIn>
    </SidebarMenu>
  );
};

export default NavFooter;