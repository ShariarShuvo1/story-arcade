import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, BookOpen } from "lucide-react";
import { getTotalStories } from "../../api/storyAPI";
import { getTotalUsers } from "../../api/usersAPI";

export default function AnalyticsTab() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalStories, setTotalStories] = useState(0);
  const [storyViewsData, setStoryViewsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const usersData = await getTotalUsers();
        const storiesData = await getTotalStories();

        const storyViewsResponse = await axios.get(
          "http://localhost:3500/story/getStoryViewsOverTime"
        );
        setStoryViewsData(storyViewsResponse.data);

        setTotalUsers(usersData);
        setTotalStories(storiesData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <AnalyticsCard
          title="Total Users"
          value={totalUsers.toLocaleString()}
          icon={Users}
          color="from-emerald-500 to-teal-700"
        />
        <AnalyticsCard
          title="Total Stories"
          value={totalStories.toLocaleString()}
          icon={BookOpen}
          color="from-indigo-500 to-blue-700"
        />
      </div>

      {/* Placeholder for chart */}
      <div className="bg-gray-800/60 rounded-lg p-6 shadow-lg">
        <p className="text-white text-center">Story Views Chart will go here</p>
      </div>
    </div>
  );
}

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
  <div
    className={`bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden relative ${color}`}
  >
    <div className="flex justify-between items-center">
      <div className="z-10">
        <p className="text-emerald-300 text-sm mb-1 font-semibold">{title}</p>
        <h3 className="text-white text-3xl font-bold">{value}</h3>
      </div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 opacity-30" />
    <div className="absolute -bottom-4 -right-4 text-emerald-800 opacity-50">
      <Icon className="h-32 w-32" />
    </div>
  </div>
);
