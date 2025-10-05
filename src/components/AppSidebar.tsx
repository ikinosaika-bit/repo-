import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, ShoppingCart, MapPin, Calculator, FileText, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "Главная",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Клиенты",
    url: "/clients",
    icon: Users,
  },
  {
    title: "Заказы",
    url: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Трекинг",
    url: "/tracking",
    icon: MapPin,
  },
  {
    title: "Калькулятор",
    url: "/calculator",
    icon: Calculator,
  },
  {
    title: "Документы",
    url: "/documents",
    icon: FileText,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path || (path === "/dashboard" && currentPath === "/");

  return (
    <Sidebar className="transition-all duration-300">
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">Карго РФ</h1>
                <p className="text-xs text-sidebar-foreground/60">Доставка из Китая</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs uppercase tracking-wide px-6 py-2">
            Основные разделы
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="mx-3 mb-1">
                    <NavLink
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200",
                        "hover:bg-sidebar-accent",
                        isActive(item.url)
                          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-medium"
                          : "text-sidebar-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium">{item.title}</span>
                          {item.badge && (
                            <span className="bg-sidebar-primary text-sidebar-primary-foreground text-xs px-2 py-1 rounded-full font-semibold">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <div className="mt-auto p-3 border-t border-sidebar-border">
          <SidebarMenuButton asChild>
            <NavLink
              to="/settings"
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200",
                "hover:bg-sidebar-accent text-sidebar-foreground"
              )}
            >
              <Settings className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">Настройки</span>}
            </NavLink>
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}