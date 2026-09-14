import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Award, Clock, ArrowRight, Layers, Server, GraduationCap, Play } from 'lucide-react';
import { curriculumApi } from '../api/api';
import { config } from '../config/config';

export const Curriculum: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tracks' | 'roadmap'>('tracks');

  const learningTracks = [
    {
      id: 'cur-01',
      title: 'Full-Stack Bridge: Python Flask to Modern React Architecture',
      modules: 8,
      duration: '6 Weeks',
      level: 'Industry Bridge / Intermediate',
      category: 'Computer Science Engineering',
      tags: ['Flask', 'REST API', 'React', 'PostgreSQL', 'JWT'],
      progress: 65,
    },
    {
      id: 'cur-02',
      title: 'Power Systems & Microgrid Network Modernization',
      modules: 6,
      duration: '5 Weeks',
      level: 'Advanced Core',
      category: 'Electrical Engineering',
      tags: ['Power Distribution', 'SCADA', 'Grid Protection', 'MATLAB'],
      progress: 25,
    },
    {
      id: 'cur-03',
      title: 'Digital Manufacturing & Robotics with ROS2',
      modules: 7,
      duration: '6 Weeks',
      level: 'Advanced Technical',
      category: 'Mechanical Engineering',
      tags: ['SolidWorks', 'ROS2', 'Robotics', 'Kinematics'],
      progress: 0,
    },
    {
      id: 'cur-04',
      title: 'EV Powertrain & Battery Management Systems (BMS)',
      modules: 6,
      duration: '4 Weeks',
      level: 'High Velocity Specialization',
      category: 'Automobile & Electrical',
      tags: ['CAN Bus', 'BMS Algorithms', 'Lithium Cells', 'Thermal Simulation'],
      progress: 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-blue-50 bg-gradient-to-r from-blue-50/60 via-white to-sky-50/50 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0052cc] text-white shadow-md shadow-blue-500/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-[#0A2540]">
                Engineering Curriculum & Skill Bridge Programs
              </h1>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-[#0052cc]">
                1000+ Training Modules
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Curated pedagogical pathways engineered in partnership with top industries to eliminate competency deficits.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('tracks')}
          className={`pb-3.5 px-5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'tracks'
              ? 'border-[#0052cc] text-[#0052cc]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Curriculum Catalog
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('roadmap')}
          className={`pb-3.5 px-5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'roadmap'
              ? 'border-[#0052cc] text-[#0052cc]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Personalized Roadmap
        </button>
      </div>

      {/* Tracks List */}
      <div className="space-y-4">
        {learningTracks.map((track) => (
          <div
            key={track.id}
            className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-[#0052cc]/50 hover:shadow-md transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0052cc] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                    {track.category}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500">{track.level}</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#0A2540]">{track.title}</h2>
                <div className="mt-1.5 flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {track.duration}
                  </span>
                  <span>{track.modules} Intensive Learning Modules</span>
                </div>
              </div>

              <div className="sm:text-right">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0052cc] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>{track.progress > 0 ? 'Continue Program' : 'Enroll in Program'}</span>
                </button>
              </div>
            </div>

            {track.progress > 0 && (
              <div className="mt-4 pt-3.5 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-600 font-semibold">Course Progress</span>
                  <span className="text-[#0052cc] font-extrabold">{track.progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#0052cc]"
                    style={{ width: `${track.progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {track.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Backend endpoint reference */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-xs text-slate-600">
        <h3 className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
          <Server className="h-4 w-4 text-[#0052cc]" />
          Connected Flask REST API Endpoints:
        </h3>
        <ul className="space-y-1 font-mono text-[11px] text-slate-600 mt-2">
          <li>• GET {config.apiBaseUrl}/curriculum</li>
          <li>• GET {config.apiBaseUrl}/curriculum/:id</li>
          <li>• GET {config.apiBaseUrl}/curriculum/recommendations</li>
        </ul>
      </div>
    </div>
  );
};

export default Curriculum;
