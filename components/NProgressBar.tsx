"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false });

export default function NProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.start();
    NProgress.done();
    // eslint-disable-next-line
  }, [pathname, searchParams]);

  return null;
}

// Add custom styles for the progress bar color
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    #nprogress .bar {
      background: #b70002 !important;
      height: 3px;
    }
    #nprogress .peg {
      box-shadow: 0 0 10px #b70002, 0 0 5px #b70002 !important;
    }
  `;
  document.head.appendChild(style);
} 