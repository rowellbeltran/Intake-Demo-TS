import React, { useState } from "react";

// ============ TYPES ============
interface Patient {
  id: number;
  name: string;
  mrn: string;
  date: string;
  provider: string;
  nurse: string;
  stage: string;
  status: string;
  exception: string;
  readiness: number;
}

interface Visit {
  type: string;
  date: string;
}

interface ReconcilableItem {
  reconciled: string[];
  unreconciled: string[];
}

interface PatientDetail {
  visits: Visit[];
  allergies: ReconcilableItem;
  medications: ReconcilableItem;
  immunizations: ReconcilableItem;
  careGaps: string[];
  nurseSummary: string;
  roi: ROI[];
}

interface ROI {
  id: number;
  facility: string;
  requestedDate: string;
  status: string;
  patient?: string;
}

interface VisitToday {
  id: number;
  patient: string;
  time: string;
  provider: string;
  nurse: string;
  status: string;
}

interface WeeklyVisit {
  week: string;
  visits: number;
  aht: number;
}

interface PieChartData {
  label: string;
  value: number;
  color: string;
}

interface RecordsState extends Record<string, boolean | string> {
  behavioralHealth: boolean;
  emergencyDept: boolean;
  operativeNotes: boolean;
  providerNotes: boolean;
  therapyNotes: boolean;
  otherDocument: string;
}

interface AdditionalState extends Record<string, boolean | string> {
  allergyList: boolean;
  immunizations: boolean;
  medicationList: boolean;
  labResults: boolean;
  hivLab: boolean;
  geneticTesting: boolean;
  pathology: boolean;
  ekg: boolean;
  radiologyReport: boolean;
  radiologyImages: boolean;
  billingInfo: boolean;
}

interface SubstanceState extends Record<string, boolean | string> {
  assessment: boolean;
  historyPhysical: boolean;
  multidisciplinaryNotes: boolean;
  familyParticipation: boolean;
  questionnaires: boolean;
  treatmentSummary: boolean;
  treatmentPlans: boolean;
  other: string;
}

// ============ DATA ============
const patients: Patient[] = [
  { id: 1, name: "John Doe", mrn: "MRN-001", date: "2026-04-10", provider: "Dr. Smith", nurse: "Sarah Johnson, RN", stage: "Data Prepared", status: "New", exception: "None", readiness: 25 },
  { id: 2, name: "Jane Roe", mrn: "MRN-002", date: "2026-04-11", provider: "Dr. Adams", nurse: "Michael Chen, RN", stage: "Data Validated", status: "In Progress", exception: "Missing Labs", readiness: 60 },
  { id: 3, name: "Michael Lee", mrn: "MRN-003", date: "2026-04-05", provider: "Dr. Brown", nurse: "Emily Rodriguez, RN", stage: "Readiness Evaluated", status: "Completed", exception: "None", readiness: 100 },
  { id: 4, name: "Sarah Johnson", mrn: "MRN-004", date: "2026-04-12", provider: "Dr. Wilson", nurse: "James Patterson, RN", stage: "Data Prepared", status: "New", exception: "Insurance Verification", readiness: 35 },
  { id: 5, name: "Robert Martinez", mrn: "MRN-005", date: "2026-04-13", provider: "Dr. Garcia", nurse: "Lisa Wong, RN", stage: "Data Validated", status: "In Progress", exception: "None", readiness: 75 },
  { id: 6, name: "Emily Chen", mrn: "MRN-006", date: "2026-04-14", provider: "Dr. Taylor", nurse: "David Kumar, RN", stage: "Patient Record Updated", status: "In Progress", exception: "Pending Approval", readiness: 50 },
  { id: 7, name: "David Thompson", mrn: "MRN-007", date: "2026-04-15", provider: "Dr. Anderson", nurse: "Jennifer Lee, RN", stage: "Data Prepared", status: "New", exception: "None", readiness: 20 },
  { id: 8, name: "Lisa Anderson", mrn: "MRN-008", date: "2026-04-16", provider: "Dr. Martinez", nurse: "Robert Thompson, RN", stage: "Data Validated", status: "In Progress", exception: "Lab Results Pending", readiness: 65 },
  
  // COMPLETED VISITS - Historical Data
  { id: 9, name: "James Wilson", mrn: "MRN-009", date: "2026-04-04", provider: "Dr. Harris", nurse: "Sarah Johnson, RN", stage: "Readiness Evaluated", status: "Completed", exception: "None", readiness: 100 },
  { id: 10, name: "Patricia Moore", mrn: "MRN-010", date: "2026-04-03", provider: "Dr. Clark", nurse: "Michael Chen, RN", stage: "Readiness Evaluated", status: "Completed", exception: "None", readiness: 100 },
  { id: 11, name: "Christopher Davis", mrn: "MRN-011", date: "2026-04-02", provider: "Dr. Lewis", nurse: "Emily Rodriguez, RN", stage: "Readiness Evaluated", status: "Completed", exception: "None", readiness: 100 },
  { id: 12, name: "Jennifer Martinez", mrn: "MRN-012", date: "2026-04-01", provider: "Dr. Walker", nurse: "James Patterson, RN", stage: "Readiness Evaluated", status: "Completed", exception: "None", readiness: 100 },
  { id: 13, name: "Daniel Rodriguez", mrn: "MRN-013", date: "2026-03-31", provider: "Dr. Young", nurse: "Lisa Wong, RN", stage: "Readiness Evaluated", status: "Completed", exception: "None", readiness: 100 },
  { id: 14, name: "Maria Garcia", mrn: "MRN-014", date: "2026-03-30", provider: "Dr. Hernandez", nurse: "David Kumar, RN", stage: "Readiness Evaluated", status: "Completed", exception: "None", readiness: 100 },
  { id: 15, name: "Thomas Anderson", mrn: "MRN-015", date: "2026-03-29", provider: "Dr. Lopez", nurse: "Jennifer Lee, RN", stage: "Readiness Evaluated", status: "Completed", exception: "None", readiness: 100 },
  { id: 16, name: "Angela Thomas", mrn: "MRN-016", date: "2026-03-28", provider: "Dr. Martinez", nurse: "Robert Thompson, RN", stage: "Readiness Evaluated", status: "Completed", exception: "None", readiness: 100 }
];

const defaultDetails: PatientDetail = {
  visits: [],
  allergies: { reconciled: [], unreconciled: [] },
  medications: { reconciled: [], unreconciled: [] },
  immunizations: { reconciled: [], unreconciled: [] },
  careGaps: [],
  nurseSummary: "No data",
  roi: []
};

