"use client";

import { usePathname } from "next/navigation";
import Bar from "./Bar";
import { ReactNode } from "react";

export default function LayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const noNavbarPath = ["/login", "/register"];
  const showNavbar = !noNavbarPath.includes(pathname);

  if (showNavbar) {
    return <Bar>{children}</Bar>;
  }

  return <>{children}</>;
}
