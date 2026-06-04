import React, { useEffect, useState, useContext } from "react";
import api from "../../api/axios";
import GenderTab from "./GenderTab";
import { AuthContext } from "../../context/AuthContext";
import OverviewCard from "../security/OverviewCards";

const GenderModule = () => {
  const stats = [
    {
      title: "Total Genders",
      value: "3"
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <OverviewCard
            key={i}
            title={stat.title}
            value={stat.value}
          />
        ))}
      </div>

      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 min-h-[400px]">
        <GenderTab />
      </div>
    </div>
  );
};

export default GenderModule;