"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function SessionGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip session guard on public pages
    const isPublicPage = pathname === "/login" || pathname === "/signup" || pathname === "/";
    if (isPublicPage) return;

    // Check if user is logged in
    const checkSession = () => {
      const userStr = localStorage.getItem("datasub_user");
      if (!userStr) return; // Not logged in

      const lastActive = localStorage.getItem("datasub_last_active");
      const now = Date.now();

      // If last active is not set, initialize it
      if (!lastActive) {
        localStorage.setItem("datasub_last_active", now.toString());
        return;
      }

      // Check if more than 2 minutes (120,000 ms) have passed
      const inactiveLimit = 120000; // 2 minutes
      const elapsed = now - Number(lastActive);

      if (elapsed > inactiveLimit) {
        // Logout user
        localStorage.removeItem("datasub_user");
        localStorage.removeItem("datasub_last_active");
        
        // Redirect to login page with expiration query
        router.push("/login?expired=true");
      } else {
        // Update active timestamp
        localStorage.setItem("datasub_last_active", now.toString());
      }
    };

    // Run initial check on mount
    checkSession();

    // Reset timer on user activity
    const updateActivity = () => {
      const userStr = localStorage.getItem("datasub_user");
      if (userStr) {
        localStorage.setItem("datasub_last_active", Date.now().toString());
      }
    };

    // Listen to user interactions to reset idle timer
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => {
      window.addEventListener(event, updateActivity);
    });

    // Check when user returns to the website (visibility change or window focus)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkSession();
      }
    };

    const handleWindowFocus = () => {
      checkSession();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleWindowFocus);

    // Periodic check every 5 seconds for background inactivity
    const interval = setInterval(() => {
      checkSession();
    }, 5000);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleWindowFocus);
      clearInterval(interval);
    };
  }, [pathname, router]);

  return null;
}
