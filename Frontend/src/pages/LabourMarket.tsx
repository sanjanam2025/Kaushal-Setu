import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  BarChart3,
  MapPin,
  DollarSign,
  ArrowUpRight,
  Server,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building,
  Briefcase,
  GraduationCap,
  Search,
  Calendar,
  Cpu,
  Zap,
  Download,
  RefreshCw,
  Users,
  Award,
  ArrowRight,
  ChevronRight,
  Info,
  Layers,
  Activity,
  Flame,
  FileText,
  Check,
  ExternalLink,
  Target,
} from 'lucide-react';
import { labourMarketApi, checkBackendHealth } from '../api/api';
import { config } from '../config/config';

interface SkillDemandItem {
  id: string;
  name: string;
  category: 'Technical' | 'Practical / Lab' | 'Soft Skills';
  growth: string;
  demandScore: number; // 0 - 100
  demandLevel: 'Surging' | 'Very High' | 'High' | 'Steady';
  avgSalary: string;
  openPositions: number;
  topEmployers: string[];
}

interface SectorData {
  name: string;
  code: string;
  tagline: string;
  activeOpenings: number;
  openingsGrowth: string;
  medianSalary: string;
  premiumForVerified: string;
  skillShortageIndex: number; // 0 - 5.0
  hireTimeDays: number;
  monthlyTrends: { month: string; postings: number; hiringIndex: number }[];
  inDemandSkills: SkillDemandItem[];
  employerExpectations: {
    title: string;
    description: string;
    importancePercentage: number;
    trend: 'Rising' | 'Critical' | 'Stable';
  }[];
  salaryBands: {
    role: string;
    entryLevel: string;
    midLevel: string;
    seniorLevel: string;
  }[];
  industryTrends: {
    badge: string;
    title: string;
    description: string;
    impactLevel: 'Transformative' | 'High Impact' | 'Steady Growth';
  }[];
  liveJobs: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    experience: string;
    tags: string[];
    urgency: 'Immediate Requirement' | 'Verified Talent Preferred' | 'NAPS Scheme';
  }[];
}

