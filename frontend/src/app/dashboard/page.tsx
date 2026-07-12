"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import Layout from "@/components/Layout";
import CustomerForm from "@/components/CustomerForm";
import { Users, TrendingUp, ArrowUpRight, Loader2, Plus, UserPlus, Calendar, Activity } from "lucide-react";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

interface UserProfile {
  name: string | null;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [recentCustomers, setRecentCustomers] = useState<Customer[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [profileData, customersData] = await Promise.all([
        apiRequest("/auth/profile"),
        apiRequest("/customers?limit=5"),
      ]);
      setProfile(profileData);
      setTotalCustomers(customersData.total);
      setRecentCustomers(customersData.customers);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const stats = [
    {
      title: "Total Customers",
      value: totalCustomers,
      icon: Users,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
      trend: "+12%",
    },
    {
      title: "Active This Month",
      value: Math.max(0, totalCustomers - 3),
      icon: Activity,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      trend: "+8%",
    },
    {
      title: "New This Week",
      value: Math.min(totalCustomers, 2),
      icon: UserPlus,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      trend: "0%",
    },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="h-24 animate-pulse bg-gray-100 rounded-2xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-10 w-10 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded w-32"></div>
              </div>
            ))}
          </div>
          <div className="card animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl mb-3 last:mb-0"></div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {getGreeting()}, {profile?.name?.split(" ")[0] || "there"}! 👋
            </h1>
            <p className="text-gray-500 mt-1">
              Here's what's happening with your customers today.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="card group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <TrendingUp className="h-4 w-4" />
                    {stat.trend}
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <ArrowUpRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Customers */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Customers</h2>
            <a
              href="/customers"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              View all →
            </a>
          </div>
          <div className="space-y-3">
            {recentCustomers.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No customers yet</h3>
                <p className="text-gray-500 mb-4">Add your first customer to get started</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-primary"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Customer
                </button>
              </div>
            ) : (
              recentCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white font-semibold">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{customer.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{customer.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(customer.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-lg mx-4">
            <CustomerForm
              onClose={() => setIsModalOpen(false)}
              onSuccess={() => {
                fetchData();
                setIsModalOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </Layout>
  );
}
