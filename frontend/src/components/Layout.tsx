"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { removeToken } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import { LayoutDashboard, Users, LogOut, Loader2 } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface UserProfile {
  name: string | null;
  email: string;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customers", label: "Customers", icon: Users },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiRequest("/auth/profile");
        setProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  const getInitial = () => {
    if (profile?.name) {
      return profile.name.charAt(0).toUpperCase();
    }
    if (profile?.email) {
      return profile.email.charAt(0).toUpperCase();
    }
    return "A";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-sm ring-1 ring-gray-200">
        <div className="flex h-16 items-center justify-center border-b border-gray-100">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent">
            CMS Pro
          </h1>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className={`h-5 w-5 transition-colors ${isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}`} />
                {item.label}
              </a>
            );
          })}
        </nav>
        <div className="border-t border-gray-100 p-4">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/90 px-8 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            {navItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.label || 
             pathname === "/profile" ? "Profile" : "Dashboard"}
          </h2>
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="flex h-9 w-9 items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              </div>
            ) : (
              <a href="/profile" className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer">
                {getInitial()}
              </a>
            )}
          </div>
        </header>

        {/* Page content */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
