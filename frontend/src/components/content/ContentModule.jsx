import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import OverviewCard from "../security/OverviewCards";
import ContentTab from "./ContentTab";

const ContentModule = () => {
  const [contents, setContents] = useState([]);

  const fetchContentsData = async () => {
    try {
      const res = await api.get("/contents");

      if (Array.isArray(res.data)) {
        setContents(res.data);
      } else {
        setContents([]);
        console.error("API doesn't return array:", res.data);
      }
    } catch (err) {
      console.error("API ERROR:", err);
      setContents([]);
    }
  };

  useEffect(() => {
    fetchContentsData();
  }, []);

  const stats = [
    { title: "Total Content", value: contents.length.toString() },
    {
      title: "Draft Content",
      value: contents.filter((c) => c.statusi === "draft").length.toString(),
    },
    {
      title: "Published Content",
      value: contents
        .filter((c) => c.statusi === "published")
        .length.toString(),
    },
    {
      title: "Media Items",
      value: contents.filter((c) => c.media_url).length.toString(),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <OverviewCard key={i} title={stat.title} value={stat.value} />
        ))}
      </div>

      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 min-h-[400px]">
        <ContentTab contents={contents} refreshContents={fetchContentsData} />
      </div>
    </div>
  );
};

export default ContentModule;