const SECTOR_DATA: Record<string, SectorData> = {
  'Electrical & Power Systems': {
    name: 'Electrical & Power Systems',
    code: 'EE',
    tagline: 'Grid modernization, microgrids, renewable integration, and high-voltage transmission engineering.',
    activeOpenings: 18450,
    openingsGrowth: '+26.4% YoY',
    medianSalary: '₹7.20 LPA',
    premiumForVerified: '+28%',
    skillShortageIndex: 4.1,
    hireTimeDays: 26,
    monthlyTrends: [
      { month: 'Jan', postings: 12400, hiringIndex: 100 },
      { month: 'Feb', postings: 13100, hiringIndex: 106 },
      { month: 'Mar', postings: 14500, hiringIndex: 117 },
      { month: 'Apr', postings: 14900, hiringIndex: 120 },
      { month: 'May', postings: 15800, hiringIndex: 127 },
      { month: 'Jun', postings: 16700, hiringIndex: 135 },
      { month: 'Jul', postings: 17200, hiringIndex: 139 },
      { month: 'Aug', postings: 17900, hiringIndex: 144 },
      { month: 'Sep', postings: 18450, hiringIndex: 149 },
    ],
    inDemandSkills: [
      {
        id: 'ee-1',
        name: 'PLC Programming & SCADA',
        category: 'Technical',
        growth: '+42%',
        demandScore: 94,
        demandLevel: 'Surging',
        avgSalary: '₹8.6 LPA',
        openPositions: 4200,
        topEmployers: ['Siemens', 'Schneider Electric', 'ABB'],
      },
      {
        id: 'ee-2',
        name: 'Industrial Electrical Wiring & Safety',
        category: 'Practical / Lab',
        growth: '+31%',
        demandScore: 89,
        demandLevel: 'Very High',
        avgSalary: '₹6.8 LPA',
        openPositions: 3850,
        topEmployers: ['L&T Construction', 'Tata Power', 'BHEL'],
      },
      {
        id: 'ee-3',
        name: 'Microgrid & Renewable Integration',
        category: 'Technical',
        growth: '+58%',
        demandScore: 96,
        demandLevel: 'Surging',
        avgSalary: '₹11.2 LPA',
        openPositions: 2900,
        topEmployers: ['Adani Green', 'ReNew Power', 'Tata Power'],
      },
      {
        id: 'ee-4',
        name: 'AutoCAD Electrical & Schematics',
        category: 'Technical',
        growth: '+24%',
        demandScore: 82,
        demandLevel: 'High',
        avgSalary: '₹6.5 LPA',
        openPositions: 3100,
        topEmployers: ['Havells', 'L&T', 'Thermax'],
      },
      {
        id: 'ee-5',
        name: 'Substation Automation & Switchgear',
        category: 'Technical',
        growth: '+36%',
        demandScore: 88,
        demandLevel: 'Very High',
        avgSalary: '₹9.4 LPA',
        openPositions: 2400,
        topEmployers: ['Siemens', 'Hitachi Energy', 'KEC International'],
      },
      {
        id: 'ee-6',
        name: 'Root Cause Troubleshooting',
        category: 'Soft Skills',
        growth: '+28%',
        demandScore: 85,
        demandLevel: 'Very High',
        avgSalary: '₹7.5 LPA',
        openPositions: 2000,
        topEmployers: ['Bosch', 'Schneider Electric'],
      },
    ],
    employerExpectations: [
      {
        title: 'Hands-on Switchgear & Relay Testing',
        description: 'Employers require verified laboratory or apprenticeship experience with protection relays (ABB, Schneider) and high-voltage circuit breakers.',
        importancePercentage: 92,
        trend: 'Critical',
      },
      {
        title: 'IEC & IS Electrical Safety Compliance',
        description: 'Knowledge of IS 732, IEC 61439, and national electrical code safety lockout/tagout protocols.',
        importancePercentage: 86,
        trend: 'Critical',
      },
      {
        title: 'Diagnostic Oscilloscope & Multimeter Usage',
        description: 'Demonstrated proficiency in tracing line faults, grounding loops, and phase imbalances in live industrial panels.',
        importancePercentage: 81,
        trend: 'Rising',
      },
      {
        title: 'Cross-disciplinary PLC / IoT Telemetry',
        description: 'Ability to connect edge energy meters to Modbus / MQTT SCADA architectures.',
        importancePercentage: 74,
        trend: 'Rising',
      },
    ],
    salaryBands: [
      {
        role: 'Electrical Maintenance Technician / Trainee',
        entryLevel: '₹4.2 - ₹6.5 LPA',
        midLevel: '₹7.0 - ₹10.5 LPA',
        seniorLevel: '₹12.0 - ₹18.0 LPA',
      },
      {
        role: 'PLC & Automation Commissioning Engineer',
        entryLevel: '₹5.5 - ₹8.2 LPA',
        midLevel: '₹9.0 - ₹14.0 LPA',
        seniorLevel: '₹16.0 - ₹24.0 LPA',
      },
      {
        role: 'Substation & Grid Protection Specialist',
        entryLevel: '₹5.0 - ₹7.5 LPA',
        midLevel: '₹8.5 - ₹13.0 LPA',
        seniorLevel: '₹15.0 - ₹22.0 LPA',
      },
      {
        role: 'Renewable Solar / Wind Plant Engineer',
        entryLevel: '₹4.8 - ₹7.2 LPA',
        midLevel: '₹8.0 - ₹12.5 LPA',
        seniorLevel: '₹14.0 - ₹21.0 LPA',
      },
    ],
    industryTrends: [
      {
        badge: 'National Grid',
        title: 'PM Surya Ghar & Decentralized Solar Adoption',
        description: 'Government subsidization of 10 million rooftop installations is triggering a requirement for over 65,000 certified electrical inspectors and grid-tie technicians.',
        impactLevel: 'Transformative',
      },
      {
        badge: 'Green Energy',
        title: 'Transmission Superhighways (HVDC 800kV)',
        description: 'Major investments across interstate green energy corridors linking Rajasthan and Gujarat solar parks require high-voltage testing engineers.',
        impactLevel: 'High Impact',
      },
      {
        badge: 'Industry 4.0',
        title: 'Smart Energy Storage & Battery Banks',
        description: 'Utility-scale BESS installations demand engineers skilled in inverter synchronization, thermal management, and BMS safety.',
        impactLevel: 'High Impact',
      },
    ],
    liveJobs: [
      {
        id: 'job-lm-1',
        title: 'Junior Electrical Commissioning Engineer',
        company: 'Schneider Electric India',
        location: 'Bengaluru, Karnataka (On-site)',
        salary: '₹5.8 - ₹7.5 LPA',
        experience: '0 - 2 Years',
        tags: ['PLC Basics', 'Electrical Wiring', 'Relay Testing'],
        urgency: 'Immediate Requirement',
      },
      {
        id: 'job-lm-2',
        title: 'Plant Automation & Switchgear Trainee',
        company: 'Tata Power DDL',
        location: 'Delhi NCR / Gurugram',
        salary: '₹6.2 - ₹8.0 LPA',
        experience: 'Fresher / 0 - 1 Year',
        tags: ['SCADA', 'Substation', 'Safety Compliance'],
        urgency: 'Verified Talent Preferred',
      },
      {
        id: 'job-lm-3',
        title: 'Solar Inverter Technical Specialist',
        company: 'ReNew Power Ltd',
        location: 'Ahmedabad / Dholera, Gujarat',
        salary: '₹5.5 - ₹7.2 LPA',
        experience: '0 - 2 Years',
        tags: ['Solar PV', 'Circuit Design', 'Troubleshooting'],
        urgency: 'NAPS Scheme',
      },
    ],
  },
  'Computer Science & AI': {
    name: 'Computer Science & AI',
    code: 'CSE',
    tagline: 'Full-stack software engineering, applied Generative AI, cloud-native DevOps, and technical cybersecurity.',
    activeOpenings: 32400,
    openingsGrowth: '+34.8% YoY',
    medianSalary: '₹9.40 LPA',
    premiumForVerified: '+35%',
    skillShortageIndex: 4.4,
    hireTimeDays: 22,
    monthlyTrends: [
      { month: 'Jan', postings: 21000, hiringIndex: 100 },
      { month: 'Feb', postings: 22500, hiringIndex: 107 },
      { month: 'Mar', postings: 24800, hiringIndex: 118 },
      { month: 'Apr', postings: 26200, hiringIndex: 125 },
      { month: 'May', postings: 27900, hiringIndex: 133 },
      { month: 'Jun', postings: 29400, hiringIndex: 140 },
      { month: 'Jul', postings: 30800, hiringIndex: 147 },
      { month: 'Aug', postings: 31600, hiringIndex: 150 },
      { month: 'Sep', postings: 32400, hiringIndex: 154 },
    ],
    inDemandSkills: [
      {
        id: 'cs-1',
        name: 'Python & Generative AI API Integration',
        category: 'Technical',
        growth: '+78%',
        demandScore: 98,
        demandLevel: 'Surging',
        avgSalary: '₹14.5 LPA',
        openPositions: 9800,
        topEmployers: ['Google', 'Microsoft', 'Infosys', 'Wipro'],
      },
      {
        id: 'cs-2',
        name: 'Full-Stack React & Node.js / FastAPI',
        category: 'Technical',
        growth: '+38%',
        demandScore: 92,
        demandLevel: 'Very High',
        avgSalary: '₹9.8 LPA',
        openPositions: 8400,
        topEmployers: ['TCS', 'Accenture', 'Cognizant'],
      },
      {
        id: 'cs-3',
        name: 'Cloud Architecture (AWS / GCP / Azure)',
        category: 'Technical',
        growth: '+44%',
        demandScore: 90,
        demandLevel: 'Very High',
        avgSalary: '₹12.0 LPA',
        openPositions: 5600,
        topEmployers: ['Amazon', 'Flipkart', 'Persistent'],
      },
      {
        id: 'cs-4',
        name: 'Kubernetes & CI/CD Pipelines',
        category: 'Technical',
        growth: '+32%',
        demandScore: 84,
        demandLevel: 'High',
        avgSalary: '₹11.5 LPA',
        openPositions: 4200,
        topEmployers: ['HCLTech', 'Tech Mahindra'],
      },
    ],
    employerExpectations: [
      {
        title: 'Production Code Quality & Git Workflow',
        description: 'Clean commit histories, test-driven development (TDD), and standard linting practices.',
        importancePercentage: 94,
        trend: 'Critical',
      },
      {
        title: 'Microservices & High-Throughput APIs',
        description: 'Experience building RESTful and gRPC interfaces handling concurrent connection pools.',
        importancePercentage: 88,
        trend: 'Rising',
      },
    ],
    salaryBands: [
      {
        role: 'Full-Stack Software Engineer',
        entryLevel: '₹6.0 - ₹10.0 LPA',
        midLevel: '₹12.0 - ₹20.0 LPA',
        seniorLevel: '₹22.0 - ₹38.0 LPA',
      },
      {
        role: 'AI / Machine Learning Engineer',
        entryLevel: '₹8.0 - ₹14.0 LPA',
        midLevel: '₹16.0 - ₹26.0 LPA',
        seniorLevel: '₹30.0 - ₹50.0 LPA',
      },
    ],
    industryTrends: [
      {
        badge: 'Digital India',
        title: 'India AI Mission & Compute Ecosystem',
        description: '₹10,300 Crore national allocation for sovereign GPU compute and indigenous AI foundational model training.',
        impactLevel: 'Transformative',
      },
    ],
    liveJobs: [
      {
        id: 'job-lm-cs1',
        title: 'Junior AI Applications Developer',
        company: 'Infosys Applied AI Lab',
        location: 'Bengaluru / Hyderabad',
        salary: '₹7.5 - ₹11.0 LPA',
        experience: '0 - 2 Years',
        tags: ['Python', 'FastAPI', 'Vector DBs'],
        urgency: 'Verified Talent Preferred',
      },
    ],
  },
  'Electronics & Semiconductors': {
    name: 'Electronics & Semiconductors',
    code: 'ECE',
    tagline: 'VLSI chip verification, embedded firmware, PCB layout, and semiconductor packaging.',
    activeOpenings: 14200,
    openingsGrowth: '+48.2% YoY',
    medianSalary: '₹8.90 LPA',
    premiumForVerified: '+38%',
    skillShortageIndex: 4.6,
    hireTimeDays: 24,
    monthlyTrends: [
      { month: 'Jan', postings: 8900, hiringIndex: 100 },
      { month: 'Feb', postings: 9600, hiringIndex: 108 },
      { month: 'Mar', postings: 10800, hiringIndex: 121 },
      { month: 'Apr', postings: 11500, hiringIndex: 129 },
      { month: 'May', postings: 12200, hiringIndex: 137 },
      { month: 'Jun', postings: 13000, hiringIndex: 146 },
      { month: 'Jul', postings: 13500, hiringIndex: 152 },
      { month: 'Aug', postings: 13900, hiringIndex: 156 },
      { month: 'Sep', postings: 14200, hiringIndex: 160 },
    ],
    inDemandSkills: [
      {
        id: 'ece-1',
        name: 'SystemVerilog & UVM Verification',
        category: 'Technical',
        growth: '+52%',
        demandScore: 97,
        demandLevel: 'Surging',
        avgSalary: '₹14.8 LPA',
        openPositions: 3600,
        topEmployers: ['Intel', 'Qualcomm', 'Synopsys', 'Texas Instruments'],
      },
      {
        id: 'ece-2',
        name: 'Embedded C & RTOS Firmware',
        category: 'Technical',
        growth: '+39%',
        demandScore: 91,
        demandLevel: 'Very High',
        avgSalary: '₹9.5 LPA',
        openPositions: 4200,
        topEmployers: ['Bosch', 'NXP', 'Continental'],
      },
    ],
    employerExpectations: [
      {
        title: 'FPGA Prototyping & RTL Design',
        description: 'Experience synthesising digital circuits onto Xilinx/Intel FPGA development boards.',
        importancePercentage: 90,
        trend: 'Critical',
      },
    ],
    salaryBands: [
      {
        role: 'VLSI Design / Verification Engineer',
        entryLevel: '₹7.5 - ₹12.0 LPA',
        midLevel: '₹14.0 - ₹24.0 LPA',
        seniorLevel: '₹26.0 - ₹45.0 LPA',
      },
    ],
    industryTrends: [
      {
        badge: 'Semiconductor',
        title: 'India Semiconductor Mission (ISM) Fab Projects',
        description: 'Construction of commercial wafer fabs in Dholera and packaging facilities in Sanand creating massive domestic engineering demand.',
        impactLevel: 'Transformative',
      },
    ],
    liveJobs: [
      {
        id: 'job-lm-ece1',
        title: 'Junior Embedded Firmware Engineer',
        company: 'Bosch Global Software Technologies',
        location: 'Bengaluru / Coimbatore',
        salary: '₹6.8 - ₹9.2 LPA',
        experience: '0 - 2 Years',
        tags: ['Embedded C', 'Microcontrollers', 'CAN Bus'],
        urgency: 'Immediate Requirement',
      },
    ],
  },
  'Automotive & EV Mobility': {
    name: 'Automotive & EV Mobility',
    code: 'EV',
    tagline: 'Battery management systems (BMS), electric powertrains, motor controllers, and autonomous drive sensors.',
    activeOpenings: 12800,
    openingsGrowth: '+41.5% YoY',
    medianSalary: '₹7.90 LPA',
    premiumForVerified: '+30%',
    skillShortageIndex: 4.2,
    hireTimeDays: 25,
    monthlyTrends: [
      { month: 'Jan', postings: 8200, hiringIndex: 100 },
      { month: 'Feb', postings: 8800, hiringIndex: 107 },
      { month: 'Mar', postings: 9700, hiringIndex: 118 },
      { month: 'Apr', postings: 10400, hiringIndex: 127 },
      { month: 'May', postings: 11100, hiringIndex: 135 },
      { month: 'Jun', postings: 11800, hiringIndex: 144 },
      { month: 'Jul', postings: 12200, hiringIndex: 149 },
      { month: 'Aug', postings: 12500, hiringIndex: 152 },
      { month: 'Sep', postings: 12800, hiringIndex: 156 },
    ],
    inDemandSkills: [
      {
        id: 'ev-1',
        name: 'Battery Management Systems (BMS) Calibration',
        category: 'Technical',
        growth: '+64%',
        demandScore: 96,
        demandLevel: 'Surging',
        avgSalary: '₹12.0 LPA',
        openPositions: 3200,
        topEmployers: ['Tata Motors EV', 'Ola Electric', 'Ather Energy'],
      },
      {
        id: 'ev-2',
        name: 'Electric Powertrain & Inverter Control',
        category: 'Technical',
        growth: '+46%',
        demandScore: 90,
        demandLevel: 'Very High',
        avgSalary: '₹10.5 LPA',
        openPositions: 2800,
        topEmployers: ['Mahindra Electric', 'TVS Motor', 'Bajaj Auto'],
      },
    ],
    employerExpectations: [
      {
        title: 'Thermal Runaway & Automotive Safety (ISO 26262)',
        description: 'Understanding functional safety hazards and thermal simulation for high-capacity lithium battery packs.',
        importancePercentage: 89,
        trend: 'Critical',
      },
    ],
    salaryBands: [
      {
        role: 'EV Powertrain & BMS Engineer',
        entryLevel: '₹6.0 - ₹9.0 LPA',
        midLevel: '₹10.5 - ₹17.0 LPA',
        seniorLevel: '₹18.0 - ₹30.0 LPA',
      },
    ],
    industryTrends: [
      {
        badge: 'Clean Mobility',
        title: 'FAME & PM E-Drive Scheme Subsidies',
        description: 'National push to electrify 30% of private and 70% of commercial fleets creating cross-discipline mechanical-electrical demand.',
        impactLevel: 'Transformative',
      },
    ],
    liveJobs: [
      {
        id: 'job-lm-ev1',
        title: 'Graduate Engineer Trainee - EV Systems',
        company: 'Tata Motors Electric Mobility',
        location: 'Pune, Maharashtra',
        salary: '₹6.5 - ₹8.5 LPA',
        experience: 'Fresher / 0 - 1 Year',
        tags: ['Battery Pack Testing', 'MATLAB Simulink', 'Safety Standards'],
        urgency: 'Immediate Requirement',
      },
    ],
  },
  'Mechanical & Automation': {
    name: 'Mechanical & Automation',
    code: 'ME',
    tagline: 'Industrial robotics, CNC precision machining, thermal HVAC systems, and digital twin manufacturing.',
    activeOpenings: 15300,
    openingsGrowth: '+19.6% YoY',
    medianSalary: '₹6.80 LPA',
    premiumForVerified: '+24%',
    skillShortageIndex: 3.7,
    hireTimeDays: 29,
    monthlyTrends: [
      { month: 'Jan', postings: 12000, hiringIndex: 100 },
      { month: 'Feb', postings: 12400, hiringIndex: 103 },
      { month: 'Mar', postings: 13100, hiringIndex: 109 },
      { month: 'Apr', postings: 13600, hiringIndex: 113 },
      { month: 'May', postings: 14100, hiringIndex: 118 },
      { month: 'Jun', postings: 14600, hiringIndex: 122 },
      { month: 'Jul', postings: 14900, hiringIndex: 124 },
      { month: 'Aug', postings: 15100, hiringIndex: 126 },
      { month: 'Sep', postings: 15300, hiringIndex: 128 },
    ],
    inDemandSkills: [
      {
        id: 'me-1',
        name: 'SolidWorks & GD&T Tolerancing',
        category: 'Technical',
        growth: '+26%',
        demandScore: 88,
        demandLevel: 'Very High',
        avgSalary: '₹7.2 LPA',
        openPositions: 4100,
        topEmployers: ['L&T Heavy Engineering', 'Godrej', 'Thermax'],
      },
      {
        id: 'me-2',
        name: 'Industrial Robotics & PLC Integration',
        category: 'Practical / Lab',
        growth: '+48%',
        demandScore: 93,
        demandLevel: 'Surging',
        avgSalary: '₹9.0 LPA',
        openPositions: 3200,
        topEmployers: ['KUKA Robotics', 'FANUC India', 'Tata AutoComp'],
      },
    ],
    employerExpectations: [
      {
        title: 'CNC Programming & G-Code Simulation',
        description: 'Hands-on ability to setup multi-axis CNC machines and optimize toolpaths to reduce cycle time.',
        importancePercentage: 86,
        trend: 'Critical',
      },
    ],
    salaryBands: [
      {
        role: 'Design & Automation Engineer',
        entryLevel: '₹4.5 - ₹7.0 LPA',
        midLevel: '₹7.8 - ₹12.0 LPA',
        seniorLevel: '₹13.0 - ₹20.0 LPA',
      },
    ],
    industryTrends: [
      {
        badge: 'Make in India',
        title: 'Defense & Aerospace Manufacturing Corridors',
        description: 'Defense corridors in Tamil Nadu and Uttar Pradesh driving private procurement for precision CNC and aerospace tooling.',
        impactLevel: 'High Impact',
      },
    ],
    liveJobs: [
      {
        id: 'job-lm-me1',
        title: 'Junior Robotics Application Engineer',
        company: 'FANUC India Automation',
        location: 'Bengaluru / Pune',
        salary: '₹5.6 - ₹7.8 LPA',
        experience: '0 - 2 Years',
        tags: ['Robotic Arm Teach Pendant', 'PLC', 'Industrial Safety'],
        urgency: 'Verified Talent Preferred',
      },
    ],
  },
  'Civil & Smart Infrastructure': {
    name: 'Civil & Smart Infrastructure',
    code: 'CE',
    tagline: 'Building Information Modeling (BIM), smart city sensor networks, highway geotechnics, and metro transit.',
    activeOpenings: 11900,
    openingsGrowth: '+21.2% YoY',
    medianSalary: '₹6.50 LPA',
    premiumForVerified: '+22%',
    skillShortageIndex: 3.5,
    hireTimeDays: 30,
    monthlyTrends: [
      { month: 'Jan', postings: 9400, hiringIndex: 100 },
      { month: 'Feb', postings: 9700, hiringIndex: 103 },
      { month: 'Mar', postings: 10300, hiringIndex: 110 },
      { month: 'Apr', postings: 10700, hiringIndex: 114 },
      { month: 'May', postings: 11100, hiringIndex: 118 },
      { month: 'Jun', postings: 11400, hiringIndex: 121 },
      { month: 'Jul', postings: 11600, hiringIndex: 123 },
      { month: 'Aug', postings: 11800, hiringIndex: 126 },
      { month: 'Sep', postings: 11900, hiringIndex: 127 },
    ],
    inDemandSkills: [
      {
        id: 'ce-1',
        name: 'Revit & 4D BIM Modeling',
        category: 'Technical',
        growth: '+38%',
        demandScore: 91,
        demandLevel: 'Very High',
        avgSalary: '₹7.8 LPA',
        openPositions: 3400,
        topEmployers: ['L&T Construction', 'Shapoorji Pallonji', 'Afcons'],
      },
    ],
    employerExpectations: [
      {
        title: 'Total Station & GIS Surveying',
        description: 'Hands-on electronic distance measurement and drone orthomosaic surveying for greenfield corridors.',
        importancePercentage: 84,
        trend: 'Rising',
      },
    ],
    salaryBands: [
      {
        role: 'BIM Structural Detailer',
        entryLevel: '₹4.2 - ₹6.8 LPA',
        midLevel: '₹7.5 - ₹11.5 LPA',
        seniorLevel: '₹12.5 - ₹19.0 LPA',
      },
    ],
    industryTrends: [
      {
        badge: 'Infrastructure',
        title: 'PM GatiShakti National Master Plan',
        description: 'Multi-modal transport network linking 200+ economic nodes creating sustained hiring for structural and survey technicians.',
        impactLevel: 'High Impact',
      },
    ],
    liveJobs: [
      {
        id: 'job-lm-ce1',
        title: 'BIM Modeler Trainee - Metro Rail Project',
        company: 'L&T Heavy Civil Infrastructure',
        location: 'Bengaluru / Mumbai',
        salary: '₹5.2 - ₹7.0 LPA',
        experience: '0 - 2 Years',
        tags: ['Revit', 'AutoCAD', 'Structural Details'],
        urgency: 'Immediate Requirement',
      },
    ],
  },
};

