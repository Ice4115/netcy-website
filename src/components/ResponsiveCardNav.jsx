"use client";

import { useEffect, useState } from "react";
import CardNav from "./CardNav";
import CardNavMobile from "./CardNavMobile";

const ResponsiveCardNav = (props) => {
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 1025);
    };

    check();
    const mediaQuery = window.matchMedia("(max-width: 1024px)");
    const handleChange = (e) => setIsMobile(e.matches);
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  if (isMobile === null) {
    return <CardNav {...props} />;
  }

  return isMobile ? (
    <CardNavMobile {...props} />
  ) : (
    <CardNav {...props} />
  );
};

export default ResponsiveCardNav;
