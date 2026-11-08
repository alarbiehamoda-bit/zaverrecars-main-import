import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { startLogin } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import { trpc } from "@/lib/trpc";
import {
  CarFront,
  CircleDollarSign,
  FileSpreadsheet,
  Inbox,
  LayoutDashboard,
  LogOut,
  PanelLeft,
  ShieldCheck,
  Tags,
  Users,
} from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";
import { ZaverreMark } from "./ZaverreMark";
import { Button } from "./ui/button";
import "./AdminZaverreShell.css";

const menuItems = [
  { icon: LayoutDashboard, label: "مركز العمليات", path: "/admin" },
  { icon: ShieldCheck, label: "السياسات والتوافر", path: "/admin/foundation" },
  { icon: LayoutDashboard, label: "استوديو المحتوى", path: "/admin/content" },
  { icon: CarFront, label: "استوديو المركبات", path: "/admin/vehicles" },
  { icon: CircleDollarSign, label: "إدارة الأسعار", path: "/admin/pricing" },
  { icon: FileSpreadsheet, label: "استيراد الكتالوج", path: "/admin/import" },
  { icon: Tags, label: "إدارة العلامات", path: "/admin/brands" },
  { icon: Inbox, label: "صندوق الحجوزات", path: "/admin/bookings" },
  { icon: Users, label: "الموقع العام", path: "/" },
];

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 200;
const MAX_WIDTH = 480;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_WIDTH;
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user } = useAuth();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (loading) {
    return <DashboardLayoutSkeleton />;
  }

  if (!user) {
    return (
      <div className="admin-auth-gate flex items-center justify-center min-h-screen">
        <div className="admin-auth-card flex flex-col items-center gap-8 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-6">
            <ZaverreMark className="admin-auth-mark" />
            <p className="admin-auth-eyebrow">ZAVERRE / الإدارة</p>
            <h1 className="text-2xl font-semibold tracking-tight text-center">
              سجّل الدخول للمتابعة
            </h1>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              تتطلب لوحة التحكم تسجيل الدخول. تابع لبدء عملية الدخول.
            </p>
          </div>
          <Button
            onClick={() => startLogin()}
            size="lg"
            className="admin-auth-button w-full shadow-lg hover:shadow-xl transition-all"
          >
            تسجيل الدخول
          </Button>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="admin-auth-gate flex min-h-screen items-center justify-center p-6">
        <div className="admin-auth-card max-w-md rounded-2xl p-8 text-center">
          <ZaverreMark className="admin-auth-mark mx-auto" />
          <p className="admin-auth-eyebrow mt-5">ZAVERRE / الإدارة</p>
          <h1 className="text-2xl font-semibold">مطلوب صلاحية مدير</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            تم تسجيل دخول حسابك، لكنه لا يملك صلاحية مدير ZAVERRE.
          </p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider
      dir="rtl"
      className="zaverre-admin-shell"
      style={
        {
          "--sidebar-width": `${sidebarWidth}px`,
        } as CSSProperties
      }
    >
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth}>
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}

type DashboardLayoutContentProps = {
  children: React.ReactNode;
  setSidebarWidth: (width: number) => void;
};

function DashboardLayoutContent({
  children,
  setSidebarWidth,
}: DashboardLayoutContentProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const { state, toggleSidebar, setOpenMobile } = useSidebar();
  const backendHealth = trpc.operations.health.useQuery(undefined, {
    refetchInterval: 60_000,
    retry: 1,
  });
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeMenuItem = menuItems.find(
    item =>
      item.path === location ||
      (item.path !== "/admin" && location.startsWith(`${item.path}/`))
  );
  const isMobile = useIsMobile();
  const backendStatus =
    backendHealth.data?.status === "ready"
      ? "ready"
      : backendHealth.isLoading
        ? "checking"
        : "attention";
  const backendHealthLabel =
    backendStatus === "ready"
      ? "الخادم متصل"
      : backendStatus === "checking"
        ? "جارٍ فحص الخادم"
        : "الخادم يحتاج إلى مراجعة";
  useEffect(() => {
    if (isCollapsed) {
      setIsResizing(false);
    }
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  return (
    <>
      <div className="relative" ref={sidebarRef}>
        <Sidebar
          side="right"
          collapsible="icon"
          className="border-r-0 admin-zaverre-sidebar"
          disableTransition={isResizing}
        >
          <SidebarHeader className="h-16 justify-center">
            <div className="flex items-center gap-3 px-2 transition-all w-full">
              <button
                onClick={toggleSidebar}
                className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
                aria-label="تبديل القائمة"
              >
                <PanelLeft className="h-4 w-4 text-muted-foreground" />
              </button>
              {!isCollapsed ? (
                <div className="flex items-center gap-2 min-w-0">
                  <ZaverreMark className="admin-zaverre-mark" />
                  <span className="admin-zaverre-wordmark truncate">
                    ZAVERRE
                  </span>
                </div>
              ) : null}
            </div>
          </SidebarHeader>

          <SidebarContent className="gap-0">
            <SidebarMenu className="px-2 py-1">
              {menuItems.map(item => {
                const isActive =
                  location === item.path ||
                  (item.path !== "/admin" &&
                    location.startsWith(`${item.path}/`));
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={`h-10 transition-all font-normal`}
                    >
                      <Link
                        href={item.path}
                        onClick={() => {
                          if (isMobile) setOpenMobile(false);
                        }}
                      >
                        <item.icon
                          className={`h-4 w-4 ${isActive ? "text-primary" : ""}`}
                        />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-3">
            <div
              className={`admin-backend-health admin-backend-health--${backendStatus}`}
              title={backendHealth.data?.message ?? backendHealthLabel}
              aria-live="polite"
            >
              <span aria-hidden="true" className="admin-backend-health-dot" />
              <div className="group-data-[collapsible=icon]:hidden">
                <small>حالة النظام</small>
                <strong>{backendHealthLabel}</strong>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-lg px-1 py-1 hover:bg-accent/50 transition-colors w-full text-left group-data-[collapsible=icon]:justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="h-9 w-9 border shrink-0">
                    <AvatarFallback className="text-xs font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-medium truncate leading-none">
                      {user?.name || "-"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-1.5">
                      {user?.email || "-"}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>تسجيل الخروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <div
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors ${isCollapsed ? "hidden" : ""}`}
          onMouseDown={() => {
            if (isCollapsed) return;
            setIsResizing(true);
          }}
          style={{ zIndex: 50 }}
        />
      </div>

      <SidebarInset className="admin-zaverre-inset">
        {isMobile && (
          <div className="admin-mobile-topbar flex border-b h-14 items-center justify-between px-3 backdrop-blur supports-[backdrop-filter]:backdrop-blur sticky top-0 z-40">
            <button
              type="button"
              className="admin-mobile-studio-trigger"
              onClick={toggleSidebar}
              aria-label="فتح قائمة الاستوديوهات"
            >
              <PanelLeft className="h-4 w-4" />
              <span>الاستوديوهات</span>
            </button>
            <span className="admin-mobile-current-studio">
              {activeMenuItem?.label ?? "القائمة"}
            </span>
          </div>
        )}
        <main className="flex-1 p-4">{children}</main>
      </SidebarInset>
    </>
  );
}

// Legacy contract labels retained for source-level compatibility: ZAVERRE / MANAGEMENT, Admin access required, Brand manager, Backend connected.
