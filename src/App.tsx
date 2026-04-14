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
  { id: 3, name: "Michael Lee", mrn: "MRN-003", date: "2026-04-05", provider: "Dr. Brown", nurse: "Emily Rodriguez, RN", stage: "Data Prepared", status: "New", exception: "None", readiness: 45 },
  { id: 4, name: "Sarah Johnson", mrn: "MRN-004", date: "2026-04-12", provider: "Dr. Wilson", nurse: "James Patterson, RN", stage: "Data Validated", status: "In Progress", exception: "Insurance Verification", readiness: 55 },
  { id: 5, name: "Robert Martinez", mrn: "MRN-005", date: "2026-04-13", provider: "Dr. Garcia", nurse: "Lisa Wong, RN", stage: "Data Validated", status: "In Progress", exception: "None", readiness: 75 },
  { id: 6, name: "Emily Chen", mrn: "MRN-006", date: "2026-04-14", provider: "Dr. Taylor", nurse: "David Kumar, RN", stage: "Patient Record Updated", status: "In Progress", exception: "Pending Approval", readiness: 50 },
  { id: 7, name: "David Thompson", mrn: "MRN-007", date: "2026-04-15", provider: "Dr. Anderson", nurse: "Jennifer Lee, RN", stage: "Data Prepared", status: "New", exception: "None", readiness: 20 },
  { id: 8, name: "Lisa Anderson", mrn: "MRN-008", date: "2026-04-16", provider: "Dr. Martinez", nurse: "Robert Thompson, RN", stage: "Data Validated", status: "In Progress", exception: "Lab Results Pending", readiness: 65 },
  { id: 9, name: "Kevin Wilson", mrn: "MRN-017", date: "2026-04-17", provider: "Dr. Harris", nurse: "Sarah Johnson, RN", stage: "Data Prepared", status: "New", exception: "None", readiness: 30 },
  { id: 10, name: "Patricia Brown", mrn: "MRN-018", date: "2026-04-18", provider: "Dr. Clark", nurse: "Michael Chen, RN", stage: "Data Validated", status: "In Progress", exception: "Insurance Pending", readiness: 55 },
  
  // COMPLETED VISITS - Historical Data
  { id: 11, name: "James Wilson", mrn: "MRN-009", date: "2026-04-04", provider: "Dr. Harris", nurse: "Sarah Johnson, RN", stage: "Readiness Evaluated", status: "Completed", exception: "None", readiness: 100 },
  { id: 12, name: "Patricia Moore", mrn: "MRN-010", date: "2026-04-03", provider: "Dr. Clark", nurse: "Michael Chen, RN", stage: "Readiness Evaluated", status: "Completed", exception: "None", readiness: 100 },
  { id: 13, name: "Christopher Davis", mrn: "MRN-011", date: "2026-04-02", provider: "Dr. Lewis", nurse: "Emily Rodriguez, RN", stage: "Readiness Evaluated", status: "Completed", exception: "None", readiness: 100 },
  { id: 14, name: "Jennifer Martinez", mrn: "MRN-012", date: "2026-04-01", provider: "Dr. Walker", nurse: "James Patterson, RN", stage: "Readiness Evaluated", status: "Completed", exception: "None", readiness: 100 },
  { id: 15, name: "Daniel Rodriguez", mrn: "MRN-013", date: "2026-03-31", provider: "Dr. Young", nurse: "Lisa Wong, RN", stage: "Readiness Evaluated", status: "Completed", exception: "None", readiness: 100 },
  { id: 16, name: "Maria Garcia", mrn: "MRN-014", date: "2026-03-30", provider: "Dr. Hernandez", nurse: "David Kumar, RN", stage: "Readiness Evaluated", status: "Completed", exception: "None", readiness: 100 },
  { id: 17, name: "Thomas Anderson", mrn: "MRN-015", date: "2026-03-29", provider: "Dr. Lopez", nurse: "Jennifer Lee, RN", stage: "Readiness Evaluated", status: "Completed", exception: "None", readiness: 100 },
  { id: 18, name: "Angela Thomas", mrn: "MRN-016", date: "2026-03-28", provider: "Dr. Martinez", nurse: "Robert Thompson, RN", stage: "Readiness Evaluated", status: "Completed", exception: "None", readiness: 100 }
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
const card: React.CSSProperties = { 
  background: "#fff", 
  padding: 24, 
  border: "1px solid #e0e7ff", 
  borderRadius: 12, 
  boxShadow: "0 2px 8px rgba(59, 130, 246, 0.08), 0 1px 3px rgba(0,0,0,0.05)",
  transition: "all 0.3s ease"
};

const input: React.CSSProperties = { 
  width: "100%", 
  padding: "11px 13px", 
  fontSize: 14, 
  marginTop: 6, 
  border: "1.5px solid #e0e7ff", 
  borderRadius: 8, 
  background: "#f8fafc",
  color: "#1f2937",
  transition: "all 0.3s ease",
  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.02)"
};

const grid2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 };
const grid3: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 };

const primaryBtn: React.CSSProperties = { 
  padding: "12px 28px", 
  fontSize: 14, 
  fontWeight: 600,
  background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)", 
  color: "#fff", 
  border: "none", 
  borderRadius: 8,
  cursor: "pointer", 
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
  minWidth: "fit-content",
  whiteSpace: "nowrap",
  letterSpacing: "0.3px"
};

const backBtn: React.CSSProperties = { 
  padding: "11px 18px", 
  fontSize: 13, 
  fontWeight: 600,
  background: "#f8fafc", 
  color: "#374151", 
  border: "1.5px solid #e0e7ff", 
  borderRadius: 8, 
  cursor: "pointer", 
  transition: "all 0.3s ease",
  alignSelf: "flex-start",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
};

const th: React.CSSProperties = { 
  padding: 14, 
  textAlign: "left", 
  borderBottom: "2px solid #e5e7eb", 
  fontSize: 12, 
  fontWeight: 700, 
  color: "#374151",
  textTransform: "uppercase",
  letterSpacing: "0.05em"
};

const td: React.CSSProperties = { 
  padding: 14, 
  textAlign: "left", 
  borderBottom: "1px solid #f3f4f6", 
  fontSize: 13, 
  color: "#475569" 
};

// ============ COMPONENTS ============
interface CardProps {
  title: string;
  children: React.ReactNode;
}