const patientDetails: Record<number, PatientDetail> = {
  1: {
    ...defaultDetails,
    visits: [
      { type: "Pulmonary", date: "2025-12-01" },
      { type: "Cardiology", date: "2025-11-15" },
      { type: "General Checkup", date: "2025-10-20" }
    ],
    allergies: { 
      reconciled: ["Peanuts", "Latex", "Sulfa"], 
      unreconciled: ["Penicillin", "Shellfish"] 
    },
    medications: { 
      reconciled: ["Metformin", "Atorvastatin"], 
      unreconciled: ["Lisinopril", "Aspirin"] 
    },
    immunizations: { 
      reconciled: ["Flu Shot", "Pneumonia"], 
      unreconciled: ["COVID Booster", "Shingles"] 
    },
    careGaps: ["Annual Physical", "Blood Pressure Check", "Cholesterol Screening"],
    nurseSummary: "Confirm medication adherence. Monitor cardiac medications. Patient education provided regarding allergy management.",
    roi: [
      { id: 1, facility: "General Hospital", requestedDate: "2026-04-08", status: "Patient Signature Pending" },
      { id: 2, facility: "City Clinic", requestedDate: "2026-04-07", status: "Sent to Facility" }
    ]
  },
  2: {
    ...defaultDetails,
    visits: [
      { type: "Cardiology", date: "2025-11-15" },
      { type: "General Checkup", date: "2025-10-20" },
      { type: "Dermatology", date: "2025-09-10" }
    ],
    allergies: { 
      reconciled: ["Sulfa", "NSAIDs"], 
      unreconciled: ["Latex", "Penicillin"] 
    },
    medications: { 
      reconciled: ["Atorvastatin", "Ibuprofen"], 
      unreconciled: ["Aspirin", "Metformin"] 
    },
    immunizations: { 
      reconciled: ["Pneumonia", "Flu Shot"], 
      unreconciled: ["Shingles", "COVID Booster"] 
    },
    careGaps: ["Blood Pressure Check", "Cholesterol Screening", "Skin Cancer Screening"],
    nurseSummary: "Monitor cardiac medications. Advise on NSAID alternatives. Encourage regular skin checks.",
    roi: [
      { id: 3, facility: "Heart Center", requestedDate: "2026-04-06", status: "Completed" }
    ]
  },
  3: {
    ...defaultDetails,
    visits: [
      { type: "Orthopedic", date: "2025-09-30" },
      { type: "Physical Therapy", date: "2025-10-15" }
    ],
    allergies: { 
      reconciled: ["NSAIDs"], 
      unreconciled: ["Sulfa", "Shellfish"] 
    },
    medications: { 
      reconciled: ["Ibuprofen"], 
      unreconciled: ["Metformin", "Atorvastatin"] 
    },
    immunizations: { 
      reconciled: ["Flu Shot", "COVID Booster"], 
      unreconciled: ["Pneumonia"] 
    },
    careGaps: ["Physical Therapy", "Annual Physical"],
    nurseSummary: "Follow-up on surgery recovery. Reinforce importance of physical therapy attendance.",
    roi: []
  },
  4: {
    ...defaultDetails,
    visits: [
      { type: "General Checkup", date: "2025-10-05" },
      { type: "Neurology", date: "2025-09-20" }
    ],
    allergies: { 
      reconciled: ["Penicillin", "Codeine"], 
      unreconciled: ["Latex"] 
    },
    medications: { 
      reconciled: ["Gabapentin", "Levothyroxine"], 
      unreconciled: ["Sertraline"] 
    },
    immunizations: { 
      reconciled: ["Flu Shot"], 
      unreconciled: ["COVID Booster", "Pneumonia", "Shingles"] 
    },
    careGaps: ["Thyroid Function Test", "Mental Health Screening", "Neurological Assessment"],
    nurseSummary: "Monitor neurological symptoms. Verify thyroid medication compliance. Screen for depression.",
    roi: [
      { id: 4, facility: "Neurology Clinic", requestedDate: "2026-04-05", status: "Patient Signature Pending" }
    ]
  },
  5: {
    ...defaultDetails,
    visits: [
      { type: "Gastroenterology", date: "2025-11-10" },
      { type: "General Checkup", date: "2025-10-15" }
    ],
    allergies: { 
      reconciled: ["Shellfish", "Soy"], 
      unreconciled: ["Nuts", "Sesame"] 
    },
    medications: { 
      reconciled: ["Omeprazole", "Simvastatin"], 
      unreconciled: ["Metformin"] 
    },
    immunizations: { 
      reconciled: ["Pneumonia", "Flu Shot", "COVID Booster"], 
      unreconciled: ["Shingles"] 
    },
    careGaps: ["Colonoscopy", "Liver Function Tests", "Dietary Consultation"],
    nurseSummary: "Schedule colonoscopy screening. Review dietary modifications. Monitor GI symptoms.",
    roi: [
      { id: 5, facility: "GI Specialists", requestedDate: "2026-04-04", status: "Sent to Facility" },
      { id: 6, facility: "Lab Services", requestedDate: "2026-04-02", status: "Completed" }
    ]
  },
  6: {
    ...defaultDetails,
    visits: [
      { type: "Rheumatology", date: "2025-11-01" },
      { type: "Physical Therapy", date: "2025-10-20" }
    ],
    allergies: { 
      reconciled: ["Aspirin", "NSAIDs"], 
      unreconciled: ["Sulfa"] 
    },
    medications: { 
      reconciled: ["Methotrexate", "Prednisone"], 
      unreconciled: ["Hydroxychloroquine"] 
    },
    immunizations: { 
      reconciled: ["Flu Shot"], 
      unreconciled: ["COVID Booster", "Pneumonia", "Shingles"] 
    },
    careGaps: ["Blood Work", "Rheumatology Follow-up", "Joint Assessment"],
    nurseSummary: "Monitor methotrexate side effects. Ensure regular lab work. Assess joint mobility and pain levels.",
    roi: [
      { id: 7, facility: "Rheumatology Center", requestedDate: "2026-04-08", status: "Patient Signature Pending" }
    ]
  },
  7: {
    ...defaultDetails,
    visits: [
      { type: "Pulmonary", date: "2025-12-10" },
      { type: "Sleep Medicine", date: "2025-11-25" }
    ],
    allergies: { 
      reconciled: ["Tree Nuts"], 
      unreconciled: ["Shellfish", "Fish"] 
    },
    medications: { 
      reconciled: ["Albuterol", "Fluticasone"], 
      unreconciled: ["Montelukast"] 
    },
    immunizations: { 
      reconciled: ["Flu Shot", "Pneumonia", "COVID Booster"], 
      unreconciled: ["Shingles"] 
    },
    careGaps: ["Pulmonary Function Test", "Sleep Study", "Oxygen Saturation Monitoring"],
    nurseSummary: "Assess asthma control. Review inhaler technique. Schedule sleep study if indicated.",
    roi: [
      { id: 8, facility: "Pulmonology Associates", requestedDate: "2026-04-07", status: "Sent to Facility" }
    ]
  },
  8: {
    ...defaultDetails,
    visits: [
      { type: "Oncology", date: "2025-10-30" },
      { type: "General Checkup", date: "2025-10-15" }
    ],
    allergies: { 
      reconciled: ["Contrast Dye", "Latex"], 
      unreconciled: ["Chemotherapy agents"] 
    },
    medications: { 
      reconciled: ["Tamoxifen", "Loratadine"], 
      unreconciled: ["Vitamin D supplement"] 
    },
    immunizations: { 
      reconciled: ["Flu Shot"], 
      unreconciled: ["COVID Booster", "Pneumonia"] 
    },
    careGaps: ["Oncology Follow-up", "Mammography", "Tumor Markers", "Bone Density Scan"],
    nurseSummary: "Monitor Tamoxifen side effects. Schedule mammography screening. Assess cancer-related fatigue and quality of life.",
    roi: [
      { id: 9, facility: "Cancer Center", requestedDate: "2026-04-06", status: "Completed" },
      { id: 10, facility: "Imaging Center", requestedDate: "2026-04-05", status: "Patient Signature Pending" }
    ]
  }
};

