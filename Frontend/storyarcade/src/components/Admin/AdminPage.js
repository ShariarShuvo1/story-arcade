import React from "react";
import { BarChart, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import StoriesList from "./StoriesList";
import AnalyticsTab from "./AnalyticsTab";

const tabs = [
  { id: "stories", label: "Stories", icon: BookOpen },
  { id: "analytics", label: "Analytics", icon: BarChart },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("create");
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-emerald-400 text-center">
          Admin Dashboard
        </h1>
        <div className="flex justify-center mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <tab.icon className="mr-2 h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === "stories" && <StoriesList />}
        {activeTab === "analytics" && <AnalyticsTab />}
      </div>
    </div>
  );
};

export default AdminPage;
