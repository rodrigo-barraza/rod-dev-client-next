"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "@rodrigo-barraza/components-library";
import { AlertProvider, useAlertContext } from "@/contexts/AlertContext";
import LayoutComponent from "@/components/LayoutComponent";
import EventLibrary from "@/libraries/EventLibrary";
import RenderApiLibrary from "@/libraries/RenderApiLibrary";
import { useApplicationState } from "@/stores/ZustandStore";

function AlertMessageHelper() {
  const { message } = useAlertContext();
  return <>{message}</>;
}

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [getRenderStatus, setRenderStatus] = useState(false);
  const { setIsRenderApiAvailable } = useApplicationState();

  async function getStatus() {
    try {
      const getStatus = await RenderApiLibrary.getStatus();
      if (getStatus.data) {
        setRenderStatus(true);
        setIsRenderApiAvailable(true);
      } else {
        setRenderStatus(false);
        setIsRenderApiAvailable(false);
      }
    } catch (error) {
      setRenderStatus(false);
      setIsRenderApiAvailable(false);
    }
  }

  useEffect(() => {
    // Initialize session tracking
    const { isNew } = EventLibrary.init();

    // Record session type (new vs returning)
    if (isNew) {
      EventLibrary.postEventSessionNew(document.referrer, window.location.href);
    } else {
      EventLibrary.postEventSessionReturning(
        document.referrer,
        window.location.href,
      );
    }

    // Record initial page view
    EventLibrary.postPageView(
      window.location.href,
      document.title,
      document.referrer || null,
    );

    getStatus();

    // Track navigation and link clicks
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLAnchorElement;
      if (target && target.nodeName === "A") {
        if (
          target.href.includes("//development.rod.dev") ||
          target.href.includes("//rod.dev") ||
          target.href.includes("//localhost")
        ) {
          EventLibrary.postEventNavigationClick(target.href);
        } else {
          EventLibrary.postEventLinkClick(target.href);
        }
      }
    };

    document.addEventListener("click", handleDocumentClick, false);

    // Session heartbeat — every 5 seconds
    const heartbeatInterval = setInterval(() => {
      EventLibrary.postSession(5000, window.screen.width, window.screen.height);
    }, 5000);

    return () => {
      clearInterval(heartbeatInterval);
      document.removeEventListener("click", handleDocumentClick, false);
    };
  }, []);

  return (
    <ThemeProvider>
      <LayoutComponent>
        <AlertProvider>
          <AlertMessageHelper />
          {children}
        </AlertProvider>
      </LayoutComponent>
    </ThemeProvider>
  );
}