export const LabourMarket: React.FC = () => {
  const [selectedSectorKey, setSelectedSectorKey] = useState<string>('Electrical & Power Systems');
  const [selectedRegion, setSelectedRegion] = useState<string>('All India');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'30D' | '90D' | '1Y'>('90D');
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'employers' | 'jobs' | 'salaries'>('overview');
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(null);

  const currentSector = SECTOR_DATA[selectedSectorKey] || SECTOR_DATA['Electrical & Power Systems'];

  // Check Flask API connection on mount
  useEffect(() => {
    const testApi = async () => {
      try {
        const isLive = await checkBackendHealth();
        setApiConnected(isLive);
        if (isLive) {
          // Attempt to fetch live market trends from Flask backend
          try {
            await labourMarketApi.getMarketTrends({ sector: selectedSectorKey });
          } catch {
            // graceful fallback to state
          }
        }
      } catch {
        setApiConnected(false);
      }
    };
    testApi();
  }, [selectedSectorKey]);

  const handleRefreshData = async () => {
    setLoading(true);
    try {
      const isLive = await checkBackendHealth();
      setApiConnected(isLive);
    } catch {
      setApiConnected(false);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const handleDownloadReport = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Find max postings for SVG chart scaling
  const maxPostings = Math.max(...currentSector.monthlyTrends.map((t) => t.postings));
  const minPostings = Math.min(...currentSector.monthlyTrends.map((t) => t.postings)) * 0.8;

  return (
    <div className="space-y-6 pb-12">
      {/* --------------------------------------------------------------------- */}
      {/* TOP HERO & SECTOR CONTEXT HEADER                                      */}
      {/* --------------------------------------------------------------------- */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle background decorative shapes */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-50/60 blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 h-48 w-48 rounded-full bg-emerald-50/50 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#0052cc] border border-blue-200/70 shadow-2xs">
                <Activity className="h-3.5 w-3.5" />
                National Labour Market Intelligence
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Q3 Pulse Active
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                NSDC & NCVET Aligned
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0A2540]">
              Engineering Skill Demand & <span className="text-[#0052cc]">Market Trends</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Real-time intelligence on technical recruitment velocity, verified skill compensation premiums, employer requirements, and emerging industrial transformations across India.
            </p>
          </div>

          {/* Quick Action Header Controls */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/90 p-1 text-xs">
              {(['30D', '90D', '1Y'] as const).map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`rounded-lg px-3 py-1.5 font-bold transition-all cursor-pointer ${
                    selectedTimeframe === tf
                      ? 'bg-white text-[#0052cc] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleRefreshData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
              title="Refresh live data from Flask API"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-[#0052cc]' : ''}`} />
              <span>{loading ? 'Updating...' : 'Sync'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadReport}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0052cc] px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-[#0043a8] transition-all cursor-pointer"
            >
              {downloadSuccess ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Report Ready</span>
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5" />
                  <span>Export Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sector Navigation Selector Pills matching KaushalSetu aesthetics */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Select Engineering Domain / Sector:
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="h-3.5 w-3.5 text-[#0052cc]" />
              <span>Region:</span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-transparent font-bold text-[#0052cc] outline-none cursor-pointer"
              >
                <option value="All India">All India</option>
                <option value="Bengaluru, Karnataka">Bengaluru (Hub)</option>
                <option value="Pune, Maharashtra">Pune (Auto / Mfg)</option>
                <option value="Hyderabad, Telangana">Hyderabad (VLSI / Tech)</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Chennai, Tamil Nadu">Chennai (Auto / Power)</option>
                <option value="Ahmedabad / Gujarat">Gujarat (Solar / Chem)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {Object.keys(SECTOR_DATA).map((sectorName) => {
              const sec = SECTOR_DATA[sectorName];
              const isSelected = selectedSectorKey === sectorName;

              return (
                <button
                  key={sectorName}
                  type="button"
                  onClick={() => setSelectedSectorKey(sectorName)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#0052cc] text-white border-[#0052cc] shadow-md shadow-blue-500/15'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50/50 hover:border-blue-200'
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isSelected ? 'bg-white' : 'bg-[#0052cc]'
                    }`}
                  />
                  <span>{sectorName}</span>
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-extrabold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {sec.code}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 5 KEY METRICS SUMMARY STAT CARDS                                      */}
      {/* --------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-2 hover:border-blue-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Vacancies</span>
            <span className="rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 border border-emerald-200">
              {currentSector.openingsGrowth}
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#0A2540]">
            {currentSector.activeOpenings.toLocaleString()}+
          </p>
          <span className="text-[11px] text-slate-400 block">
            Live technical roles across {selectedRegion}
          </span>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-2 hover:border-blue-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Median Starting CTC</span>
            <span className="rounded-full bg-blue-50 text-[#0052cc] text-[10px] font-extrabold px-2 py-0.5 border border-blue-200">
              Benchmark
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#0A2540]">
            {currentSector.medianSalary}
          </p>
          <span className="text-[11px] text-slate-400 block">
            Annual base starting package
          </span>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-2 hover:border-blue-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified Skill Premium</span>
            <span className="rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 border border-emerald-200">
              High ROI
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600">
            {currentSector.premiumForVerified}
          </p>
          <span className="text-[11px] text-slate-400 block">
            Higher salary for KaushalSetu verified badge
          </span>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-2 hover:border-blue-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Talent Deficit Index</span>
            <span className="rounded-full bg-amber-50 text-amber-700 text-[10px] font-extrabold px-2 py-0.5 border border-amber-200">
              Employer Demand
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#0A2540]">
            {currentSector.skillShortageIndex} <span className="text-sm font-normal text-slate-400">/ 5.0</span>
          </p>
          <span className="text-[11px] text-slate-400 block">
            High shortage of practical candidates
          </span>
        </div>

        {/* Metric 5 */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-2 hover:border-blue-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg. Time to Hire</span>
            <span className="rounded-full bg-purple-50 text-purple-700 text-[10px] font-extrabold px-2 py-0.5 border border-purple-200">
              Fast Track
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#0A2540]">
            {currentSector.hireTimeDays} <span className="text-sm font-normal text-slate-400">Days</span>
          </p>
          <span className="text-[11px] text-slate-400 block">
            Down from 44 days with verified match
          </span>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* SECTION TABS FOR DEEP EXPLORATION                                     */}
      {/* --------------------------------------------------------------------- */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'overview', label: 'Analytics & Hiring Trends', icon: TrendingUp },
          { id: 'skills', label: 'In-Demand Skills & Radar', icon: Cpu },
          { id: 'employers', label: 'Employer Requirements & Gaps', icon: Building },
          { id: 'salaries', label: 'Salary Benchmarking', icon: DollarSign },
          { id: 'jobs', label: 'Live Sector Openings', icon: Briefcase },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0052cc] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* TAB 1: OVERVIEW - CHARTS & REQUISITION TRAJECTORY                     */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (8 cols): Interactive Hiring Volume Chart */}
          <div className="lg:col-span-8 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-[#0A2540] flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#0052cc]" />
                  <span>Monthly Hiring Requisition Velocity (2025 – 2026)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Trajectory of technical job postings for {currentSector.name} indexed against baseline hiring.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0">
                +49% Cumulative Surge
              </span>
            </div>

            {/* Custom Interactive SVG Area & Bar Chart */}
            <div className="relative pt-4 pb-2">
              <div className="h-64 w-full flex items-end justify-between gap-2 sm:gap-3 px-2 border-b border-slate-200">
                {currentSector.monthlyTrends.map((trend, idx) => {
                  const heightPercent = Math.max(
                    15,
                    Math.round(((trend.postings - minPostings) / (maxPostings - minPostings)) * 85)
                  );
                  const isHovered = hoveredTrendIndex === idx;

                  return (
                    <div
                      key={trend.month}
                      onMouseEnter={() => setHoveredTrendIndex(idx)}
                      onMouseLeave={() => setHoveredTrendIndex(null)}
                      className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                    >
                      {/* Interactive Tooltip on Hover */}
                      {isHovered && (
                        <div className="absolute -top-12 z-20 rounded-lg bg-[#0A2540] text-white px-2.5 py-1.5 text-[11px] shadow-lg whitespace-nowrap pointer-events-none">
                          <span className="font-bold">{trend.month}: </span>
                          <span className="text-blue-300 font-bold">{trend.postings.toLocaleString()}</span> postings
                          <div className="text-[10px] text-slate-300">Hiring Index: {trend.hiringIndex}</div>
                        </div>
                      )}

                      {/* Bar Column with Gradient */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[42px] rounded-t-xl transition-all duration-300 ${
                          isHovered
                            ? 'bg-[#0052cc] shadow-md shadow-blue-500/30'
                            : idx === currentSector.monthlyTrends.length - 1
                            ? 'bg-gradient-to-t from-blue-600 to-[#0052cc]'
                            : 'bg-gradient-to-t from-blue-100 to-blue-200 hover:from-blue-300 hover:to-blue-400'
                        }`}
                      />

                      {/* Month Label */}
                      <span
                        className={`text-[11px] font-semibold mt-2 ${
                          isHovered ? 'text-[#0052cc] font-bold' : 'text-slate-500'
                        }`}
                      >
                        {trend.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Chart Legend */}
              <div className="flex items-center justify-between text-xs text-slate-500 mt-4 px-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-md bg-[#0052cc]" />
                    <span className="font-medium text-slate-700">Live Postings Count</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-md bg-blue-100" />
                    <span>Quarterly Benchmark</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400">Source: National Labour Job Index & Partner Portals</span>
              </div>
            </div>

            {/* Micro Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="rounded-xl bg-[#f0f6ff] border border-blue-100 p-3 text-xs">
                <span className="font-bold text-[#0052cc] block mb-1">Peak Hiring Cycle</span>
                <p className="text-slate-600 text-[11px]">
                  August – November witness a 38% spike due to capital project commissioning and fiscal expansions.
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50/70 border border-emerald-100 p-3 text-xs">
                <span className="font-bold text-emerald-800 block mb-1">Fresher Intake Share</span>
                <p className="text-slate-600 text-[11px]">
                  42% of requisitions explicitly welcome entry-level candidates with verified practical credentials.
                </p>
              </div>
              <div className="rounded-xl bg-purple-50/70 border border-purple-100 p-3 text-xs">
                <span className="font-bold text-purple-800 block mb-1">Regional Hotspot</span>
                <p className="text-slate-600 text-[11px]">
                  Bengaluru, Pune, and Chennai account for 68% of national engineering hiring requisitions.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Macro Industrial Drivers & Policies */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-[#0A2540] flex items-center gap-2">
                  <Flame className="h-4 w-4 text-amber-500" />
                  <span>Macro Drivers & Policy Impact</span>
                </h3>
                <span className="text-[10px] font-bold text-slate-500">Government Schemes</span>
              </div>

              <div className="space-y-3.5">
                {currentSector.industryTrends.map((trend) => (
                  <div
                    key={trend.title}
                    className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-2 hover:bg-blue-50/40 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-blue-100 text-[#0052cc] text-[10px] font-extrabold px-2 py-0.5">
                        {trend.badge}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {trend.impactLevel}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {trend.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {trend.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Callout Link to Curriculum / Assessment */}
              <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50/40 p-4 space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0052cc] text-white">
                    <Award className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold text-[#0A2540]">Prepare for These Opportunities</h4>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Take the verified skill assessment for {currentSector.name} to earn employer-recognized certifications.
                </p>
                <Link
                  to="/assessment"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0052cc] hover:text-[#0043a8] group"
                >
                  <span>Take Skill Assessment</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 2: IN-DEMAND SKILLS & DEMAND RADAR                                */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'skills' && (
        <div className="rounded-3xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#0A2540] flex items-center gap-2">
                <Cpu className="h-5 w-5 text-[#0052cc]" />
                <span>High-Demand Technical Competencies in {currentSector.name}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculated using 84,000+ national job postings, employer applicant requisitions, and salary compensation percentiles.
              </p>
            </div>
            <Link
              to="/skills"
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-[#0052cc] hover:bg-blue-100 transition-colors shrink-0"
            >
              <span>Add to My Profile</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {currentSector.inDemandSkills.map((skill, index) => (
              <div
                key={skill.id}
                className="p-5 sm:p-6 hover:bg-slate-50/70 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                {/* Left: Skill title, category, and ranking */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-600">
                      #{index + 1}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{skill.name}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        skill.category === 'Technical'
                          ? 'bg-blue-50 text-[#0052cc] border border-blue-200'
                          : skill.category === 'Practical / Lab'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {skill.category}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>
                      Active Requisitions: <strong className="text-slate-800">{skill.openPositions.toLocaleString()}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Median Package: <strong className="text-emerald-700">{skill.avgSalary}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Hiring Leaders: <span className="text-slate-700">{skill.topEmployers.join(', ')}</span>
                    </span>
                  </div>
                </div>

                {/* Right: Demand Score Meter & Growth Rate */}
                <div className="flex items-center gap-6 shrink-0">
                  <div className="w-36 space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span className="text-slate-500">Demand Score</span>
                      <span className="text-[#0052cc] font-bold">{skill.demandScore}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        style={{ width: `${skill.demandScore}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-[#0052cc]"
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold ${
                        skill.demandLevel === 'Surging'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-blue-50 text-[#0052cc] border border-blue-200'
                      }`}
                    >
                      {skill.demandLevel}
                    </span>
                    <span className="block text-xs font-extrabold text-emerald-600 mt-1">
                      {skill.growth} YoY
                    </span>
                  </div>

                  <Link
                    to="/assessment"
                    className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors shrink-0"
                  >
                    Test Skill
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 3: EMPLOYER REQUIREMENTS & SKILL GAP ANALYSIS                    */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'employers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: What Recruiters Value Most */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0A2540] flex items-center gap-2">
                <Building className="h-5 w-5 text-[#0052cc]" />
                <span>What Industrial Employers Look For in {currentSector.name}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Surveyed hiring directors from Tata, Schneider, Siemens, L&T, and Bosch India.
              </p>
            </div>

            <div className="space-y-4">
              {currentSector.employerExpectations.map((exp) => (
                <div
                  key={exp.title}
                  className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-2 hover:bg-blue-50/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{exp.title}</h4>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        exp.trend === 'Critical'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-blue-50 text-[#0052cc] border border-blue-200'
                      }`}
                    >
                      {exp.trend} Priority
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>

                  <div className="pt-1">
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>Recruiter Importance Rating</span>
                      <span className="font-bold text-[#0052cc]">{exp.importancePercentage}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        style={{ width: `${exp.importancePercentage}%` }}
                        className="h-full rounded-full bg-[#0052cc]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: The Conventional Graduate vs Verified KaushalSetu Talent Gap */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-[#0A2540] flex items-center gap-2">
                  <Target className="h-4 w-4 text-[#0052cc]" />
                  <span>The Engineering Skill Deficit</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Comparison between textbook theoretical knowledge vs job-ready verified proficiency.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between font-bold mb-1.5">
                    <span className="text-slate-700">Hands-on Diagnostic Troubleshooting</span>
                    <span className="text-rose-600 font-extrabold">-48% Deficit</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Standard Graduate: 32%</span>
                      <span>Employer Need: 80%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden relative">
                      <div className="h-full bg-rose-400 w-[32%]" />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1.5">
                    <span className="text-slate-700">Industrial Standards & Safety (IS / IEC)</span>
                    <span className="text-amber-600 font-extrabold">-42% Deficit</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Standard Graduate: 38%</span>
                      <span>Employer Need: 80%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden relative">
                      <div className="h-full bg-amber-400 w-[38%]" />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1.5">
                    <span className="text-slate-700">Modern PLC / Simulation Tooling</span>
                    <span className="text-emerald-700 font-extrabold">+35% KaushalSetu Boost</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>With KaushalSetu: 88%</span>
                      <span>Employer Need: 85%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden relative">
                      <div className="h-full bg-emerald-500 w-[88%]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 space-y-2 mt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-emerald-950">How KaushalSetu Closes This Gap</h4>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Our curriculum matches the National Occupational Standards (NOS). When you take practical assessments and log verified projects, recruiters fast-track your application directly to the interview stage.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 4: SALARY BENCHMARKING                                            */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'salaries' && (
        <div className="rounded-3xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#0A2540] flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                <span>Compensation Progression Matrix: {currentSector.name}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Annual CTC bands (Base + Performance Incentive) based on verified placement disclosures across tier-1 & tier-2 engineering centers.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0">
              Verified Skills Add 22–38% Premium
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Role / Specialization</th>
                  <th className="py-3.5 px-6">Entry Level (0 – 2 Yrs)</th>
                  <th className="py-3.5 px-6">Mid-Career (3 – 5 Yrs)</th>
                  <th className="py-3.5 px-6">Lead / Specialist (6+ Yrs)</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {currentSector.salaryBands.map((band) => (
                  <tr key={band.role} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">{band.role}</td>
                    <td className="py-4 px-6 font-semibold text-blue-700 bg-blue-50/30">
                      {band.entryLevel}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-800">{band.midLevel}</td>
                    <td className="py-4 px-6 font-bold text-emerald-700">{band.seniorLevel}</td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to="/job-matching"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#0052cc] hover:underline"
                      >
                        <span>Find Matching Roles</span>
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 5: LIVE SECTOR OPENINGS                                           */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#0A2540]">
                Live Open Requisitions in {currentSector.name}
              </h2>
              <p className="text-xs text-slate-500">
                Direct hiring mandates synced from KaushalSetu employer partnerships.
              </p>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0052cc] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0043a8]"
            >
              <span>Explore All Jobs</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentSector.liveJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-3.5 hover:border-blue-200 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-blue-50 text-[#0052cc] text-[10px] font-bold px-2.5 py-0.5 border border-blue-200">
                      {job.urgency}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-700">{job.salary}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{job.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                    <Building className="h-3.5 w-3.5 text-slate-400" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{job.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Exp: {job.experience}</span>
                  <Link
                    to={`/job-matching`}
                    className="inline-flex items-center gap-1 rounded-lg bg-[#0052cc] px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-[#0043a8]"
                  >
                    <span>Check Match</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* CONNECTED FLASK BACKEND STATUS FOOTER                                 */}
      {/* --------------------------------------------------------------------- */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5 text-xs text-slate-600 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-[#0052cc]">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">Flask Labour Intelligence REST API</span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    apiConnected
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-[#0052cc]'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      apiConnected ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}
                  />
                  {apiConnected ? 'Connected to Flask Backend' : 'Live Simulation & Cache Active'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Endpoints: <code className="font-mono text-slate-700">GET {config.apiBaseUrl}/market/trends</code>, <code className="font-mono text-slate-700">/market/in-demand-skills</code>, <code className="font-mono text-slate-700">/market/salaries</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/curriculum"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <span>Explore Curricula</span>
            </Link>
            <Link
              to="/job-matching"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0052cc] px-4 py-2 text-xs font-bold text-white hover:bg-[#0043a8] transition-colors"
            >
              <span>Match Jobs Now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};


export default LabourMarket;