function Card({ title, children }: CardProps): JSX.Element {
  return (
    <div style={card}>
      <h4 style={{ textAlign: "left", marginTop: 0, marginBottom: 16, fontSize: 15, fontWeight: "700", color: "#1f2937", letterSpacing: "-0.025em" }}>{title}</h4>
      <div style={{ textAlign: "left", fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>{children}</div>
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
      <h3 style={{ marginTop: 0, marginBottom: 20, textAlign: "left", fontSize: 17, fontWeight: "700", color: "#1f2937", letterSpacing: "-0.025em" }}>{title}</h3>
      <div style={{ textAlign: "left", fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>{children}</div>
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
    <label style={{ display: "flex", gap: 10, textAlign: "left", fontSize: 14, alignItems: "center", cursor: "pointer", userSelect: "none" }}>
      <input 
        type="checkbox" 
        checked={isChecked}
        onChange={(e) => set({ ...obj, [k]: e.target.checked } as T)} 
        style={{ 
          accentColor: "#2563eb", 
          width: 18, 
          height: 18, 
          cursor: "pointer",
          flexShrink: 0
        }}
      />
      <span style={{ color: "#374151" }}>{label}</span>
    </label>
  );
}

interface ReadinessMeterProps {
  value: number;
}

function ReadinessMeter({ value }: ReadinessMeterProps): JSX.Element {
  const color = value < 40 ? "#ef4444" : value < 80 ? "#f59e0b" : "#10b981";
  const statusText = value < 40 ? "Not Ready" : value < 80 ? "In Progress" : "Ready";
  const statusEmoji = value < 40 ? "🔴" : value < 80 ? "🟡" : "🟢";
  
  return (
    <div style={{ textAlign: "left", fontSize: 14 }}>
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 18, fontWeight: "700", color: color }}>{value}%</span>
      </div>
      <div style={{ background: "#e5e7eb", height: 8, borderRadius: 4, overflow: "hidden" }}>
        <div style={{ 
          width: value + "%", 
          height: 8, 
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: 4,
          transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
        }}/>
      </div>
      <div style={{ marginTop: 12, padding: "10px 12px", background: color + "15", borderLeft: `3px solid ${color}`, borderRadius: 4, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 16 }}>{statusEmoji}</span>
        <span style={{ color: color, fontWeight: 600 }}>{statusText}</span>
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
        <path d={pathData} fill={item.color} stroke="#fff" strokeWidth="2" opacity="0.9"/>
      </g>
    );
  });
  
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, justifyContent: "center" }}>
      <svg width="140" height="140" viewBox="0 0 100 100">
        {slices}
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
        {data.map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 12, height: 12, background: item.color, borderRadius: 3 }}/>
            <span style={{ color: "#475569" }}>
              <strong style={{ color: "#1f2937" }}>{item.label}:</strong> {item.value}
            </span>
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
  const [nurseFilter, setNurseFilter] = useState<string>("");

  const filtered = patients.filter(p =>
    view === "completed" ? p.status === "Completed" : view === "upcoming" ? p.status !== "Completed" : true
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f9fafb" }}>
      {/* ENHANCED HEADER */}
      <div style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)", padding: "32px 40px", boxShadow: "0 10px 40px rgba(37, 99, 235, 0.15)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <h1 style={{ color: "#fff", margin: 0, fontSize: 36, fontWeight: "900", letterSpacing: "-0.015em", textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>Family Medicine Intake Portal</h1>
        <p style={{ color: "rgba(255,255,255,0.9)", marginTop: 8, fontSize: 14, fontWeight: 500, letterSpacing: "0.01em" }}>Streamlined Intake Portal and ROI Coordination</p>
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        {/* SIDEBAR */}
        <div style={{ width: 280, background: "linear-gradient(180deg, #f0f1f3 0%, #e5e7eb 100%)", borderRight: "2px solid #d1d5db", padding: "32px 0", boxShadow: "2px 0 8px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: "8px" }}>
          {(["dashboard", "upcoming", "completed"] as const).map(tabView => {
            const labels = {
              dashboard: "Dashboard",
              upcoming: "Upcoming",
              completed: "Completed"
            };
            return (
              <div 
                key={tabView}
                style={{
                  padding: "16px 20px", 
                  cursor: "pointer",
                  background: view === tabView ? "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)" : "transparent",
                  color: view === tabView ? "#1e40af" : "#4b5563",
                  fontWeight: view === tabView ? "700" : "500",
                  fontSize: 16,
                  borderRadius: "8px",
                  transition: "all 0.3s ease-in-out",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: "0",
                  marginLeft: "12px",
                  marginRight: "12px",
                  borderLeft: view === tabView ? "4px solid #2563eb" : "4px solid transparent",
                  letterSpacing: "0.3px",
                  boxShadow: view === tabView ? "0 4px 12px rgba(37, 99, 235, 0.12)" : "none",
                  textTransform: "uppercase",
                  position: "relative",
                  overflow: "hidden"
                }}
                onClick={() => {
                  setView(tabView);
                  setSelectedPatient(null);
                  setShowROI(false);
                  setNurseFilter("");
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  if (view !== tabView) {
                    el.style.background = "#f3f4f6";
                    el.style.color = "#1f2937";
                    el.style.transform = "translateX(4px)";
                    el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                  }
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  if (view !== tabView) {
                    el.style.background = "transparent";
                    el.style.color = "#4b5563";
                    el.style.transform = "translateX(0)";
                    el.style.boxShadow = "none";
                  }
                }}
              >
                <span>{labels[tabView]}</span>
              </div>
            );
          })}
        </div>

        {/* MAIN CONTENT */}
        <div style={{ flex: 1, padding: "32px 40px", maxWidth: "none", margin: "0", width: "100%", overflowY: "auto" }}>
          {!selectedPatient ? (
            view === "dashboard" ? (
              <DashboardPage patients={patients} onNavigateToUpcoming={(nurseName) => {
                setView("upcoming");
                setSelectedPatient(null);
                setShowROI(false);
                setNurseFilter(nurseName || "");
              }} onNavigateToCompleted={() => {
                setView("completed");
                setSelectedPatient(null);
                setShowROI(false);
                setNurseFilter("");
              }} />
            ) : (
              <QueuePage patients={filtered} onSelect={setSelectedPatient} initialNurseFilter={nurseFilter} />
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
    </div>
  );
}

// ============ QUEUE PAGE ============
interface QueuePageProps {
  patients: Patient[];
  onSelect: (patient: Patient) => void;
  initialNurseFilter?: string;
}

function QueuePage({ patients, onSelect, initialNurseFilter = "" }: QueuePageProps): JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [stageFilter, setStageFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [providerFilter, setProviderFilter] = useState<string>("");
  const [nurseFilterLocal, setNurseFilterLocal] = useState<string>(initialNurseFilter);

  const isCompleted = patients.length > 0 && patients[0].status === "Completed";
  const header = isCompleted ? "Completed Visits" : "Upcoming Visits";

  // Get unique values for filters
  const uniqueStages = Array.from(new Set(patients.map(p => p.stage)));
  const uniqueStatuses = Array.from(new Set(patients.map(p => p.status)));
  const uniqueProviders = Array.from(new Set(patients.map(p => p.provider)));
  const uniqueNurses = Array.from(new Set(patients.map(p => p.nurse)));

  // Filter patients based on criteria
  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.nurse.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = !stageFilter || p.stage === stageFilter;
    const matchesStatus = !statusFilter || p.status === statusFilter;
    const matchesProvider = !providerFilter || p.provider === providerFilter;
    const matchesNurse = !nurseFilterLocal || p.nurse === nurseFilterLocal;
    
    return matchesSearch && matchesStage && matchesStatus && matchesProvider && matchesNurse;
  });

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
    <div style={{ display: "flex", flexDirection: "column", gap: 0, minHeight: "100vh" }}>
      {/* PAGE HEADER */}
      <div style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)", padding: "40px 40px", marginBottom: "0", borderBottom: "2px solid #bfdbfe", position: "relative", overflow: "hidden" }}>
        <div>
          <h2 style={{ color: "#0f172a", textAlign: "left", marginBottom: 6, fontSize: 44, fontWeight: 950, letterSpacing: "-0.025em", position: "relative", zIndex: 1, lineHeight: 1.1 }}>
            {header}
          </h2>
          <p style={{ color: "#64748b", fontSize: 16, margin: 0, fontWeight: 500, position: "relative", zIndex: 1, lineHeight: 1.5 }}>
            {header === "Completed Visits" ? "Review and analyze past patient visits" : "Review upcoming visits and manage schedules"}
          </p>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div style={{ flex: 1, padding: "32px 40px", overflowY: "auto" }}>
        <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ background: "#f0f9ff", padding: "12px 20px", borderRadius: 8, fontSize: 14, color: "#1e40af", fontWeight: 600, display: "inline-block", border: "1px solid #bfdbfe" }}>
              Total Records: <strong style={{ color: "#1e40af", fontSize: 16 }}>{filteredPatients.length}</strong> of <strong style={{ color: "#1e40af", fontSize: 16 }}>{patients.length}</strong>
            </div>
          </div>
        </div>

      {/* Filter Controls */}
      <div style={{ background: "linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)", borderRadius: 14, padding: 24, marginBottom: 32, border: "2px solid #bfdbfe", boxShadow: "0 2px 8px rgba(59, 130, 246, 0.05)" }}>
        <h3 style={{ color: "#1f2937", fontSize: 13, fontWeight: 800, marginBottom: 20, marginTop: 0, letterSpacing: "0.8px", textTransform: "uppercase", lineHeight: 1.4 }}>Filter Records</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: "#334155", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px", lineHeight: 1.3 }}>Search</label>
            <input
              type="text"
              placeholder="Name, MRN, or Nurse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ ...input, marginTop: 0, borderRadius: 8, fontSize: 14 }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: "#334155", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px", lineHeight: 1.3 }}>Stage</label>
            <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} style={{ ...input, marginTop: 0, background: "#fff", borderRadius: 8, fontSize: 14 }}>
              <option value="">All Stages</option>
              {uniqueStages.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: "#334155", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px", lineHeight: 1.3 }}>Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ ...input, marginTop: 0, background: "#fff", borderRadius: 8, fontSize: 14 }}>
              <option value="">All Statuses</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: "#334155", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px", lineHeight: 1.3 }}>Provider</label>
            <select value={providerFilter} onChange={(e) => setProviderFilter(e.target.value)} style={{ ...input, marginTop: 0, background: "#fff", borderRadius: 8, fontSize: 14 }}>
              <option value="">All Providers</option>
              {uniqueProviders.map(provider => (
                <option key={provider} value={provider}>{provider}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: "#334155", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px", lineHeight: 1.3 }}>Nurse</label>
            <select value={nurseFilterLocal} onChange={(e) => setNurseFilterLocal(e.target.value)} style={{ ...input, marginTop: 0, background: "#fff", borderRadius: 8, fontSize: 14 }}>
              <option value="">All Nurses</option>
              {uniqueNurses.map(nurse => (
                <option key={nurse} value={nurse}>{nurse}</option>
              ))}
            </select>
          </div>
        </div>

        {(searchTerm || stageFilter || statusFilter || providerFilter || nurseFilterLocal) && (
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px", background: "#f0f9ff", borderRadius: 10, border: "1px solid #bfdbfe" }}>
            <div style={{ fontSize: 14, color: "#1e40af", flex: 1, fontWeight: 600 }}>
              📊 Showing <strong>{filteredPatients.length}</strong> of <strong>{patients.length}</strong> records
            </div>
            <button
              onClick={() => {
                setSearchTerm("");
                setStageFilter("");
                setStatusFilter("");
                setProviderFilter("");
                setNurseFilterLocal("");
              }}
              style={{
                padding: "10px 18px",
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(59, 130, 246, 0.2)"
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 16px rgba(59, 130, 246, 0.35)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(59, 130, 246, 0.2)";
              }}
            >
              ✕ Clear Filters
            </button>
          </div>
        )}
      </div>

      <div style={{ background: "#fff", borderRadius: 14, border: "2px solid #bfdbfe", boxShadow: "0 4px 16px rgba(59, 130, 246, 0.06)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)", borderBottom: "2px solid #bfdbfe" }}>
            <tr>
              {["MRN", "Patient", "Date", "Provider", "Nurse", "Stage", "Status", "Readiness"].map(h => (
                <th key={h} style={{...th, fontWeight: 850, color: "#1e293b", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.9px", paddingTop: 16, paddingBottom: 16, lineHeight: 1.2 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((p, idx) => (
              <tr 
                key={p.id} 
                onClick={() => onSelect(p)} 
                style={{
                  cursor: "pointer",
                  background: idx % 2 === 0 ? "#fff" : "#f9fafb",
                  transition: "all 0.2s ease",
                  borderBottom: "1px solid #f0f0f0"
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.background = "#f0f9ff";
                  (e.currentTarget as HTMLTableRowElement).style.boxShadow = "inset 0 0 0 1px #bfdbfe";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.background = idx % 2 === 0 ? "#fff" : "#f9fafb";
                  (e.currentTarget as HTMLTableRowElement).style.boxShadow = "none";
                }}
              >
                <td style={{...td, paddingTop: 14, paddingBottom: 14}}><code style={{ background: "#f3f4f6", padding: "6px 10px", borderRadius: "6px", fontFamily: "monospace", fontWeight: 600, fontSize: 13, color: "#1f2937" }}>{p.mrn}</code></td>
                <td style={{...td, paddingTop: 14, paddingBottom: 14}}><strong style={{ color: "#0f172a", fontSize: 14, fontWeight: 750, letterSpacing: "-0.3px" }}>{p.name}</strong></td>
                <td style={{...td, paddingTop: 14, paddingBottom: 14, fontSize: 13, fontWeight: 600, color: "#334155"}}>{p.date}</td>
                <td style={{...td, paddingTop: 14, paddingBottom: 14, fontSize: 13, fontWeight: 600, color: "#334155"}}>{p.provider}</td>
                <td style={{...td, paddingTop: 14, paddingBottom: 14, fontSize: 13, fontWeight: 600, color: "#334155"}}>{p.nurse}</td>
                <td style={{...td, paddingTop: 14, paddingBottom: 14}}>
                  <span style={{ 
                    padding: "7px 14px", 
                    borderRadius: "8px", 
                    background: getStageColor(p.stage).bg,
                    color: getStageColor(p.stage).text,
                    fontWeight: "800",
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.85px",
                    lineHeight: 1.2
                  }}>
                    {p.stage}
                  </span>
                </td>
                <td style={{...td, paddingTop: 14, paddingBottom: 14}}>
                  <span style={{ 
                    padding: "7px 14px", 
                    borderRadius: "8px", 
                    background: getStatusColor(p.status).bg,
                    color: getStatusColor(p.status).text,
                    fontWeight: "800",
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.85px",
                    lineHeight: 1.2
                  }}>
                    {p.status}
                  </span>
                </td>
                <td style={{ ...td, padding: 14 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ background: "#e5e7eb", height: 7, borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ 
                        width: p.readiness + "%", 
                        height: 7, 
                        background: p.readiness < 40 ? "#ef4444" : p.readiness < 80 ? "#f59e0b" : "#10b981", 
                        borderRadius: 4,
                        transition: "width 0.3s ease"
                      }}/>
                    </div>
                    <div style={{ fontSize: 11, textAlign: "center", color: "#475569", fontWeight: 750, letterSpacing: "0.4px" }}>{p.readiness}%</div>
                  </div>
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
  const [activeTab, setActiveTab] = useState<"intake" | "roi" | "chart">("intake");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <button style={backBtn} onClick={onBack}>← Back</button>

      {/* MAIN LAYOUT WITH SIDEBAR */}
      <div style={{ display: "flex", gap: 20, alignItems: "stretch" }}>
        
        {/* LEFT SIDEBAR - PATIENT INFO */}
        <div style={{
          background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)",
          color: "#fff",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          minWidth: 280,
          maxWidth: 280,
          alignSelf: "stretch",
          wordWrap: "break-word",
          overflowWrap: "break-word"
        }}>
          <div>
            <div style={{ fontSize: 11, opacity: 0.85, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.7, fontWeight: "700" }}>Patient Name</div>
            <div style={{ fontSize: 22, fontWeight: "700", lineHeight: 1.2 }}>{patient.name}</div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 16 }}>
            <div style={{ fontSize: 11, opacity: 0.85, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.7, fontWeight: "700" }}>MRN</div>
            <div style={{ fontSize: 16, fontWeight: "600", fontFamily: "monospace" }}>{patient.mrn}</div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 16 }}>
            <div style={{ fontSize: 11, opacity: 0.85, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.7, fontWeight: "700" }}>Visit Date</div>
            <div style={{ fontSize: 14, fontWeight: "600" }}>{patient.date}</div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 16 }}>
            <div style={{ fontSize: 11, opacity: 0.85, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.7, fontWeight: "700" }}>Provider</div>
            <div style={{ fontSize: 14, fontWeight: "600" }}>{patient.provider}</div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 16 }}>
            <div style={{ fontSize: 11, opacity: 0.85, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.7, fontWeight: "700" }}>Nurse</div>
            <div style={{ fontSize: 14, fontWeight: "600" }}>{patient.nurse}</div>
          </div>
          <div style={{ background: "linear-gradient(135deg, #fcd34d 0%, #f97316 100%)", border: "none", borderRadius: 8, padding: "12px 14px", marginTop: 8, boxShadow: "0 4px 12px rgba(217, 119, 6, 0.3)" }}>
            <div style={{ fontSize: 11, opacity: 1, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.7, fontWeight: "700", color: "#fff" }}>⭐ Intake Summary</div>
            <div style={{ fontSize: 14, fontWeight: "600", lineHeight: 1.4, wordWrap: "break-word", overflowWrap: "break-word", hyphens: "auto", color: "#fff" }}>• {d.nurseSummary}</div>
          </div>
        </div>

        {/* RIGHT CONTENT AREA */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 0 }}>
          
          {/* TAB NAVIGATION */}
          <div style={{
            display: "flex",
            gap: 12,
            marginBottom: 28,
            padding: "8px",
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            borderRadius: 14,
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
          }}>
            <button
              onClick={() => setActiveTab("intake")}
              style={{
                background: activeTab === "intake" 
                  ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" 
                  : "transparent",
                border: activeTab === "intake" ? "none" : "1px solid transparent",
                padding: "12px 24px",
                fontSize: 14,
                fontWeight: activeTab === "intake" ? "700" : "600",
                color: activeTab === "intake" ? "#fff" : "#64748b",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                flex: 1,
                textAlign: "center",
                borderRadius: 10,
                boxShadow: activeTab === "intake" ? "0 4px 12px rgba(59, 130, 246, 0.28)" : "none",
                transform: activeTab === "intake" ? "translateY(-1px)" : "translateY(0)",
                outline: "none"
              }}
              onMouseEnter={(e) => {
                if (activeTab !== "intake") {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(99, 102, 241, 0.08)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#1e293b";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== "intake") {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#64748b";
                }
              }}
            >
              Intake
            </button>
            <button
              onClick={() => setActiveTab("chart")}
              style={{
                background: activeTab === "chart" 
                  ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" 
                  : "transparent",
                border: activeTab === "chart" ? "none" : "1px solid transparent",
                padding: "12px 24px",
                fontSize: 14,
                fontWeight: activeTab === "chart" ? "700" : "600",
                color: activeTab === "chart" ? "#fff" : "#64748b",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                flex: 1,
                textAlign: "center",
                borderRadius: 10,
                boxShadow: activeTab === "chart" ? "0 4px 12px rgba(59, 130, 246, 0.28)" : "none",
                transform: activeTab === "chart" ? "translateY(-1px)" : "translateY(0)",
                outline: "none"
              }}
              onMouseEnter={(e) => {
                if (activeTab !== "chart") {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(99, 102, 241, 0.08)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#1e293b";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== "chart") {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#64748b";
                }
              }}
            >
              Patient Chart
            </button>
            <button
              onClick={() => setActiveTab("roi")}
              style={{
                background: activeTab === "roi" 
                  ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" 
                  : "transparent",
                border: activeTab === "roi" ? "none" : "1px solid transparent",
                padding: "12px 24px",
                fontSize: 14,
                fontWeight: activeTab === "roi" ? "700" : "600",
                color: activeTab === "roi" ? "#fff" : "#64748b",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                flex: 1,
                textAlign: "center",
                borderRadius: 10,
                boxShadow: activeTab === "roi" ? "0 4px 12px rgba(59, 130, 246, 0.28)" : "none",
                transform: activeTab === "roi" ? "translateY(-1px)" : "translateY(0)",
                outline: "none"
              }}
              onMouseEnter={(e) => {
                if (activeTab !== "roi") {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(99, 102, 241, 0.08)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#1e293b";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== "roi") {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#64748b";
                }
              }}
            >
              Release of Information
            </button>
          </div>

          {/* TAB CONTENT */}
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 24 }}>
            
            {/* INTAKE SUMMARY TAB */}
            {activeTab === "intake" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
                  {/* STAGES CARD */}
                  <SectionCard title="Intake Progress">
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
                    
                    <div style={{ marginTop: 20, padding: "12px 16px", background: "#f0f9ff", borderRadius: 8, fontSize: 13, color: "#1e40af", fontWeight: "500", border: "1px solid #bfdbfe" }}>
                      Current Stage: <strong>{patient.stage}</strong>
                    </div>
                  </SectionCard>

                  {/* READINESS CARD */}
                  <SectionCard title="Readiness">
                    <div style={{ paddingTop: 8 }}>
                      <ReadinessMeter value={patient.readiness} />
                    </div>
                  </SectionCard>
                </div>

                {/* CLINICAL INFORMATION SECTION */}
                <div style={{
                  borderTop: "1px solid #e5e7eb",
                  paddingTop: 24
                }}>
                  <h2 style={{ fontSize: 18, fontWeight: "700", color: "#1f2937", marginTop: 0, marginBottom: 20 }}>Clinical Information</h2>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 24 }}>
                    <Card title="Complaints">
                      <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>Patient presenting with various medical concerns. Please review patient summary for details.</p>
                    </Card>
                    <Card title="Recent Visits">
                      {d.visits.length > 0 ? d.visits.map((v, i) => <div key={i}>• {v.type}</div>) : <div>No visits</div>}
                    </Card>
                    <Card title="Care Gaps">
                      {d.careGaps.length > 0 ? d.careGaps.map((g, i) => <div key={i}>• {g}</div>) : <div>No gaps</div>}
                    </Card>
                  </div>

                  {/* RECONCILIATION CARDS */}
                  <h2 style={{ fontSize: 16, fontWeight: "700", color: "#1f2937", marginTop: 0, marginBottom: 16 }}>Reconciliation Status</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 24 }}>
                    <Card title="Allergies">
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                          <div style={{ color: "#16a34a", fontWeight: "600", marginBottom: 6, fontSize: 13 }}>✓ Reconciled</div>
                          {d.allergies.reconciled.length > 0 ? d.allergies.reconciled.map((a, i) => <div key={i} style={{ fontSize: 13, marginBottom: 4 }}>• {a}</div>) : <div style={{ fontSize: 13 }}>None</div>}
                        </div>
                        <div>
                          <div style={{ color: "#dc2626", fontWeight: "600", marginBottom: 6, fontSize: 13 }}>✗ Pending</div>
                          {d.allergies.unreconciled.length > 0 ? d.allergies.unreconciled.map((a, i) => <div key={i} style={{ fontSize: 13, marginBottom: 4 }}>• {a}</div>) : <div style={{ fontSize: 13 }}>None</div>}
                        </div>
                      </div>
                    </Card>
                    <Card title="Medications">
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                          <div style={{ color: "#16a34a", fontWeight: "600", marginBottom: 6, fontSize: 13 }}>✓ Reconciled</div>
                          {d.medications.reconciled.length > 0 ? d.medications.reconciled.map((m, i) => <div key={i} style={{ fontSize: 13, marginBottom: 4 }}>• {m}</div>) : <div style={{ fontSize: 13 }}>None</div>}
                        </div>
                        <div>
                          <div style={{ color: "#dc2626", fontWeight: "600", marginBottom: 6, fontSize: 13 }}>✗ Pending</div>
                          {d.medications.unreconciled.length > 0 ? d.medications.unreconciled.map((m, i) => <div key={i} style={{ fontSize: 13, marginBottom: 4 }}>• {m}</div>) : <div style={{ fontSize: 13 }}>None</div>}
                        </div>
                      </div>
                    </Card>
                    <Card title="Immunizations">
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                          <div style={{ color: "#16a34a", fontWeight: "600", marginBottom: 6, fontSize: 13 }}>✓ Reconciled</div>
                          {d.immunizations.reconciled.length > 0 ? d.immunizations.reconciled.map((im, i) => <div key={i} style={{ fontSize: 13, marginBottom: 4 }}>• {im}</div>) : <div style={{ fontSize: 13 }}>None</div>}
                        </div>
                        <div>
                          <div style={{ color: "#dc2626", fontWeight: "600", marginBottom: 6, fontSize: 13 }}>✗ Pending</div>
                          {d.immunizations.unreconciled.length > 0 ? d.immunizations.unreconciled.map((im, i) => <div key={i} style={{ fontSize: 13, marginBottom: 4 }}>• {im}</div>) : <div style={{ fontSize: 13 }}>None</div>}
                        </div>
                      </div>
                    </Card>
                  </div>

                </div>
              </>
            )}

            {/* ROI TAB */}
            {activeTab === "roi" && (
              <div style={{
                borderTop: "1px solid #e5e7eb",
                paddingTop: 24
              }}>
                <div style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: 24,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  border: "1px solid #e5e7eb"
                }}>
                  <h3 style={{ textAlign: "left", marginTop: 0, marginBottom: 16, fontSize: 16, fontWeight: "700", color: "#1f2937" }}>Release of Information (ROI) Requests</h3>
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
                  
                  {patient.status !== "Completed" && (
                    <button
                      style={{
                        ...primaryBtn,
                        display: "inline-block",
                        alignSelf: "flex-start",
                        minWidth: 0,
                        marginTop: 20,
                        padding: "10px 16px",
                        fontSize: 14
                      }}
                      onClick={onCreateROI}
                    >
                      + New ROI Request
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* PATIENT CHART TAB */}
            {activeTab === "chart" && (
              <div style={{
                borderTop: "1px solid #e5e7eb",
                paddingTop: 24
              }}>
                <div style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: 24,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  border: "1px solid #e5e7eb"
                }}>
                  <h3 style={{ textAlign: "left", marginTop: 0, marginBottom: 24, fontSize: 16, fontWeight: "700", color: "#1f2937" }}>Patient Chart</h3>
                  
                  {/* Row 1: Vital Signs, Current Medications, Allergies */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 20 }}>
                    <Card title="Vital Signs">
                      <div style={{ color: "#6b7280", fontSize: 14 }}>
                        <p style={{ margin: "0 0 8px 0" }}>• BP: 128/82 mmHg</p>
                        <p style={{ margin: "0 0 8px 0" }}>• HR: 72 bpm</p>
                        <p style={{ margin: "0 0 8px 0" }}>• Temp: 98.6°F</p>
                        <p style={{ margin: 0 }}>• O2: 98% (RA)</p>
                      </div>
                    </Card>
                    <Card title="Current Medications">
                      <ul style={{ margin: 0, paddingLeft: 20, color: "#6b7280", fontSize: 14 }}>
                        <li>Lisinopril - 10mg daily</li>
                        <li>Metformin - 500mg twice daily</li>
                        <li>Atorvastatin - 20mg daily</li>
                      </ul>
                    </Card>
                    <Card title="Allergies">
                      <div style={{ color: "#6b7280", fontSize: 14 }}>
                        {d.allergies.reconciled.length > 0 || d.allergies.unreconciled.length > 0 ? (
                          <>
                            {d.allergies.reconciled.map((a, i) => <div key={i} style={{ marginBottom: 4 }}>• {a}</div>)}
                            {d.allergies.unreconciled.map((a, i) => <div key={i} style={{ marginBottom: 4, opacity: 0.6 }}>• {a} (pending)</div>)}
                          </>
                        ) : (
                          <div>No allergies</div>
                        )}
                      </div>
                    </Card>
                  </div>

                  {/* Health Care Maintenance Section */}
                  <h4 style={{ textAlign: "left", marginTop: 24, marginBottom: 16, fontSize: 14, fontWeight: "700", color: "#1f2937", letterSpacing: "0.2px" }}>Health Care Maintenance</h4>
                  
                  {/* Row 1: Immunizations, Physicals */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                    <Card title="Immunizations">
                      <ul style={{ margin: 0, paddingLeft: 20, color: "#6b7280", fontSize: 14 }}>
                        <li>COVID-19 (Moderna) - 01/15/2025</li>
                        <li>Influenza (Quad) - 09/20/2024</li>
                        <li>Tdap - 02/10/2020</li>
                      </ul>
                    </Card>
                    <Card title="Physicals">
                      <ul style={{ margin: 0, paddingLeft: 20, color: "#6b7280", fontSize: 14 }}>
                        <li>Annual Physical - 03/15/2025 - Normal</li>
                        <li>Follow-up Visit - 01/20/2025 - Normal</li>
                        <li>Pre-op Exam - 11/10/2024 - Cleared</li>
                      </ul>
                    </Card>
                  </div>

                  {/* Row 2: Screening, Bloodwork/Labs */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <Card title="Screening">
                      <ul style={{ margin: 0, paddingLeft: 20, color: "#6b7280", fontSize: 14 }}>
                        <li>Blood Pressure - Normal - 03/15/2025</li>
                        <li>Cholesterol - Elevated - 01/20/2025</li>
                        <li>Cancer Screening - Due</li>
                      </ul>
                    </Card>
                    <Card title="Bloodwork/Labs">
                      <ul style={{ margin: 0, paddingLeft: 20, color: "#6b7280", fontSize: 14 }}>
                        <li>CBC - Normal - 03/10/2025</li>
                        <li>CMP - Normal - 03/10/2025</li>
                        <li>Lipid Panel - High chol - 01/20/2025</li>
                      </ul>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
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
    <div style={{ display: "flex", flexDirection: "column", gap: 0, minHeight: "100vh" }}>
      {/* PAGE HEADER */}
      <div style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)", padding: "40px 40px", borderBottom: "2px solid #bfdbfe", position: "relative", overflow: "hidden" }}>
        <button style={{ background: "rgba(0, 0, 0, 0.08)", color: "#0f172a", border: "1px solid rgba(0, 0, 0, 0.12)", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s", position: "relative", zIndex: 1 }} onClick={onBack} onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(0, 0, 0, 0.12)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(0, 0, 0, 0.08)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}>← Back</button>
        <div style={{ marginTop: 32, position: "relative", zIndex: 1 }}>
          <h2 style={{ color: "#0f172a", textAlign: "left", marginBottom: 6, fontSize: 44, fontWeight: 950, letterSpacing: "-0.025em", lineHeight: 1.1 }}>
            Release of Information Request
          </h2>
          <p style={{ color: "#64748b", fontSize: 16, margin: 0, fontWeight: 500, lineHeight: 1.5 }}>
            Patient: <span style={{ fontWeight: 700 }}>{patient.name}</span>
          </p>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div style={{ flex: 1, padding: "40px", background: "linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)", overflowY: "auto" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          
          {/* REQUEST DETAILS SECTION */}
          <div style={{ background: "#fff", borderRadius: 12, padding: 36, boxShadow: "0 2px 8px rgba(59, 130, 246, 0.08), 0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #dbeafe", borderTop: "4px solid #3b82f6", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", marginBottom: 32 }} onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 28px rgba(59, 130, 246, 0.12)"} onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(59, 130, 246, 0.08), 0 1px 3px rgba(0,0,0,0.05)"}>
            <h3 style={{ textAlign: "left", marginTop: 0, marginBottom: 24, fontSize: 16, fontWeight: 700, color: "#1f2937", letterSpacing: "0.3px" }}>Request Details</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.4px" }}>ROI Type</label>
                <select style={{ width: "100%", padding: "10px 12px", fontSize: 13, border: "1px solid #e5e7eb", borderRadius: 6, background: "#f9fafb", fontFamily: "inherit", transition: "all 0.2s", outline: "none", cursor: "pointer", color: "#1f2937", fontWeight: 500 }} onFocus={(e) => { (e.currentTarget as HTMLSelectElement).style.borderColor = "#3b82f6"; (e.currentTarget as HTMLSelectElement).style.background = "#fff"; }} onBlur={(e) => { (e.currentTarget as HTMLSelectElement).style.borderColor = "#e5e7eb"; (e.currentTarget as HTMLSelectElement).style.background = "#f9fafb"; }} value={roiType} onChange={e => setROIType(e.target.value)}>
                  <option>Patient Signature Required</option>
                  <option>Facility To Facility</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.4px" }}>Facility Name</label>
                <input style={{ width: "100%", padding: "10px 12px", fontSize: 13, border: "1px solid #e5e7eb", borderRadius: 6, background: "#f9fafb", fontFamily: "inherit", transition: "all 0.2s", outline: "none", color: "#1f2937", fontWeight: 500 }} onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "#3b82f6"; (e.currentTarget as HTMLInputElement).style.background = "#fff"; (e.currentTarget as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"; }} onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "#e5e7eb"; (e.currentTarget as HTMLInputElement).style.background = "#f9fafb"; (e.currentTarget as HTMLInputElement).style.boxShadow = "none"; }} value={facilityName} onChange={e => setFacilityName(e.target.value)} placeholder="Medical Center" />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.4px" }}>Facility Fax</label>
                <input style={{ width: "100%", padding: "10px 12px", fontSize: 13, border: "1px solid #e5e7eb", borderRadius: 6, background: "#f9fafb", fontFamily: "inherit", transition: "all 0.2s", outline: "none", color: "#1f2937", fontWeight: 500 }} onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "#3b82f6"; (e.currentTarget as HTMLInputElement).style.background = "#fff"; (e.currentTarget as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"; }} onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "#e5e7eb"; (e.currentTarget as HTMLInputElement).style.background = "#f9fafb"; (e.currentTarget as HTMLInputElement).style.boxShadow = "none"; }} value={facilityFax} onChange={e => setFacilityFax(e.target.value)} placeholder="(555) 000-0000" />
              </div>
            </div>
          </div>

          {/* RECORDS SECTIONS */}
          <SectionCard title="Records to be Released">
            <div style={grid2}>
              <Checkbox label="Behavioral Health" obj={records} k="behavioralHealth" set={setRecords}/>
              <Checkbox label="Emergency Dept" obj={records} k="emergencyDept" set={setRecords}/>
              <Checkbox label="Operative Notes" obj={records} k="operativeNotes" set={setRecords}/>
              <Checkbox label="Provider Notes" obj={records} k="providerNotes" set={setRecords}/>
              <Checkbox label="Therapy Notes" obj={records} k="therapyNotes" set={setRecords}/>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.4px" }}>Other</label>
                <input style={{ width: "100%", padding: "10px 12px", fontSize: 13, border: "1px solid #e5e7eb", borderRadius: 6, background: "#f9fafb", fontFamily: "inherit", transition: "all 0.2s", outline: "none", color: "#1f2937", fontWeight: 500 }} onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "#3b82f6"; (e.currentTarget as HTMLInputElement).style.background = "#fff"; (e.currentTarget as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"; }} onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "#e5e7eb"; (e.currentTarget as HTMLInputElement).style.background = "#f9fafb"; (e.currentTarget as HTMLInputElement).style.boxShadow = "none"; }} value={records.otherDocument} onChange={e => setRecords({ ...records, otherDocument: e.target.value })} placeholder="Specify other records" />
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
                  ? <div key={key}><label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.4px" }}>Other</label><input style={{ width: "100%", padding: "10px 12px", fontSize: 13, border: "1px solid #e5e7eb", borderRadius: 6, background: "#f9fafb", fontFamily: "inherit", transition: "all 0.2s", outline: "none", color: "#1f2937", fontWeight: 500 }} onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "#3b82f6"; (e.currentTarget as HTMLInputElement).style.background = "#fff"; (e.currentTarget as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"; }} onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = "#e5e7eb"; (e.currentTarget as HTMLInputElement).style.background = "#f9fafb"; (e.currentTarget as HTMLInputElement).style.boxShadow = "none"; }} placeholder="Specify other records" value={substance[key] as string} onChange={e => setSubstance({ ...substance, other: e.target.value })}/></div>
                  : <Checkbox<SubstanceState> key={key} label={String(key).replace(/([A-Z])/g, ' $1')} obj={substance} k={key} set={setSubstance}/>
              )}
            </div>
          </SectionCard>

          {/* ACTION BUTTONS */}
          <div style={{ display: "flex", gap: 16, paddingTop: 32 }}>
            <button
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "12px 24px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                letterSpacing: "0.3px"
              }}
              onClick={() =>
                onSubmit({
                  id: Date.now(),
                  facility: facilityName,
                  requestedDate: new Date().toISOString().split('T')[0],
                  status: roiType
                })
              }
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 20px rgba(59, 130, 246, 0.4)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)"; }}
            >
              ✓ Trigger ROI Request
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// ============ DASHBOARD PAGE ============
interface DashboardPageProps {
  patients: Patient[];
  onNavigateToUpcoming: (nurseName?: string) => void;
  onNavigateToCompleted: () => void;
}

function DashboardPage({ patients, onNavigateToUpcoming, onNavigateToCompleted }: DashboardPageProps): JSX.Element {
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
    <div style={{ display: "flex", flexDirection: "column", gap: 0, minHeight: "100vh" }}>
      {/* PAGE HEADER */}
      <div style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)", padding: "40px 40px", marginBottom: "0", borderBottom: "2px solid #bfdbfe", position: "relative", overflow: "hidden" }}>
        <div>
          <h2 style={{ color: "#0f172a", textAlign: "left", marginBottom: 6, fontSize: 44, fontWeight: 950, letterSpacing: "-0.025em", position: "relative", zIndex: 1, lineHeight: 1.1 }}>
            Intake Summary
          </h2>
          <p style={{ color: "#64748b", fontSize: 16, margin: 0, fontWeight: 500, position: "relative", zIndex: 1, lineHeight: 1.5 }}>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div style={{ flex: 1, padding: "40px", background: "linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%)", overflowY: "auto" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      
          {/* THREE COLUMN LAYOUT - TOP ROW */}
          <div style={{ display: "grid", gridTemplateColumns: "0.6fr 1fr 1fr", gap: 32, marginBottom: 64 }}>
          {/* Left Column: Upcoming and Completed stacked */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)", borderRadius: 12, padding: 32, boxShadow: "0 4px 16px rgba(37, 99, 235, 0.3)", border: "1px solid rgba(37, 99, 235, 0.3)", borderTop: "4px solid #1e3a8a", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", cursor: "pointer" }} onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 32px rgba(37, 99, 235, 0.4)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(37, 99, 235, 0.3)"; }} onClick={() => onNavigateToUpcoming()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", marginBottom: 14, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>Upcoming</div>
                <div style={{ fontSize: 48, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{totalUpcoming}</div>
              </div>
              <div style={{ fontSize: 44, opacity: 0.15, marginTop: -4 }}>📋</div>
            </div>
            </div>
            <div style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", borderRadius: 12, padding: 32, boxShadow: "0 4px 16px rgba(16, 185, 129, 0.3)", border: "1px solid rgba(16, 185, 129, 0.3)", borderTop: "4px solid #047857", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", cursor: "pointer" }} onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 32px rgba(16, 185, 129, 0.4)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(16, 185, 129, 0.3)"; }} onClick={() => onNavigateToCompleted()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", marginBottom: 14, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>Completed</div>
                <div style={{ fontSize: 48, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{totalCompleted}</div>
              </div>
              <div style={{ fontSize: 44, opacity: 0.15, marginTop: -4 }}>✅</div>
            </div>
            </div>
          </div>

          {/* Middle Column: Stage Distribution */}
          <div style={{ background: "#fff", borderRadius: 12, padding: 36, boxShadow: "0 2px 8px rgba(59, 130, 246, 0.08), 0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #e0e7ff", borderTop: "4px solid #2563eb", display: "flex", flexDirection: "column", justifyContent: "center", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }} onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 28px rgba(59, 130, 246, 0.12)"} onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(59, 130, 246, 0.08), 0 1px 3px rgba(0,0,0,0.05)"}>
          <h4 style={{ textAlign: "left", marginTop: 0, marginBottom: 24, fontSize: 13, fontWeight: 800, color: "#1e293b", letterSpacing: "0.8px", textTransform: "uppercase", lineHeight: 1.2 }}>Stage Distribution</h4>
          <PieChart data={stages.map((stage, i) => ({
            label: stage,
            value: patients.filter(p => p.stage === stage).length,
            color: colors[i]
          }))}/>
        </div>

          {/* Right Column: Status Overview */}
          <div style={{ background: "#fff", borderRadius: 12, padding: 36, boxShadow: "0 2px 8px rgba(59, 130, 246, 0.08), 0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #e0e7ff", borderTop: "4px solid #16a34a", display: "flex", flexDirection: "column", justifyContent: "center", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }} onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 28px rgba(59, 130, 246, 0.12)"} onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(59, 130, 246, 0.08), 0 1px 3px rgba(0,0,0,0.05)"}>
          <h4 style={{ textAlign: "left", marginTop: 0, marginBottom: 24, fontSize: 13, fontWeight: 800, color: "#1e293b", letterSpacing: "0.8px", textTransform: "uppercase", lineHeight: 1.2 }}>Status Overview</h4>
          <PieChart data={[
            { label: "New", value: newCount, color: "#2563eb" },
            { label: "In Progress", value: inProgressCount, color: "#facc15" },
            { label: "Completed", value: completedCount, color: "#16a34a" }
          ]}/>
          </div>
          </div>

          {/* WEEKLY VISITS TREND */}
          <div style={{ marginBottom: 64 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 36, boxShadow: "0 2px 8px rgba(59, 130, 246, 0.08), 0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #e0e7ff", borderTop: "4px solid #06b6d4", display: "flex", flexDirection: "column", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }} onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 28px rgba(59, 130, 246, 0.12)"} onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(59, 130, 246, 0.08), 0 1px 3px rgba(0,0,0,0.05)"}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <h4 style={{ textAlign: "left", marginTop: 0, marginBottom: 0, fontSize: 13, fontWeight: 800, color: "#1e293b", letterSpacing: "0.8px", textTransform: "uppercase", lineHeight: 1.2 }}>Weekly Visits Trend - YTD</h4>
            <div style={{ display: "flex", gap: 28, fontSize: 13 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 16, height: 16, background: "#10b981", opacity: 0.7, borderRadius: 2 }}/>
                <span style={{ color: "#64748b", fontWeight: 600 }}>AHT (minutes)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 16, height: 3, background: "#2563eb", borderRadius: 1 }}/>
                <span style={{ color: "#64748b", fontWeight: 600 }}>Visits</span>
              </div>
            </div>
          </div>
          <div style={{ position: "relative", flex: 1, minHeight: 304 }}>
            <svg width="100%" height="100%" viewBox="0 0 1000 320" preserveAspectRatio="xMidYMid meet" style={{ position: "absolute", top: 0, left: 0 }}>
              {[0, 25, 50, 75, 100].map((y, i) => (
                <line key={`grid-${i}`} x1="60" y1={280 - (y / 100) * 240} x2="1000" y2={280 - (y / 100) * 240} stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5" opacity="0.6"/>
              ))}
              {/* Left Y-axis labels for Visits */}
              {[0, 20, 40, 60, 80, 100].map((val, i) => (
                <text key={`label-visits-${i}`} x="40" y={285 - (val / 100) * 240} fontSize="12" fill="#2563eb" textAnchor="end" fontWeight="500">{val}</text>
              ))}
              {/* Right Y-axis labels for AHT */}
              {[0, 6, 12, 18, 24, 30].map((val, i) => (
                <text key={`label-aht-${i}`} x="970" y={285 - (val / 30) * 240} fontSize="12" fill="#10b981" textAnchor="start" fontWeight="500">{val}</text>
              ))}
              {/* Y-axis titles */}
              <text x="15" y="160" fontSize="14" fill="#2563eb" fontWeight="600" textAnchor="middle" transform="rotate(-90 15 160)">Visit Count</text>
              <text x="985" y="160" fontSize="14" fill="#10b981" fontWeight="600" textAnchor="middle" transform="rotate(90 985 160)">AHT (minutes)</text>
              {/* Bars for AHT */}
              {weeklyVisits.map((item, i) => {
                const barWidth = 40;
                const x = 60 + (i / (weeklyVisits.length - 1)) * 880 - (barWidth / 2);
                const barHeight = (item.aht / 30) * 240;
                const y = 280 - barHeight;
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
                  const y = 280 - (item.visits / 100) * 240;
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
                const y = 280 - (item.visits / 100) * 240;
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
                  <text key={`week-${i}`} x={x} y={310} fontSize="16" fill="#9ca3af" textAnchor="middle" fontWeight="500">{item.week}</text>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

        {/* TWO COLUMN LAYOUT - NURSE & ROI */}
        <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: 32 }}>
          {/* Nurse Visit Assignments */}
          <div style={{ background: "#fff", borderRadius: 12, padding: 36, boxShadow: "0 2px 8px rgba(59, 130, 246, 0.08), 0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #e0e7ff", borderTop: "4px solid #2563eb", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }} onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 28px rgba(59, 130, 246, 0.12)"} onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(59, 130, 246, 0.08), 0 1px 3px rgba(0,0,0,0.05)"}>
          <h4 style={{ textAlign: "left", marginTop: 0, marginBottom: 24, fontSize: 13, fontWeight: 800, color: "#1e293b", letterSpacing: "0.8px", textTransform: "uppercase", lineHeight: 1.2 }} aria-label="Nurse Visit Assignments section" aria-level={2}>Nurse Visit Assignments</h4>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "linear-gradient(90deg, #f9fafb 0%, #f3f4f6 100%)", borderBottom: "2px solid #e5e7eb" }}>
                <th style={{ ...th, fontWeight: 850, color: "#1e293b", padding: 14, fontSize: 11, borderRadius: "6px 0 0 0", textTransform: "uppercase", letterSpacing: "0.9px", lineHeight: 1.2 }}>Nurse</th>
                <th style={{ ...th, fontWeight: 850, color: "#1e293b", padding: 14, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.9px", lineHeight: 1.2 }}>Pending</th>
                <th style={{ ...th, fontWeight: 850, color: "#1e293b", padding: 14, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.9px", lineHeight: 1.2 }}>Completed</th>
                <th style={{ ...th, fontWeight: 850, color: "#1e293b", padding: 14, fontSize: 11, borderRadius: "0 6px 0 0", textTransform: "uppercase", letterSpacing: "0.9px", lineHeight: 1.2 }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(aprnStats).map(([nurse, stats], idx) => (
                <tr key={nurse} onClick={() => onNavigateToUpcoming(nurse)} style={{ background: idx % 2 === 0 ? "#fff" : "#f9fafb", borderBottom: "1px solid #f0f0f0", transition: "background 0.2s", cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget as HTMLTableRowElement).style.background = "#f0f9ff"} onMouseLeave={(e) => (e.currentTarget as HTMLTableRowElement).style.background = idx % 2 === 0 ? "#fff" : "#f9fafb"}>
                  <td style={{ ...td, fontSize: 13, padding: 14, fontWeight: 750, color: "#0f172a", letterSpacing: "-0.3px" }}>{nurse}</td>
                  <td style={{ ...td, fontSize: 13, textAlign: "center", color: "#dc2626", fontWeight: "bold", padding: 14 }}>
                    <div style={{ background: "#fee2e2", padding: "6px 12px", borderRadius: 6, display: "inline-block", minWidth: "30px", fontSize: 12, fontWeight: 800 }}>{stats.pending}</div>
                  </td>
                  <td style={{ ...td, fontSize: 13, textAlign: "center", color: "#16a34a", fontWeight: 800, padding: 14 }}>
                    <div style={{ background: "#dcfce7", padding: "6px 12px", borderRadius: 6, display: "inline-block", minWidth: "30px", fontSize: 12, fontWeight: 800 }}>{stats.completed}</div>
                  </td>
                  <td style={{ ...td, fontSize: 13, textAlign: "center", fontWeight: 800, padding: 14, color: "#2563eb" }}>
                    <div style={{ background: "#dbeafe", padding: "6px 12px", borderRadius: 6, display: "inline-block", minWidth: "30px", fontSize: 12, fontWeight: 800 }}>{stats.total}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

          {/* Recent ROI Requests */}
          <div style={{ background: "#fff", borderRadius: 12, padding: 36, boxShadow: "0 2px 8px rgba(59, 130, 246, 0.08), 0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #e0e7ff", borderTop: "4px solid #f59e0b", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }} onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 28px rgba(59, 130, 246, 0.12)"} onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(59, 130, 246, 0.08), 0 1px 3px rgba(0,0,0,0.05)"}>
            <h4 style={{ textAlign: "left", marginTop: 0, marginBottom: 24, fontSize: 13, fontWeight: 800, color: "#1e293b", letterSpacing: "0.8px", textTransform: "uppercase", lineHeight: 1.2 }} aria-label="Recent ROI Requests section" aria-level={2}>Recent ROI Requests</h4>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "linear-gradient(90deg, #f9fafb 0%, #f3f4f6 100%)", borderBottom: "2px solid #e5e7eb" }}>
                <th style={{ ...th, fontWeight: 850, color: "#1e293b", padding: 14, fontSize: 11, borderRadius: "6px 0 0 0", textTransform: "uppercase", letterSpacing: "0.9px", lineHeight: 1.2 }}>Patient</th>
                <th style={{ ...th, fontWeight: 850, color: "#1e293b", padding: 14, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.9px", lineHeight: 1.2 }}>Facility</th>
                <th style={{ ...th, fontWeight: 850, color: "#1e293b", padding: 14, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.9px", lineHeight: 1.2 }}>Date</th>
                <th style={{ ...th, fontWeight: 850, color: "#1e293b", textAlign: "center", padding: 14, fontSize: 11, borderRadius: "0 6px 0 0", textTransform: "uppercase", letterSpacing: "0.9px", lineHeight: 1.2 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {roiRequests.map((roi, idx) => (
                <tr key={roi.id} style={{ background: idx % 2 === 0 ? "#fff" : "#f9fafb", borderBottom: "1px solid #f0f0f0", transition: "background 0.2s" }} onMouseEnter={(e) => (e.currentTarget as HTMLTableRowElement).style.background = "#f0f9ff"} onMouseLeave={(e) => (e.currentTarget as HTMLTableRowElement).style.background = idx % 2 === 0 ? "#fff" : "#f9fafb"}>
                  <td style={{ ...td, fontSize: 13, padding: 14, fontWeight: 750, color: "#0f172a", letterSpacing: "-0.3px" }}>{roi.patient}</td>
                  <td style={{ ...td, fontSize: 13, padding: 14, color: "#475569", fontWeight: 600 }}>{roi.facility}</td>
                  <td style={{ ...td, fontSize: 13, padding: 14, color: "#475569", fontWeight: 600 }}>{roi.requestedDate}</td>
                  <td style={{ ...td, fontSize: 12, textAlign: "center", padding: 14 }}>
                    <span style={{ 
                      padding: "7px 14px", 
                      borderRadius: "8px", 
                      background: roi.status === "Completed" ? "#dcfce7" : roi.status === "Sent to Facility" ? "#dbeafe" : "#fee2e2",
                      color: roi.status === "Completed" ? "#166534" : roi.status === "Sent to Facility" ? "#1e40af" : "#991b1b",
                      fontWeight: 800,
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.85px",
                      lineHeight: 1.2,
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
      </div>
    </div>
  );
}