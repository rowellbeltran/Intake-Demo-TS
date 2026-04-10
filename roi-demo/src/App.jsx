import React, { useState } from "react";
// ---------------- DATA ----------------
const patients = [
  { id: 1, name: "John Doe", mrn: "MRN-001", date: "2026-04-10", provider: "Dr. Smith", aprn: "Sarah Johnson, NP", stage: "Data Prepared", status: "New", exception: "None", readiness: 25 },
  { id: 2, name: "Jane Roe", mrn: "MRN-002", date: "2026-04-11", provider: "Dr. Adams", aprn: "Michael Chen, PA-C", stage: "Data Validated", status: "In Progress", exception: "Missing Labs", readiness: 60 },
  { id: 3, name: "Michael Lee", mrn: "MRN-003", date: "2026-04-05", provider: "Dr. Brown", aprn: "Emily Rodriguez, NP", stage: "Readiness Evaluated", status: "Completed", exception: "None", readiness: 100 },
  { id: 4, name: "Sarah Johnson", mrn: "MRN-004", date: "2026-04-12", provider: "Dr. Wilson", aprn: "James Patterson, PA-C", stage: "Data Prepared", status: "New", exception: "Insurance Verification", readiness: 35 },
  { id: 5, name: "Robert Martinez", mrn: "MRN-005", date: "2026-04-13", provider: "Dr. Garcia", aprn: "Lisa Wong, NP", stage: "Data Validated", status: "In Progress", exception: "None", readiness: 75 },
  { id: 6, name: "Emily Chen", mrn: "MRN-006", date: "2026-04-14", provider: "Dr. Taylor", aprn: "David Kumar, PA-C", stage: "Patient Record Updated", status: "In Progress", exception: "Pending Approval", readiness: 50 },
  { id: 7, name: "David Thompson", mrn: "MRN-007", date: "2026-04-15", provider: "Dr. Anderson", aprn: "Jennifer Lee, NP", stage: "Data Prepared", status: "New", exception: "None", readiness: 20 },
  { id: 8, name: "Lisa Anderson", mrn: "MRN-008", date: "2026-04-16", provider: "Dr. Martinez", aprn: "Robert Thompson, PA-C", stage: "Data Validated", status: "In Progress", exception: "Lab Results Pending", readiness: 65 }
];
const defaultDetails = {
  visits: [],
  allergies: { reconciled: [], unreconciled: [] },
  medications: { reconciled: [], unreconciled: [] },
  immunizations: { reconciled: [], unreconciled: [] },
  careGaps: [],
  nurseSummary: "No data",
  roi: []
};
const patientDetails = {
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
  }
};
const stages = ["Data Prepared","Data Validated","Patient Record Updated","Readiness Evaluated"];
const colors = ["#2563eb","#14b8a6","#facc15","#16a34a"];
const visitsToday = [
  { id: 1, patient: "John Doe", time: "09:00 AM", provider: "Dr. Smith", aprn: "Sarah Johnson, NP", status: "Completed" },
  { id: 2, patient: "Jane Roe", time: "09:30 AM", provider: "Dr. Adams", aprn: "Michael Chen, PA-C", status: "Completed" },
  { id: 3, patient: "Michael Lee", time: "10:00 AM", provider: "Dr. Brown", aprn: "Emily Rodriguez, NP", status: "Pending" },
  { id: 4, patient: "Sarah Johnson", time: "10:30 AM", provider: "Dr. Wilson", aprn: "James Patterson, PA-C", status: "Pending" },
  { id: 5, patient: "Robert Martinez", time: "11:00 AM", provider: "Dr. Garcia", aprn: "Sarah Johnson, NP", status: "Completed" },
  { id: 6, patient: "Emily Chen", time: "11:30 AM", provider: "Dr. Taylor", aprn: "Michael Chen, PA-C", status: "Pending" }
];
const roiRequests = [
  { id: 1, patient: "John Doe", facility: "General Hospital", requestedDate: "2026-04-08", status: "Patient Signature Pending" },
  { id: 2, patient: "John Doe", facility: "City Clinic", requestedDate: "2026-04-07", status: "Sent to Facility" },
  { id: 3, patient: "Jane Roe", facility: "Heart Center", requestedDate: "2026-04-06", status: "Completed" },
  { id: 4, patient: "Michael Lee", facility: "Specialty Clinic", requestedDate: "2026-04-05", status: "Patient Signature Pending" },
  { id: 5, patient: "Sarah Johnson", facility: "General Hospital", requestedDate: "2026-04-04", status: "Sent to Facility" },
  { id: 6, patient: "Robert Martinez", facility: "Cardiology Center", requestedDate: "2026-04-03", status: "Completed" }
];
const weeklyVisits = [
  { week: "Week 1", visits: 12 },
  { week: "Week 2", visits: 18 },
  { week: "Week 3", visits: 15 },
  { week: "Week 4", visits: 22 },
  { week: "Week 5", visits: 25 }
];
// ---------------- APP ----------------
export default function App() {
  const [view,setView]=useState("dashboard");
  const [selectedPatient,setSelectedPatient]=useState(null);
  const [showROI,setShowROI]=useState(false);
  const filtered = patients.filter(p =>
    view==="completed" ? p.status==="Completed" : view==="upcoming" ? p.status!=="Completed" : true
  );
  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh", background:"#f1f5f9" }}>
      {/* APP TITLE */}
      <div style={{ background:"#2563eb", padding:"16px 24px", boxShadow:"0 2px 4px rgba(0,0,0,0.1)", textAlign: "center" }}>
        <h1 style={{ color:"#fff", margin:0, fontSize:24, fontWeight:"bold" }}>Intake Visits</h1>
      </div>
      {/* TABS */}
      <div style={{ display:"flex", background:"#fff", borderBottom:"2px solid #ddd", paddingLeft:0 }}>
        <div 
          style={{
            padding:"12px 24px", 
            cursor:"pointer", 
            borderBottom: view==="dashboard" ? "3px solid #2563eb" : "none",
            color: view==="dashboard" ? "#2563eb" : "#666",
            fontWeight: view==="dashboard" ? "bold" : "normal",
            fontSize: 14,
            marginBottom: "-2px"
          }}
          onClick={()=>{setView("dashboard");setSelectedPatient(null);setShowROI(false)}}
        >
          Dashboard
        </div>
        <div 
          style={{
            padding:"12px 24px", 
            cursor:"pointer", 
            borderBottom: view==="upcoming" ? "3px solid #2563eb" : "none",
            color: view==="upcoming" ? "#2563eb" : "#666",
            fontWeight: view==="upcoming" ? "bold" : "normal",
            fontSize: 14,
            marginBottom: "-2px"
          }}
          onClick={()=>{setView("upcoming");setSelectedPatient(null);setShowROI(false)}}
        >
          Upcoming
        </div>
        <div 
          style={{
            padding:"12px 24px", 
            cursor:"pointer", 
            borderBottom: view==="completed" ? "3px solid #2563eb" : "none",
            color: view==="completed" ? "#2563eb" : "#666",
            fontWeight: view==="completed" ? "bold" : "normal",
            fontSize: 14,
            marginBottom: "-2px"
          }}
          onClick={()=>{setView("completed");setSelectedPatient(null);setShowROI(false)}}
        >
          Completed
        </div>
      </div>
      {/* MAIN */}
      <div style={{ flex:1, padding:24 }}>
        {!selectedPatient ? (
          view === "dashboard" ? (
            <DashboardPage patients={patients}/>
          ) : (
            <QueuePage patients={filtered} onSelect={setSelectedPatient}/>
          )
        ) : showROI ? (
          <CreateROIPage
            patient={selectedPatient}
            onBack={()=>setShowROI(false)}
            onSubmit={(roi)=>{
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
            onBack={()=>setSelectedPatient(null)}
            onCreateROI={()=>setShowROI(true)}
          />
        )}
      </div>
    </div>
  );
}
// ---------------- QUEUE ----------------
function QueuePage({ patients, onSelect }) {
  // Determine header based on patient status
  const isCompleted = patients.length > 0 && patients[0].status === "Completed";
  const header = isCompleted ? "Completed Visits" : "Upcoming Visits";
  
  const getStatusColor = (status) => {
    switch(status) {
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

  const getStageColor = (stage) => {
    switch(stage) {
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
      <h2 style={{ color: "#222", textAlign: "left", marginBottom: 20 }}>
        {header}
      </h2>
      <table style={{ width:"100%", borderCollapse:"collapse", background:"#fff", textAlign:"left" }}>
        <thead style={{ background:"#f8fafc" }}>
          <tr>
            {["Patient","Date","Provider","APRN","Stage","Status","Exception","Readiness"].map(h=>(
              <th key={h} style={th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {patients.map(p=>(
            <tr key={p.id} onClick={()=>onSelect(p)} style={{cursor:"pointer"}}>
              <td style={td}>{p.name}</td>
              <td style={td}>{p.date}</td>
              <td style={td}>{p.provider}</td>
              <td style={td}>{p.aprn}</td>
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
              <td style={{...td, padding: 8}}>
                <div style={{ background:"#ddd", height:6, borderRadius:2 }}>
                  <div style={{ width:p.readiness+"%", height:6, background:p.readiness<40?"#ef4444":p.readiness<80?"#facc15":"#16a34a", borderRadius:2 }}/>
                </div>
                <div style={{ fontSize:11, marginTop:2, textAlign:"center" }}>{p.readiness}%</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const th={padding:10,textAlign:"left",borderBottom:"1px solid #ddd", fontSize:14};
const td={padding:10,textAlign:"left",borderBottom:"1px solid #eee", fontSize:13};
// ---------------- PATIENT ----------------
function PatientRecord({ patient, onBack, onCreateROI }) {
  const d = patientDetails[patient.id] || defaultDetails;
  const currentStageIndex = stages.indexOf(patient.stage);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <button style={backBtn} onClick={onBack}>← Back</button>
      <div style={card}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:20, marginBottom:20 }}>
          <div>
            <div style={{ fontSize:12, color:"#666" }}>Patient Name</div>
            <div style={{ fontSize:16, fontWeight:"bold" }}>{patient.name}</div>
          </div>
          <div>
            <div style={{ fontSize:12, color:"#666" }}>MRN</div>
            <div style={{ fontSize:16, fontWeight:"bold" }}>{patient.mrn}</div>
          </div>
          <div>
            <div style={{ fontSize:12, color:"#666" }}>Provider Name</div>
            <div style={{ fontSize:16, fontWeight:"bold" }}>{patient.provider}</div>
          </div>
          <div>
            <div style={{ fontSize:12, color:"#666" }}>APRN</div>
            <div style={{ fontSize:16, fontWeight:"bold" }}>{patient.aprn}</div>
          </div>
          <div>
            <div style={{ fontSize:12, color:"#666" }}>Visit Date</div>
            <div style={{ fontSize:16, fontWeight:"bold" }}>{patient.date}</div>
          </div>
        </div>
        {/* MILESTONES */}
        <div style={{ display:"flex", justifyContent:"space-between", position:"relative", marginTop:20 }}>
          <div style={{ position:"absolute", top:15, left:0, right:0, height:4, background:"#ddd"}}/>
          <div style={{ position:"absolute", top:15, left:0, width:`${(currentStageIndex/(stages.length-1))*100}%`, height:4, background:colors[currentStageIndex], transition:"width 0.3s" }}/>
          {stages.map((s,i)=>(
            <div key={s} style={{ textAlign:"center", zIndex:1 }}>
              <div style={{ width:32,height:32,borderRadius:"50%",background:colors[i],color:"#fff",display:"flex",alignItems:"center",justifyContent:"center" }}>{i+1}</div>
              <div style={{ fontSize:12 }}>{s}</div>
            </div>
          ))}
        </div>
        <ReadinessMeter value={patient.readiness}/>
      </div>
      {/* CARDS */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Card title="Recent Visits">
          {d.visits.length > 0 ? d.visits.map((v,i)=><div key={i}>• {v.type}</div>) : <div>No visits</div>}
        </Card>
        <Card title="Care Gaps">
          {d.careGaps.length > 0 ? d.careGaps.map((g,i)=><div key={i}>• {g}</div>) : <div>No gaps</div>}
        </Card>
        <Card title="Allergies">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <div style={{color:"green", fontWeight:"bold", marginBottom:4}}>Reconciled:</div>
              {d.allergies.reconciled.length > 0 ? d.allergies.reconciled.map((a,i)=><div key={i}>• {a}</div>) : <div>• None</div>}
            </div>
            <div>
              <div style={{color:"red", fontWeight:"bold", marginBottom:4}}>Unreconciled:</div>
              {d.allergies.unreconciled.length > 0 ? d.allergies.unreconciled.map((a,i)=><div key={i}>• {a}</div>) : <div>• None</div>}
            </div>
          </div>
        </Card>
        <Card title="Medications">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <div style={{color:"green", fontWeight:"bold", marginBottom:4}}>Reconciled:</div>
              {d.medications.reconciled.length > 0 ? d.medications.reconciled.map((m,i)=><div key={i}>• {m}</div>) : <div>• None</div>}
            </div>
            <div>
              <div style={{color:"red", fontWeight:"bold", marginBottom:4}}>Unreconciled:</div>
              {d.medications.unreconciled.length > 0 ? d.medications.unreconciled.map((m,i)=><div key={i}>• {m}</div>) : <div>• None</div>}
            </div>
          </div>
        </Card>
        <Card title="Immunizations">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <div style={{color:"green", fontWeight:"bold", marginBottom:4}}>Reconciled:</div>
              {d.immunizations.reconciled.length > 0 ? d.immunizations.reconciled.map((im,i)=><div key={i}>• {im}</div>) : <div>• None</div>}
            </div>
            <div>
              <div style={{color:"red", fontWeight:"bold", marginBottom:4}}>Unreconciled:</div>
              {d.immunizations.unreconciled.length > 0 ? d.immunizations.unreconciled.map((im,i)=><div key={i}>• {im}</div>) : <div>• None</div>}
            </div>
          </div>
        </Card>
        <Card title="Nurse Summary">• {d.nurseSummary}</Card>
      </div>
      {/* ROI TABLE */}
      <div style={card}>
        <h3>Requested ROI</h3>
        <table style={{ width:"100%", borderCollapse:"collapse", textAlign:"left" }}>
          <thead>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Facility</th>
              <th style={th}>Requested Date</th>
              <th style={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {d.roi.map(r=>(
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
      {/* BUTTON */}
      <button
        style={{
          ...primaryBtn,
          display: "inline-block",
          alignSelf: "flex-start",
          minWidth: 0,
          marginTop: 8,
          padding: "4px 12px",
          fontSize: 13
        }}
        onClick={onCreateROI}
      >
        New ROI Request
      </button>
    </div>
  );
}
// ---------------- CREATE ROI ----------------
function CreateROIPage({ patient, onBack, onSubmit }) {
  const [facilityName,setFacilityName]=useState("");
  const [facilityFax,setFacilityFax]=useState("");
  const [roiType,setROIType]=useState("Patient Signature Required");
  const [records,setRecords]=useState({
    behavioralHealth:false,
    emergencyDept:false,
    operativeNotes:false,
    providerNotes:false,
    therapyNotes:false,
    otherDocument:""
  });
  const [additional,setAdditional]=useState({
    allergyList:false,
    immunizations:false,
    medicationList:false,
    labResults:false,
    hivLab:false,
    geneticTesting:false,
    pathology:false,
    ekg:false,
    radiologyReport:false,
    radiologyImages:false,
    billingInfo:false
  });
  const [substance,setSubstance]=useState({
    assessment:false,
    historyPhysical:false,
    multidisciplinaryNotes:false,
    familyParticipation:false,
    questionnaires:false,
    treatmentSummary:false,
    treatmentPlans:false,
    other:""
  });
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24, maxWidth:1000, margin:"0 auto", paddingLeft:24, paddingRight:24 }}>
      <button style={backBtn} onClick={onBack}>← Back</button>
      {/* Page header */}
      <h2 style={{ textAlign: "center", marginBottom: 0, color: "#222" }}>New ROI Request</h2>
      <div style={{ textAlign: "center", color: "#222", marginBottom: 16 }}>
        Patient Name: <span style={{ color: "#222" }}>{patient.name}</span>
      </div>
      <div style={card}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
          <div>
            <label style={{display:"block", marginBottom:6, fontSize:14, fontWeight:"bold"}}>ROI Type</label>
            <select style={input} value={roiType} onChange={e=>setROIType(e.target.value)}>
              <option>Patient Signature Required</option>
              <option>Facility To Facility</option>
            </select>
          </div>
          <div>
            <label style={{display:"block", marginBottom:6, fontSize:14, fontWeight:"bold"}}>Facility Name</label>
            <input style={input} value={facilityName} onChange={e=>setFacilityName(e.target.value)} />
          </div>
          <div>
            <label style={{display:"block", marginBottom:6, fontSize:14, fontWeight:"bold"}}>Facility Fax</label>
            <input style={input} value={facilityFax} onChange={e=>setFacilityFax(e.target.value)} />
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
            <label style={{display:"block", marginBottom:4}}>Other</label>
            <input style={input} value={records.otherDocument} onChange={e=>setRecords({...records,otherDocument:e.target.value})}/>
          </div>
        </div>
      </SectionCard>
      <SectionCard title="Additional Records">
        <div style={grid3}>
          {Object.keys(additional).map(key =>
            <Checkbox key={key} label={key} obj={additional} k={key} set={setAdditional}/>
          )}
        </div>
      </SectionCard>
      <SectionCard title="Substance Abuse Records">
        <div style={grid2}>
          {Object.keys(substance).map(key =>
            key==="other"
              ? <div key={key}><label style={{display:"block", marginBottom:4}}>Other</label><input style={input} placeholder="" value={substance[key]} onChange={e=>setSubstance({...substance,other:e.target.value})}/></div>
              : <Checkbox key={key} label={key} obj={substance} k={key} set={setSubstance}/>
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
          padding: "4px 12px",
          fontSize: 13
        }}
        onClick={() =>
          onSubmit({
            id: Date.now(),
            facility: facilityName,
            status: roiType
          })
        }
      >
        Trigger ROI Request
      </button>
    </div>
  );
}
// ---------------- COMPONENTS ----------------
function Card({ title, children }) {
  return (
    <div style={card}>
      <h4 style={{textAlign:"center", marginTop:4, marginBottom:12}}>{title}</h4>
      <div style={{textAlign:"left", fontSize:14}}>{children}</div>
    </div>
  );
}
function SectionCard({ title, children }) {
  return (
    <div style={card}>
      <h3 style={{ marginTop:4, marginBottom:12, textAlign:"center" }}>{title}</h3>
      <div style={{textAlign:"left", fontSize:14}}>{children}</div>
    </div>
  );
}
function Checkbox({ label, obj, k, set }) {
  return (
    <label style={{ display:"flex", gap:6, textAlign:"left", fontSize:14, alignItems:"center" }}>
      <input type="checkbox" checked={obj[k]} onChange={e=>set({...obj,[k]:e.target.checked})} style={{ accentColor:"#2563eb", appearance:"none", width:18, height:18, border:"2px solid #999", borderRadius:3, cursor:"pointer", background:"#fff" }}/>
      {label}
    </label>
  );
}
function ReadinessMeter({ value }) {
  const color=value<40?"red":value<80?"orange":"green";
  return (
    <div style={{textAlign:"left", fontSize:14}}>
      <div><b>Readiness:</b> {value}%</div>
      <div style={{ background:"#ddd", height:8 }}>
        <div style={{ width:value+"%", height:8, background:color }}/>
      </div>
    </div>
  );
}
// ---------------- STYLES ----------------
const card = { background:"#fff", padding:16, border:"1px solid #ddd", borderRadius:6 };
const input = { width:"100%", padding:6, fontSize:12, marginTop:4, border:"1px solid #ccc", borderRadius:4, background:"#fff" };
const grid2 = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 };
const grid3 = { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 };
const primaryBtn = { padding: "6px 18px", fontSize: 14, background: "#2563eb", color: "#fff", border: "none", borderRadius: 4, minWidth: 0 };
const backBtn = { width:100, padding:4, fontSize:14, background:"#2563eb", color:"#fff", border:"none", borderRadius:4 };
function nav(active){
  return { padding:"8px 0", cursor:"pointer", fontWeight:active?"bold":"normal", color:active?"#2563eb":"#444" };
}
// ---------------- DASHBOARD ----------------
function DashboardPage({ patients }) {
  const totalUpcoming = patients.filter(p => p.status !== "Completed").length;
  const totalCompleted = patients.filter(p => p.status === "Completed").length;
  const newCount = patients.filter(p => p.status === "New").length;
  const inProgressCount = patients.filter(p => p.status === "In Progress").length;
  const completedCount = patients.filter(p => p.status === "Completed").length;

  // Get unique APRNs with visit counts for today
  const aprnStats = {};
  visitsToday.forEach(v => {
    if (!aprnStats[v.aprn]) {
      aprnStats[v.aprn] = { total: 0, pending: 0, completed: 0 };
    }
    aprnStats[v.aprn].total++;
    if (v.status === "Pending") {
      aprnStats[v.aprn].pending++;
    } else {
      aprnStats[v.aprn].completed++;
    }
  });

  return (
    <div>
      <h2 style={{ color: "#222", textAlign: "left", marginBottom: 24, fontSize: 28, fontWeight: "bold" }}>Dashboard</h2>
      
      {/* Stat Cards - 2 Column */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, marginBottom: 28 }}>
        <StatCard title="Total Upcoming" value={totalUpcoming} color="#3b82f6"/>
        <StatCard title="Total Completed" value={totalCompleted} color="#10b981"/>
      </div>

      {/* Weekly Trend - Full Width */}
      <Card title="Weekly Visits Trend - YTD">
        <div style={{ position: "relative", height: 280, marginBottom: 20 }}>
          <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y, i) => (
              <line key={`grid-${i}`} x1="50" y1={240 - (y / 100) * 200} x2="95%" y2={240 - (y / 100) * 200} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4"/>
            ))}
            {/* Y-axis labels */}
            {[0, 5, 10, 15, 20, 25].map((val, i) => (
              <text key={`label-${i}`} x="38" y={245 - (val / 25) * 200} fontSize="12" fill="#666" textAnchor="end" fontWeight="500">{val}</text>
            ))}
            {/* Median line */}
            {(() => {
              const median = weeklyVisits.length > 0 
                ? weeklyVisits.slice().sort((a, b) => a.visits - b.visits)[Math.floor(weeklyVisits.length / 2)].visits
                : 0;
              const medianY = 240 - (median / 25) * 200;
              return (
                <>
                  <line key="median-line" x1="50" y1={medianY} x2="95%" y2={medianY} stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6"/>
                  <text x="96%" y={medianY - 8} fontSize="11" fill="#f59e0b" textAnchor="end" fontWeight="bold">Median: {median}</text>
                </>
              );
            })()}
            {/* Peak line */}
            {(() => {
              const peak = weeklyVisits.length > 0 ? Math.max(...weeklyVisits.map(v => v.visits)) : 0;
              const peakY = 240 - (peak / 25) * 200;
              return (
                <>
                  <line key="peak-line" x1="50" y1={peakY} x2="95%" y2={peakY} stroke="#ef4444" strokeWidth="2.5" strokeDasharray="6"/>
                  <text x="96%" y={peakY - 8} fontSize="11" fill="#ef4444" textAnchor="end" fontWeight="bold">Peak: {peak}</text>
                </>
              );
            })()}
            {/* Line chart with fill */}
            {weeklyVisits.length > 0 && (
              <>
                <polyline
                  points={weeklyVisits.map((item, i) => {
                    const chartWidth = 600;
                    const x = 50 + (i / (weeklyVisits.length - 1)) * (chartWidth - 100);
                    const y = 240 - (item.visits / 25) * 200;
                    return `${x},${y}`;
                  }).join(" ")}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}
            {/* Data points */}
            {weeklyVisits.map((item, i) => {
              const chartWidth = 600;
              const x = 50 + (i / (weeklyVisits.length - 1)) * (chartWidth - 100);
              const y = 240 - (item.visits / 25) * 200;
              return (
                <g key={`point-${i}`}>
                  <circle cx={x} cy={y} r="5" fill="#fff" stroke="#2563eb" strokeWidth="2.5"/>
                  <text x={x} y={y - 16} fontSize="13" fill="#2563eb" textAnchor="middle" fontWeight="bold">{item.visits}</text>
                </g>
              );
            })}
            {/* X-axis labels */}
            {weeklyVisits.map((item, i) => {
              const chartWidth = 600;
              const x = 50 + (i / (weeklyVisits.length - 1)) * (chartWidth - 100);
              return (
                <text key={`week-${i}`} x={x} y={260} fontSize="12" fill="#666" textAnchor="middle" fontWeight="500">{item.week}</text>
              );
            })}
          </svg>
        </div>
      </Card>

      {/* Stage and Status - 2 Column */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        <Card title="Stage Distribution">
          <PieChart data={stages.map((stage, i) => ({
            label: stage,
            value: patients.filter(p => p.stage === stage).length,
            color: colors[i]
          }))}/>
        </Card>
        <Card title="Status Overview">
          <PieChart data={[
            { label: "New", value: newCount, color: "#2563eb" },
            { label: "In Progress", value: inProgressCount, color: "#facc15" },
            { label: "Completed", value: completedCount, color: "#16a34a" }
          ]}/>
        </Card>
      </div>

      {/* APRN Summary - Full Width */}
      <Card title="APRN Visit Summary - Today">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafb" }}>
              <th style={{ ...td, fontWeight: "bold", borderBottom: "2px solid #2563eb", textAlign: "left", padding: 12 }}>APRN</th>
              <th style={{ ...td, fontWeight: "bold", borderBottom: "2px solid #2563eb", textAlign: "center", padding: 12 }}>Upcoming</th>
              <th style={{ ...td, fontWeight: "bold", borderBottom: "2px solid #2563eb", textAlign: "center", padding: 12 }}>Completed</th>
              <th style={{ ...td, fontWeight: "bold", borderBottom: "2px solid #2563eb", textAlign: "center", padding: 12 }}>Total Visits</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(aprnStats).map(([aprn, stats], idx) => (
              <tr key={aprn} style={{ background: idx % 2 === 0 ? "#fff" : "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ ...td, fontSize: 13, padding: 12, fontWeight: "500" }}>{aprn}</td>
                <td style={{ ...td, fontSize: 13, textAlign: "center", color: "#ef4444", fontWeight: "bold", padding: 12 }}>{stats.pending}</td>
                <td style={{ ...td, fontSize: 13, textAlign: "center", color: "#16a34a", fontWeight: "bold", padding: 12 }}>{stats.completed}</td>
                <td style={{ ...td, fontSize: 13, textAlign: "center", fontWeight: "bold", padding: 12, borderRadius: "4px", background: "#f3f4f6" }}>{stats.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* ROI Requests - Full Width */}
      <Card title="Recent ROI Requests">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafb" }}>
              <th style={{ ...td, fontWeight: "bold", borderBottom: "2px solid #2563eb", textAlign: "left", padding: 12 }}>Patient</th>
              <th style={{ ...td, fontWeight: "bold", borderBottom: "2px solid #2563eb", textAlign: "left", padding: 12 }}>Facility</th>
              <th style={{ ...td, fontWeight: "bold", borderBottom: "2px solid #2563eb", textAlign: "left", padding: 12 }}>Requested Date</th>
              <th style={{ ...td, fontWeight: "bold", borderBottom: "2px solid #2563eb", textAlign: "center", padding: 12 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {roiRequests.map((roi, idx) => (
              <tr key={roi.id} style={{ background: idx % 2 === 0 ? "#fff" : "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ ...td, fontSize: 13, padding: 12, fontWeight: "500" }}>{roi.patient}</td>
                <td style={{ ...td, fontSize: 13, padding: 12 }}>{roi.facility}</td>
                <td style={{ ...td, fontSize: 13, padding: 12 }}>{roi.requestedDate}</td>
                <td style={{ ...td, fontSize: 12, textAlign: "center", padding: 12 }}>
                  <span style={{ 
                    padding: "4px 12px", 
                    borderRadius: "6px", 
                    background: roi.status === "Completed" ? "#dcfce7" : roi.status === "Sent to Facility" ? "#dbeafe" : "#fee2e2",
                    color: roi.status === "Completed" ? "#166534" : roi.status === "Sent to Facility" ? "#1e40af" : "#991b1b",
                    fontWeight: "600",
                    fontSize: 12
                  }}>
                    {roi.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
function StatCard({ title, value, color }) {
  return (
    <div style={{ ...card, borderLeft: `4px solid ${color}` }}>
      <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: "bold", color }}>{value}</div>
    </div>
  );
}
function PieChart({ data }) {
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
