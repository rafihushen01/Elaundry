import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const DEFAULT_META = {
  title: "E-Laundry | Smart Laundry Service",
  description:
    "E-Laundry offers fast pickup, professional cleaning, and reliable delivery with real-time order tracking.",
};

const ROUTE_META = [
  {
    test: (pathname) => pathname === "/signin",
    title: "Sign In | E-Laundry",
    description: "Securely sign in to your E-Laundry account and manage your laundry orders instantly.",
  },
  {
    test: (pathname) => pathname === "/signup",
    title: "Create Account | E-Laundry",
    description: "Join E-Laundry to schedule laundry pickup, choose services, and track each order.",
  },
  {
    test: (pathname) => pathname === "/forgetpass",
    title: "Reset Password | E-Laundry",
    description: "Recover your E-Laundry account quickly using OTP verification and password reset.",
  },
  {
    test: (pathname) => pathname === "/" || pathname.startsWith("/superadmin"),
    title: "Dashboard | E-Laundry",
    description: "Control orders, deliveries, and laundry operations from your E-Laundry dashboard.",
  },
  {
    test: (pathname) => pathname.startsWith("/cart"),
    title: "Cart | E-Laundry",
    description: "Review selected laundry services and confirm your order details.",
  },
  {
    test: (pathname) => pathname.startsWith("/checkout"),
    title: "Checkout | E-Laundry",
    description: "Complete payment securely and place your laundry order with confidence.",
  },
  {
    test: (pathname) => pathname.startsWith("/myorders") || pathname.startsWith("/order"),
    title: "Orders | E-Laundry",
    description: "Track active and completed E-Laundry orders in one place.",
  },
];

const ensureTag = (selector, tagName = "meta") => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement(tagName);
    if (selector.includes('[name="')) {
      const match = selector.match(/name="([^"]+)"/);
      if (match?.[1]) element.setAttribute("name", match[1]);
    }
    if (selector.includes('[property="')) {
      const match = selector.match(/property="([^"]+)"/);
      if (match?.[1]) element.setAttribute("property", match[1]);
    }
    if (selector.includes('[rel="')) {
      const match = selector.match(/rel="([^"]+)"/);
      if (match?.[1]) element.setAttribute("rel", match[1]);
    }
    document.head.appendChild(element);
  }
  return element;
};

const SiteMetadata = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const normalizedPath = pathname.toLowerCase();
    const meta = ROUTE_META.find((entry) => entry.test(normalizedPath)) || DEFAULT_META;

    document.title = meta.title;

    ensureTag('meta[name="description"]').setAttribute("content", meta.description);
    ensureTag('meta[name="keywords"]').setAttribute(
      "content",
      "laundry, dry cleaning, pickup and delivery, laundry app, e-laundry"
    );
    ensureTag('meta[name="theme-color"]').setAttribute("content", "#10b981");

    ensureTag('meta[property="og:title"]').setAttribute("content", meta.title);
    ensureTag('meta[property="og:description"]').setAttribute("content", meta.description);
    ensureTag('meta[property="og:type"]').setAttribute("content", "website");
    ensureTag('meta[property="og:image"]').setAttribute("content", "/Elaundry.png");
    ensureTag('meta[property="og:url"]').setAttribute("content", window.location.href);

    ensureTag('meta[name="twitter:card"]').setAttribute("content", "summary_large_image");
    ensureTag('meta[name="twitter:title"]').setAttribute("content", meta.title);
    ensureTag('meta[name="twitter:description"]').setAttribute("content", meta.description);
    ensureTag('meta[name="twitter:image"]').setAttribute("content", "/Elaundry.png");

    ensureTag('link[rel="icon"]', "link").setAttribute("href", "/Elaundry.png");
  }, [pathname]);

  return null;
};

export default SiteMetadata;