const stages: string[] = ["Data Prepared", "Data Validated", "Patient Record Updated", "Readiness Evaluated"];
const colors: string[] = ["#2563eb", "#14b8a6", "#facc15", "#16a34a"];

const visitsToday: VisitToday[] = [
  { id: 1, patient: "John Doe", time: "09:00 AM", provider: "Dr. Smith", nurse: "Sarah Johnson, RN", status: "Completed" },
  { id: 2, patient: "Jane Roe", time: "09:30 AM", provider: "Dr. Adams", nurse: "Michael Chen, RN", status: "Completed" },
  { id: 3, patient: "Michael Lee", time: "10:00 AM", provider: "Dr. Brown", nurse: "Emily Rodriguez, RN", status: "Pending" },
  { id: 4, patient: "Sarah Johnson", time: "10:30 AM", provider: "Dr. Wilson", nurse: "James Patterson, RN", status: "Pending" },
  { id: 5, patient: "Robert Martinez", time: "11:00 AM", provider: "Dr. Garcia", nurse: "Sarah Johnson, RN", status: "Completed" },
  { id: 6, patient: "Emily Chen", time: "11:30 AM", provider: "Dr. Taylor", nurse: "Michael Chen, RN", status: "Pending" }
];

const roiRequests: ROI[] = [
  { id: 1, patient: "John Doe", facility: "General Hospital", requestedDate: "2026-04-08", status: "Patient Signature Pending" },
  { id: 2, patient: "John Doe", facility: "City Clinic", requestedDate: "2026-04-07", status: "Sent to Facility" },
  { id: 3, patient: "Jane Roe", facility: "Heart Center", requestedDate: "2026-04-06", status: "Completed" },
  { id: 4, patient: "Michael Lee", facility: "Specialty Clinic", requestedDate: "2026-04-05", status: "Patient Signature Pending" },
  { id: 5, patient: "Sarah Johnson", facility: "General Hospital", requestedDate: "2026-04-04", status: "Sent to Facility" },
  { id: 6, patient: "Robert Martinez", facility: "Cardiology Center", requestedDate: "2026-04-03", status: "Completed" }
];

const weeklyVisits: WeeklyVisit[] = [
  { week: "Week 1", visits: 58, aht: 22 },
  { week: "Week 2", visits: 72, aht: 18 },
  { week: "Week 3", visits: 65, aht: 28 },
  { week: "Week 4", visits: 85, aht: 24 },
  { week: "Week 5", visits: 92, aht: 26 }
];

// ============ STYLES ============
const card: React.CSSProperties = { background: "#fff", padding: 20, border: "1px solid #e2e8f0", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" };
const input: React.CSSProperties = { width: "100%", padding: 10, fontSize: 14, marginTop: 6, border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", transition: "all 0.2s" };
const grid2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 };
const grid3: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 };
const primaryBtn: React.CSSProperties = { padding: "10px 24px", fontSize: 14, background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)", color: "#fff", border: "none", borderRadius: 8, minWidth: 0, cursor: "pointer", fontWeight: 600, transition: "all 0.3s", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)" };
const backBtn: React.CSSProperties = { padding: "8px 14px", fontSize: 12, background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, transition: "all 0.3s", boxShadow: "0 2px 8px rgba(37, 99, 235, 0.2)", alignSelf: "flex-start" };

const th: React.CSSProperties = { padding: 14, textAlign: "left", borderBottom: "1px solid #e2e8f0", fontSize: 13, fontWeight: 600, color: "#475569" };
const td: React.CSSProperties = { padding: 14, textAlign: "left", borderBottom: "1px solid #f1f5f9", fontSize: 13, color: "#334155" };

// ============ COMPONENTS ============
interface CardProps {
  title: string;
  children: React.ReactNode;
}

function Card({ title, children }: CardProps): JSX.Element {
  return (
    <div style={card}>
      <h4 style={{ textAlign: "left", marginTop: 0, marginBottom: 16, fontSize: 15, fontWeight: "700", color: "#1f2937", letterSpacing: "0.2px" }}>{title}</h4>
      <div style={{ textAlign: "left", fontSize: 14, color: "#475569" }}>{children}</div>
    </div>
  );
}

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
}

function SectionCard({ title, children }: SectionCardProps): JSX.Element {
  return (
    <div style={card}>
      <h3 style={{ marginTop: 0, marginBottom: 16, textAlign: "left", fontSize: 18, fontWeight: "700", color: "#1f2937", letterSpacing: "-0.5px" }}>{title}</h3>
      <div style={{ textAlign: "left", fontSize: 14, color: "#475569" }}>{children}</div>
    </div>
  );
}

interface CheckboxProps<T extends Record<string, boolean | string>> {
  label: string;
  obj: T;
  k: keyof T;
  set: (obj: T) => void;
}

function Checkbox<T extends Record<string, boolean | string>>({ label, obj, k, set }: CheckboxProps<T>): JSX.Element {
  const isChecked = typeof obj[k] === "boolean" ? (obj[k] as boolean) : false;
  
  return (
    <label style={{ display: "flex", gap: 6, textAlign: "left", fontSize: 14, alignItems: "center", cursor: "pointer" }}>
      <input 
        type="checkbox" 
        checked={isChecked}
        onChange={(e) => set({ ...obj, [k]: e.target.checked } as T)} 
        style={{ accentColor: "#2563eb", width: 18, height: 18, border: "2px solid #999", borderRadius: 3, cursor: "pointer", background: "#fff" }}
      />
      {label}
    </label>
  );
}

interface ReadinessMeterProps {
  value: number;
}

