/** ZAVERRE — The Atelier Ledger design system: a dark, editorial public catalogue shell. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import RouteSeo from "./components/RouteSeo";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
const FleetBrowse = lazy(() => import("./pages/FleetBrowse"));
const JournalArticle = lazy(() => import("./pages/JournalArticle"));
const NotFound = lazy(() => import("./pages/NotFound"));
const VehicleDetail = lazy(() => import("./pages/VehicleDetail"));
const AdminVehicles = lazy(() => import("./pages/AdminVehicles"));
const AdminContent = lazy(() => import("./pages/AdminContent"));
const AdminBookings = lazy(() => import("./pages/AdminBookings"));
function RouteScrollReset() {
  const [location] = useLocation();
  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => { window.history.scrollRestoration = previous; };
  }, []);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location]);
  return null;
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return <Switch><Route path="/" component={Home} /><Route path="/cars" component={FleetBrowse} /><Route path="/cars/category/:categorySlug" component={FleetBrowse} /><Route path="/cars/:brandSlug" component={FleetBrowse} /><Route path="/fleet/:slug" component={VehicleDetail} /><Route path="/journal/:slug" component={JournalArticle} /><Route path="/admin" component={AdminContent} /><Route path="/admin/content" component={AdminContent} /><Route path="/admin/vehicles" component={AdminVehicles} /><Route path="/admin/bookings" component={AdminBookings} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="dark" switchable><TooltipProvider><RouteScrollReset /><RouteSeo /><Toaster /><Suspense fallback={<span className="sr-only" aria-live="polite">Loading page</span>}><Router /></Suspense></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