function ReadinessMeter({ value }: ReadinessMeterProps): JSX.Element {
  const color = value < 40 ? "#ef4444" : value < 80 ? "#facc15" : "#10b981";
  return (
    <div style={{ textAlign: "left", fontSize: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <b style={{ fontSize: 15, color: "#1f2937" }}>Readiness</b>
        <span style={{ fontSize: 18, fontWeight: "bold", color: color }}>{value}%</span>
      </div>
      <div style={{ background: "#e5e7eb", height: 12, borderRadius: 6, overflow: "hidden", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)" }}>
        <div style={{ 
          width: value + "%", 
          height: 12, 
          background: `linear-gradient(90deg, ${color}, ${color})`,
          borderRadius: 6,
          transition: "width 0.4s ease",
          boxShadow: `0 2px 4px ${color}40`
        }}/>
      </div>
    </div>
  );
}

interface PieChartProps {
  data: PieChartData[];
}

function PieChart({ data }: PieChartProps): JSX.Element {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90;
  
  const slices = data.map(item => {
    const percentage = (item.value / total) * 100;
    const sliceAngle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;
    
    const x1 = 50 + 50 * Math.cos((startAngle * Math.PI) / 180);
    const y1 = 50 + 50 * Math.sin((startAngle * Math.PI) / 180);
    const x2 = 50 + 50 * Math.cos((endAngle * Math.PI) / 180);
    const y2 = 50 + 50 * Math.sin((endAngle * Math.PI) / 180);
    const largeArc = sliceAngle > 180 ? 1 : 0;
    
    const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`;
    
    return (
      <g key={item.label}>
        <path d={pathData} fill={item.color} stroke="#fff" strokeWidth="2"/>
      </g>
    );
  });
  
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, justifyContent: "center" }}>
      <svg width="120" height="120" viewBox="0 0 100 100">
        {slices}
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 10 }}>
        {data.map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, background: item.color, borderRadius: 1 }}/>
            <span>{item.label}: {item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ MAIN APP ============
export default function App(): JSX.Element {
  const [view, setView] = useState<"dashboard" | "upcoming" | "completed">("dashboard");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showROI, setShowROI] = useState<boolean>(false);

  const filtered = patients.filter(p =>
    view === "completed" ? p.status === "Completed" : view === "upcoming" ? p.status !== "Completed" : true
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)" }}>
      {/* ENHANCED HEADER */}
      <div style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)", padding: "40px 32px", boxShadow: "0 8px 24px rgba(37, 99, 235, 0.2)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: 0, opacity: 0.1, fontSize: 200, lineHeight: 1 }}>📋</div>
        <h1 style={{ color: "#fff", margin: 0, fontSize: 40, fontWeight: "900", letterSpacing: "-1px" }}>Intake Visits</h1>
        <p style={{ color: "rgba(255, 255, 255, 0.9)", margin: "12px 0 0 0", fontSize: 15, fontWeight: "500", letterSpacing: "0.3px" }}>Streamline your patient intake management</p>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", background: "linear-gradient(90deg, #ffffff 0%, #f8fafc 100%)", borderBottom: "1px solid #e2e8f0", paddingLeft: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
        {(["dashboard", "upcoming", "completed"] as const).map(tabView => (
          <div 
            key={tabView}
            style={{
              padding: "14px 28px", 
              cursor: "pointer",
              background: view === tabView ? "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)" : "transparent",
              color: view === tabView ? "#fff" : "#64748b",
              fontWeight: view === tabView ? 600 : 500,
              fontSize: 14,
              borderRadius: view === tabView ? "8px 8px 0 0" : "0",
              marginBottom: view === tabView ? "-1px" : "0",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              margin: view === tabView ? "0" : "0"
            }}
            onClick={() => {
              setView(tabView);
              setSelectedPatient(null);
              setShowROI(false);
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              if (view !== tabView) {
                el.style.background = "#f1f5f9";
                el.style.color = "#334155";
              }
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              if (view !== tabView) {
                el.style.background = "transparent";
                el.style.color = "#64748b";
              }
            }}
          >
            {tabView === "dashboard" && "📊 Dashboard"}
            {tabView === "upcoming" && "📋 Upcoming"}
            {tabView === "completed" && "✅ Completed"}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, padding: 32, maxWidth: "1600px", margin: "0 auto", width: "100%" }}>
        {!selectedPatient ? (
          view === "dashboard" ? (
            <DashboardPage patients={patients} />
          ) : (
            <QueuePage patients={filtered} onSelect={setSelectedPatient} />
          )
        ) : showROI ? (
          <CreateROIPage
            patient={selectedPatient}
            onBack={() => setShowROI(false)}
            onSubmit={(roi) => {
              if (!patientDetails[selectedPatient.id]) {
                patientDetails[selectedPatient.id] = { ...defaultDetails };
              }
              patientDetails[selectedPatient.id].roi.push(roi);
              setShowROI(false);
            }}
          />
        ) : (
          <PatientRecord
            patient={selectedPatient}
            onBack={() => setSelectedPatient(null)}
            onCreateROI={() => setShowROI(true)}
          />
        )}
      </div>
    </div>
  );
}

// ============ QUEUE PAGE ============
interface QueuePageProps {
  patients: Patient[];
  onSelect: (patient: Patient) => void;
}

function QueuePage({ patients, onSelect }: QueuePageProps): JSX.Element {
  const isCompleted = patients.length > 0 && patients[0].status === "Completed";
  const header = isCompleted ? "Completed Visits" : "Upcoming Visits";

  const getStatusColor = (status: string): { bg: string; text: string } => {
    switch (status) {
      case "New":
        return { bg: "#dbeafe", text: "#1e40af" };
      case "In Progress":
        return { bg: "#fef3c7", text: "#92400e" };
      case "Completed":
        return { bg: "#dcfce7", text: "#166534" };
      default:
        return { bg: "#f3f4f6", text: "#374151" };
    }
  };

  const getStageColor = (stage: string): { bg: string; text: string } => {
    switch (stage) {
      case "Data Prepared":
        return { bg: "#dbeafe", text: "#1e40af" };
      case "Data Validated":
        return { bg: "#cffafe", text: "#164e63" };
      case "Patient Record Updated":
        return { bg: "#fef3c7", text: "#92400e" };
      case "Readiness Evaluated":
        return { bg: "#dcfce7", text: "#166534" };
      default:
        return { bg: "#f3f4f6", text: "#374151" };
    }
  };

  return (
    <div>
      <h2 style={{ color: "#1f2937", textAlign: "left", marginBottom: 24, fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px" }}>
        {header}
      </h2>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", textAlign: "left", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <thead style={{ background: "linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%)", borderBottom: "2px solid #e2e8f0" }}>
          <tr>
            {["Patient", "Date", "Provider", "Nurse", "Stage", "Status", "Exception", "Readiness"].map(h => (
              <th key={h} style={th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {patients.map((p, idx) => (
            <tr 
              key={p.id} 
              onClick={() => onSelect(p)} 
              style={{
                cursor: "pointer",
                background: idx % 2 === 0 ? "#fff" : "#f9fafb",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => (e.currentTarget as HTMLTableRowElement).style.background = "#eff6ff"}
              onMouseLeave={(e) => (e.currentTarget as HTMLTableRowElement).style.background = idx % 2 === 0 ? "#fff" : "#f9fafb"}
            >
              <td style={td}>{p.name}</td>
              <td style={td}>{p.date}</td>
              <td style={td}>{p.provider}</td>
              <td style={td}>{p.nurse}</td>
              <td style={td}>
                <span style={{ 
                  padding: "3px 8px", 
                  borderRadius: "3px", 
                  background: getStageColor(p.stage).bg,
                  color: getStageColor(p.stage).text,
                  fontWeight: "bold",
                  fontSize: 12
                }}>
                  {p.stage}
                </span>
              </td>
              <td style={td}>
                <span style={{ 
                  padding: "3px 8px", 
                  borderRadius: "3px", 
                  background: getStatusColor(p.status).bg,
                  color: getStatusColor(p.status).text,
                  fontWeight: "bold",
                  fontSize: 12
                }}>
                  {p.status}
                </span>
              </td>
              <td style={td}>{p.exception}</td>
              <td style={{ ...td, padding: 8 }}>
                <div style={{ background: "#ddd", height: 6, borderRadius: 2 }}>
                  <div style={{ 
                    width: p.readiness + "%", 
                    height: 6, 
                    background: p.readiness < 40 ? "#ef4444" : p.readiness < 80 ? "#facc15" : "#16a34a", 
                    borderRadius: 2 
                  }}/>
                </div>
                <div style={{ fontSize: 11, marginTop: 2, textAlign: "center" }}>{p.readiness}%</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============ PATIENT RECORD ============
interface PatientRecordProps {
  patient: Patient;
  onBack: () => void;
  onCreateROI: () => void;
}

function PatientRecord({ patient, onBack, onCreateROI }: PatientRecordProps): JSX.Element {
  const d = patientDetails[patient.id] || defaultDetails;
  const currentStageIndex = stages.indexOf(patient.stage);
  
  const progressPercentage = stages.length === 1 ? 100 : (currentStageIndex / (stages.length - 1)) * 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <button style={backBtn} onClick={onBack}>← Back</button>
      <div style={card}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 12, color: "#666" }}>Patient Name</div>
            <div style={{ fontSize: 14, fontWeight: "bold" }}>{patient.name}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#666" }}>MRN</div>
            <div style={{ fontSize: 14, fontWeight: "bold" }}>{patient.mrn}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#666" }}>Provider Name</div>
            <div style={{ fontSize: 14, fontWeight: "bold" }}>{patient.provider}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#666" }}>Nurse</div>
            <div style={{ fontSize: 14, fontWeight: "bold" }}>{patient.nurse}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#666" }}>Visit Date</div>
            <div style={{ fontSize: 14, fontWeight: "bold" }}>{patient.date}</div>
          </div>
        </div>

        {/* STAGES AND READINESS CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
          {/* STAGES CARD */}
          <SectionCard title="Stages">
            <div style={{ position: "relative", paddingTop: 24, paddingBottom: 24 }}>
              {/* Background line */}
              <div style={{
                position: "absolute",
                top: "50%",
                left: "2%",
                right: "2%",
                height: 5,
                background: "#e5e7eb",
                borderRadius: 3,
                transform: "translateY(-50%)",
                zIndex: 0
              }}/>
              
              {/* Progress line */}
              <div style={{
                position: "absolute",
                top: "50%",
                left: "2%",
                width: `${2 + (progressPercentage / 100) * 96}%`,
                height: 5,
                background: colors[Math.min(currentStageIndex, colors.length - 1)],
                borderRadius: 3,
                transform: "translateY(-50%)",
                zIndex: 1,
                transition: "width 0.3s ease"
              }}/>

              {/* Stage markers */}
              <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
                {stages.map((s, i) => (
                  <div key={s} style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: "50%", 
                      background: colors[i], 
                      color: "#fff", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      fontWeight: "bold", 
                      fontSize: 16, 
                      border: "3px solid #fff", 
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      margin: "0 auto"
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ fontSize: 12, marginTop: 12, fontWeight: "500", color: "#374151" }}>{s}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ marginTop: 20, padding: "12px", background: "#f0f9ff", borderRadius: 6, fontSize: 13, color: "#1e40af", fontWeight: "500" }}>
              Current Stage: <strong>{patient.stage}</strong>
            </div>
          </SectionCard>

          {/* READINESS CARD */}
          <SectionCard title="Readiness">
            <div style={{ paddingTop: 8 }}>
              <ReadinessMeter value={patient.readiness} />
              <div style={{ marginTop: 16, padding: "12px", background: patient.readiness < 40 ? "#fee2e2" : patient.readiness < 80 ? "#fef3c7" : "#dcfce7", borderRadius: 6, fontSize: 13, fontWeight: "500", color: patient.readiness < 40 ? "#991b1b" : patient.readiness < 80 ? "#92400e" : "#166534" }}>
                {patient.readiness < 40 ? "🔴 Not Ready" : patient.readiness < 80 ? "🟡 In Progress" : "🟢 Ready"}
              </div>
            </div>
          </SectionCard>
        </div>

        {/* OTHER CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 20 }}>
          <Card title="Recent Visits">
            {d.visits.length > 0 ? d.visits.map((v, i) => <div key={i}>• {v.type}</div>) : <div>No visits</div>}
          </Card>
          <Card title="Care Gaps">
            {d.careGaps.length > 0 ? d.careGaps.map((g, i) => <div key={i}>• {g}</div>) : <div>No gaps</div>}
          </Card>
          <Card title="Allergies">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ color: "green", fontWeight: "bold", marginBottom: 4 }}>Reconciled:</div>
                {d.allergies.reconciled.length > 0 ? d.allergies.reconciled.map((a, i) => <div key={i}>• {a}</div>) : <div>• None</div>}
              </div>
              <div>
                <div style={{ color: "red", fontWeight: "bold", marginBottom: 4 }}>Unreconciled:</div>
                {d.allergies.unreconciled.length > 0 ? d.allergies.unreconciled.map((a, i) => <div key={i}>• {a}</div>) : <div>• None</div>}
              </div>
            </div>
          </Card>
          <Card title="Medications">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ color: "green", fontWeight: "bold", marginBottom: 4 }}>Reconciled:</div>
                {d.medications.reconciled.length > 0 ? d.medications.reconciled.map((m, i) => <div key={i}>• {m}</div>) : <div>• None</div>}
              </div>
              <div>
                <div style={{ color: "red", fontWeight: "bold", marginBottom: 4 }}>Unreconciled:</div>
                {d.medications.unreconciled.length > 0 ? d.medications.unreconciled.map((m, i) => <div key={i}>• {m}</div>) : <div>• None</div>}
              </div>
            </div>
          </Card>
          <Card title="Immunizations">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ color: "green", fontWeight: "bold", marginBottom: 4 }}>Reconciled:</div>
                {d.immunizations.reconciled.length > 0 ? d.immunizations.reconciled.map((im, i) => <div key={i}>• {im}</div>) : <div>• None</div>}
              </div>
              <div>
                <div style={{ color: "red", fontWeight: "bold", marginBottom: 4 }}>Unreconciled:</div>
                {d.immunizations.unreconciled.length > 0 ? d.immunizations.unreconciled.map((im, i) => <div key={i}>• {im}</div>) : <div>• None</div>}
              </div>
            </div>
          </Card>
          <Card title="Nurse Summary">• {d.nurseSummary}</Card>
        </div>

        {/* ROI TABLE */}
        <div style={{ ...card, marginTop: 20 }}>
          <h3 style={{ textAlign: "left", marginTop: 0, marginBottom: 16, fontSize: 16, fontWeight: "700" }}>Requested ROI</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr>
                {["ID", "Facility", "Requested Date", "Status"].map(h => (
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {d.roi.map(r => (
                <tr key={r.id}>
                  <td style={td}>{r.id}</td>
                  <td style={td}>{r.facility}</td>
                  <td style={td}>{r.requestedDate}</td>
                  <td style={td}>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          style={{
            ...primaryBtn,
            display: "inline-block",
            alignSelf: "flex-start",
            minWidth: 0,
            marginTop: 16,
            padding: "8px 12px",
            fontSize: 13
          }}
          onClick={onCreateROI}
        >
          New ROI Request
        </button>
      </div>
    </div>
  );
}

// ============ CREATE ROI PAGE ============
interface CreateROIPageProps {
  patient: Patient;
  onBack: () => void;
  onSubmit: (roi: { id: number; facility: string; requestedDate: string; status: string }) => void;
}

function CreateROIPage({ patient, onBack, onSubmit }: CreateROIPageProps): JSX.Element {
  const [facilityName, setFacilityName] = useState<string>("");
  const [facilityFax, setFacilityFax] = useState<string>("");
  const [roiType, setROIType] = useState<string>("Patient Signature Required");
  const [records, setRecords] = useState<RecordsState>({
    behavioralHealth: false,
    emergencyDept: false,
    operativeNotes: false,
    providerNotes: false,
    therapyNotes: false,
    otherDocument: ""
  });
  const [additional, setAdditional] = useState<AdditionalState>({
    allergyList: false,
    immunizations: false,
    medicationList: false,
    labResults: false,
    hivLab: false,
    geneticTesting: false,
    pathology: false,
    ekg: false,
    radiologyReport: false,
    radiologyImages: false,
    billingInfo: false
  });
  const [substance, setSubstance] = useState<SubstanceState>({
    assessment: false,
    historyPhysical: false,
    multidisciplinaryNotes: false,
    familyParticipation: false,
    questionnaires: false,
    treatmentSummary: false,
    treatmentPlans: false,
    other: ""
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1000, margin: "0 auto", paddingLeft: 24, paddingRight: 24 }}>
      <button style={backBtn} onClick={onBack}>← Back</button>
      <h2 style={{ textAlign: "center", marginBottom: 0, color: "#222" }}>New ROI Request</h2>
      <div style={{ textAlign: "center", color: "#222", marginBottom: 16 }}>
        Patient Name: <span style={{ color: "#222" }}>{patient.name}</span>
      </div>

      <div style={card}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <div>
            <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: "bold" }}>ROI Type</label>
            <select style={input} value={roiType} onChange={e => setROIType(e.target.value)}>
              <option>Patient Signature Required</option>
              <option>Facility To Facility</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: "bold" }}>Facility Name</label>
            <input style={input} value={facilityName} onChange={e => setFacilityName(e.target.value)} placeholder="Enter facility name" />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: "bold" }}>Facility Fax</label>
            <input style={input} value={facilityFax} onChange={e => setFacilityFax(e.target.value)} placeholder="Enter facility fax" />
          </div>
        </div>
      </div>

      <SectionCard title="Records to be Released">
        <div style={grid2}>
          <Checkbox label="Behavioral Health" obj={records} k="behavioralHealth" set={setRecords}/>
          <Checkbox label="Emergency Dept" obj={records} k="emergencyDept" set={setRecords}/>
          <Checkbox label="Operative Notes" obj={records} k="operativeNotes" set={setRecords}/>
          <Checkbox label="Provider Notes" obj={records} k="providerNotes" set={setRecords}/>
          <Checkbox label="Therapy Notes" obj={records} k="therapyNotes" set={setRecords}/>
          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Other</label>
            <input style={input} value={records.otherDocument} onChange={e => setRecords({ ...records, otherDocument: e.target.value })} placeholder="Specify other records"/>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Additional Records">
        <div style={grid3}>
          {(Object.keys(additional) as Array<keyof AdditionalState>).map(key =>
            <Checkbox key={key} label={String(key).replace(/([A-Z])/g, ' $1')} obj={additional} k={key} set={setAdditional}/>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Substance Abuse Records">
        <div style={grid2}>
          {(Object.keys(substance) as Array<keyof SubstanceState>).map(key =>
            key === "other"
              ? <div key={key}><label style={{ display: "block", marginBottom: 4, fontSize: 14 }}>Other</label><input style={input} placeholder="" value={substance[key] as string} onChange={e => setSubstance({ ...substance, other: e.target.value })}/></div>
              : <Checkbox<SubstanceState> key={key} label={String(key).replace(/([A-Z])/g, ' $1')} obj={substance} k={key} set={setSubstance}/>
          )}
        </div>
      </SectionCard>

      <button
        style={{
          ...primaryBtn,
          display: "inline-block",
          alignSelf: "flex-start",
          minWidth: 0,
          marginTop: 8,
          padding: "8px 12px",
          fontSize: 13
        }}
        onClick={() =>
          onSubmit({
            id: Date.now(),
            facility: facilityName,
            requestedDate: new Date().toISOString().split('T')[0],
            status: roiType
          })
        }
      >
        Trigger ROI Request
      </button>
    </div>
  );
}

// ============ DASHBOARD PAGE ============
interface DashboardPageProps {
  patients: Patient[];
}

function DashboardPage({ patients }: DashboardPageProps): JSX.Element {
  const totalUpcoming = patients.filter(p => p.status !== "Completed").length;
  const totalCompleted = patients.filter(p => p.status === "Completed").length;
  const newCount = patients.filter(p => p.status === "New").length;
  const inProgressCount = patients.filter(p => p.status === "In Progress").length;
  const completedCount = patients.filter(p => p.status === "Completed").length;

  const aprnStats: Record<string, { total: number; pending: number; completed: number }> = {};
  visitsToday.forEach(v => {
    if (!aprnStats[v.nurse]) {
      aprnStats[v.nurse] = { total: 0, pending: 0, completed: 0 };
    }
    aprnStats[v.nurse].total++;
    if (v.status === "Pending") {
      aprnStats[v.nurse].pending++;
    } else {
      aprnStats[v.nurse].completed++;
    }
  });

  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ color: "#1f2937", margin: 0, fontSize: 32, fontWeight: "bold", letterSpacing: "-0.5px" }}>Intake Summary</h2>
        <div style={{ fontSize: 14, color: "#6b7280" }}>Last updated: {new Date().toLocaleDateString()}</div>
      </div>
      
      {/* SINGLE ROW - 2 COLUMNS WITH IMPROVED SPACING */}
      <div style={{ display: "grid", gridTemplateColumns: "490px 1fr", gap: 32, marginBottom: 48 }}>
        {/* First column: Total Upcoming, Total Completed, and Stage/Status Distribution stacked */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Upcoming and Completed side by side */}
          <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
            <div style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", borderRadius: 14, padding: 18, boxShadow: "0 4px 16px rgba(59, 130, 246, 0.15)", border: "1px solid rgba(255,255,255,0.12)", flex: 1, transition: "all 0.3s ease", cursor: "pointer" }} onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 28px rgba(59, 130, 246, 0.25)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(59, 130, 246, 0.15)"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", marginBottom: 8, fontWeight: "600", letterSpacing: "0.4px", textTransform: "uppercase" }}>Upcoming</div>
                  <div style={{ fontSize: 40, fontWeight: "800", color: "#fff", lineHeight: 1 }}>{totalUpcoming}</div>
                </div>
                <div style={{ fontSize: 44, opacity: 0.15, marginTop: -4 }}>📋</div>
              </div>
            </div>
            <div style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", borderRadius: 14, padding: 18, boxShadow: "0 4px 16px rgba(16, 185, 129, 0.15)", border: "1px solid rgba(255,255,255,0.12)", flex: 1, transition: "all 0.3s ease", cursor: "pointer" }} onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 28px rgba(16, 185, 129, 0.25)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(16, 185, 129, 0.15)"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", marginBottom: 8, fontWeight: "600", letterSpacing: "0.4px", textTransform: "uppercase" }}>Completed</div>
                  <div style={{ fontSize: 40, fontWeight: "800", color: "#fff", lineHeight: 1 }}>{totalCompleted}</div>
                </div>
                <div style={{ fontSize: 44, opacity: 0.15, marginTop: -4 }}>✅</div>
              </div>
            </div>
          </div>

          {/* Stage Distribution */}
          <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #eff6fc", display: "flex", flexDirection: "column", justifyContent: "center", transition: "all 0.3s ease" }} onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 28px rgba(0,0,0,0.12)"} onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"}>
            <h4 style={{ textAlign: "left", marginTop: 0, marginBottom: 12, fontSize: 14, fontWeight: "700", color: "#1f2937", letterSpacing: "0.2px" }}>Stage Distribution</h4>
            <PieChart data={stages.map((stage, i) => ({
              label: stage,
              value: patients.filter(p => p.stage === stage).length,
              color: colors[i]
            }))}/>
          </div>

          {/* Status Overview */}
          <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #eff6fc", display: "flex", flexDirection: "column", justifyContent: "center", transition: "all 0.3s ease" }} onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 28px rgba(0,0,0,0.12)"} onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"}>
            <h4 style={{ textAlign: "left", marginTop: 0, marginBottom: 12, fontSize: 14, fontWeight: "700", color: "#1f2937", letterSpacing: "0.2px" }}>Status Overview</h4>
            <PieChart data={[
              { label: "New", value: newCount, color: "#2563eb" },
              { label: "In Progress", value: inProgressCount, color: "#facc15" },
              { label: "Completed", value: completedCount, color: "#16a34a" }
            ]}/>
          </div>
        </div>

        {/* Second column - Weekly Visits Trend */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "28px 28px 28px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #eff6fc", display: "flex", flexDirection: "column", transition: "all 0.3s ease" }} onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 28px rgba(0,0,0,0.12)"} onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h4 style={{ textAlign: "left", marginTop: 0, marginBottom: 0, fontSize: 15, fontWeight: "700", color: "#1f2937", letterSpacing: "0.2px" }}>Weekly Visits Trend - YTD</h4>
            <div style={{ display: "flex", gap: 24, fontSize: 13 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 16, height: 16, background: "#10b981", opacity: 0.6, borderRadius: 2 }}/>
                <span style={{ color: "#6b7280" }}>AHT (minutes)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 16, height: 2, background: "#2563eb" }}/>
                <span style={{ color: "#6b7280" }}>Visits</span>
              </div>
            </div>
          </div>
          <div style={{ position: "relative", flex: 1, minHeight: 380 }}>
            <svg width="100%" height="100%" viewBox="0 0 1000 400" preserveAspectRatio="none" style={{ position: "absolute", top: 0, left: 0 }}>
              {[0, 25, 50, 75, 100].map((y, i) => (
                <line key={`grid-${i}`} x1="60" y1={360 - (y / 100) * 320} x2="1000" y2={360 - (y / 100) * 320} stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5" opacity="0.6"/>
              ))}
              {/* Left Y-axis labels for Visits */}
              {[0, 20, 40, 60, 80, 100].map((val, i) => (
                <text key={`label-visits-${i}`} x="40" y={365 - (val / 100) * 320} fontSize="12" fill="#2563eb" textAnchor="end" fontWeight="500">{val}</text>
              ))}
              {/* Right Y-axis labels for AHT */}
              {[0, 6, 12, 18, 24, 30].map((val, i) => (
                <text key={`label-aht-${i}`} x="970" y={365 - (val / 30) * 320} fontSize="12" fill="#10b981" textAnchor="start" fontWeight="500">{val}</text>
              ))}
              {/* Y-axis titles */}
              <text x="15" y="200" fontSize="14" fill="#2563eb" fontWeight="600" textAnchor="middle" transform="rotate(-90 15 200)">Visit Count</text>
              <text x="985" y="200" fontSize="14" fill="#10b981" fontWeight="600" textAnchor="middle" transform="rotate(90 985 200)">AHT (minutes)</text>
              {/* Bars for AHT */}
              {weeklyVisits.map((item, i) => {
                const barWidth = 40;
                const x = 60 + (i / (weeklyVisits.length - 1)) * 880 - (barWidth / 2);
                const barHeight = (item.aht / 30) * 320;
                const y = 360 - barHeight;
                return (
                  <rect
                    key={`bar-${i}`}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill="#10b981"
                    opacity="0.6"
                  />
                );
              })}
              {/* Line */}
              <polyline
                points={weeklyVisits.map((item, i) => {
                  const x = 60 + (i / (weeklyVisits.length - 1)) * 880;
                  const y = 360 - (item.visits / 100) * 320;
                  return `${x},${y}`;
                }).join(" ")}
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Line Points */}
              {weeklyVisits.map((item, i) => {
                const x = 60 + (i / (weeklyVisits.length - 1)) * 880;
                const y = 360 - (item.visits / 100) * 320;
                return (
                  <g key={`point-${i}`}>
                    <circle cx={x} cy={y} r="7" fill="#fff" stroke="#2563eb" strokeWidth="3"/>
                    <text x={x} y={y - 20} fontSize="14" fill="#1e40af" textAnchor="middle" fontWeight="bold">{item.visits}</text>
                  </g>
                );
              })}
              {/* Week Labels */}
              {weeklyVisits.map((item, i) => {
                const x = 60 + (i / (weeklyVisits.length - 1)) * 880;
                return (
                  <text key={`week-${i}`} x={x} y={390} fontSize="16" fill="#9ca3af" textAnchor="middle" fontWeight="500">{item.week}</text>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* TWO COLUMN LAYOUT - NURSE & ROI */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {/* Nurse Visit Assignments */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 28, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #eff6fc", transition: "all 0.3s ease" }} onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 28px rgba(0,0,0,0.12)"} onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"}>
          <h4 style={{ textAlign: "left", marginTop: 0, marginBottom: 20, fontSize: 15, fontWeight: "700", color: "#1f2937", letterSpacing: "0.2px" }}>Nurse Visit Assignments</h4>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "linear-gradient(90deg, #f9fafb 0%, #f3f4f6 100%)", borderBottom: "2px solid #e5e7eb" }}>
                <th style={{ ...th, fontWeight: "700", color: "#1f2937", padding: 14, fontSize: 12, borderRadius: "6px 0 0 0" }}>Nurse</th>
                <th style={{ ...th, fontWeight: "700", color: "#1f2937", padding: 14, fontSize: 12 }}>Pending</th>
                <th style={{ ...th, fontWeight: "700", color: "#1f2937", padding: 14, fontSize: 12 }}>Completed</th>
                <th style={{ ...th, fontWeight: "700", color: "#1f2937", padding: 14, fontSize: 12, borderRadius: "0 6px 0 0" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(aprnStats).map(([nurse, stats], idx) => (
                <tr key={nurse} style={{ background: idx % 2 === 0 ? "#fff" : "#f9fafb", borderBottom: "1px solid #f0f0f0", transition: "background 0.2s" }} onMouseEnter={(e) => (e.currentTarget as HTMLTableRowElement).style.background = "#f0f9ff"} onMouseLeave={(e) => (e.currentTarget as HTMLTableRowElement).style.background = idx % 2 === 0 ? "#fff" : "#f9fafb"}>
                  <td style={{ ...td, fontSize: 13, padding: 14, fontWeight: "600", color: "#1f2937" }}>{nurse}</td>
                  <td style={{ ...td, fontSize: 13, textAlign: "center", color: "#dc2626", fontWeight: "bold", padding: 14 }}>
                    <div style={{ background: "#fee2e2", padding: "6px 12px", borderRadius: 6, display: "inline-block", minWidth: "30px", fontSize: 12 }}>{stats.pending}</div>
                  </td>
                  <td style={{ ...td, fontSize: 13, textAlign: "center", color: "#16a34a", fontWeight: "bold", padding: 14 }}>
                    <div style={{ background: "#dcfce7", padding: "6px 12px", borderRadius: 6, display: "inline-block", minWidth: "30px", fontSize: 12 }}>{stats.completed}</div>
                  </td>
                  <td style={{ ...td, fontSize: 13, textAlign: "center", fontWeight: "bold", padding: 14, color: "#2563eb" }}>
                    <div style={{ background: "#dbeafe", padding: "6px 12px", borderRadius: 6, display: "inline-block", minWidth: "30px", fontSize: 12 }}>{stats.total}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent ROI Requests */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 28, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #eff6fc", transition: "all 0.3s ease" }} onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 28px rgba(0,0,0,0.12)"} onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"}>
          <h4 style={{ textAlign: "left", marginTop: 0, marginBottom: 20, fontSize: 15, fontWeight: "700", color: "#1f2937", letterSpacing: "0.2px" }}>Recent ROI Requests</h4>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "linear-gradient(90deg, #f9fafb 0%, #f3f4f6 100%)", borderBottom: "2px solid #e5e7eb" }}>
                <th style={{ ...th, fontWeight: "700", color: "#1f2937", padding: 14, fontSize: 12, borderRadius: "6px 0 0 0" }}>Patient</th>
                <th style={{ ...th, fontWeight: "700", color: "#1f2937", padding: 14, fontSize: 12 }}>Facility</th>
                <th style={{ ...th, fontWeight: "700", color: "#1f2937", padding: 14, fontSize: 12 }}>Date</th>
                <th style={{ ...th, fontWeight: "700", color: "#1f2937", textAlign: "center", padding: 14, fontSize: 12, borderRadius: "0 6px 0 0" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {roiRequests.map((roi, idx) => (
                <tr key={roi.id} style={{ background: idx % 2 === 0 ? "#fff" : "#f9fafb", borderBottom: "1px solid #f0f0f0", transition: "background 0.2s" }} onMouseEnter={(e) => (e.currentTarget as HTMLTableRowElement).style.background = "#f0f9ff"} onMouseLeave={(e) => (e.currentTarget as HTMLTableRowElement).style.background = idx % 2 === 0 ? "#fff" : "#f9fafb"}>
                  <td style={{ ...td, fontSize: 13, padding: 14, fontWeight: "600", color: "#1f2937" }}>{roi.patient}</td>
                  <td style={{ ...td, fontSize: 13, padding: 14, color: "#6b7280" }}>{roi.facility}</td>
                  <td style={{ ...td, fontSize: 13, padding: 14, color: "#6b7280" }}>{roi.requestedDate}</td>
                  <td style={{ ...td, fontSize: 12, textAlign: "center", padding: 14 }}>
                    <span style={{ 
                      padding: "6px 12px", 
                      borderRadius: "6px", 
                      background: roi.status === "Completed" ? "#dcfce7" : roi.status === "Sent to Facility" ? "#dbeafe" : "#fee2e2",
                      color: roi.status === "Completed" ? "#166534" : roi.status === "Sent to Facility" ? "#1e40af" : "#991b1b",
                      fontWeight: "600",
                      fontSize: 11,
                      display: "inline-block"
                    }}>
                      {roi.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}