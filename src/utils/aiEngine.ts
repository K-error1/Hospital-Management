import { UserRole } from '../types';
import {
  patients,
  doctors,
  nurses,
  appointments,
  prescriptions,
  vitalSigns,
  departments,
  billingRecords,
} from '../data/mockData';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface QuickAction {
  label: string;
  query: string;
  icon: string;
}

const quickActionsByRole: Record<UserRole, QuickAction[]> = {
  administrator: [
    { label: 'Hospital Overview', query: 'Give me a hospital overview', icon: '📊' },
    { label: 'Bed Availability', query: 'Show bed availability across departments', icon: '🛏️' },
    { label: 'Staff Summary', query: 'How many doctors and nurses do we have?', icon: '👥' },
    { label: 'Revenue Report', query: 'Show me the revenue summary', icon: '💰' },
    { label: 'Critical Patients', query: 'Are there any critical patients?', icon: '🚨' },
    { label: 'Pending Bills', query: 'Show pending billing records', icon: '📄' },
  ],
  doctor: [
    { label: 'My Patients', query: 'Show me my patient list', icon: '🏥' },
    { label: "Today's Schedule", query: "What's my schedule for today?", icon: '📅' },
    { label: 'Critical Alerts', query: 'Any critical patients I should know about?', icon: '🚨' },
    { label: 'Pending Prescriptions', query: 'Show recent prescriptions I wrote', icon: '💊' },
    { label: 'Patient Vitals', query: 'Show latest vitals for my patients', icon: '❤️' },
    { label: 'Appointment Stats', query: 'How many appointments do I have this week?', icon: '📊' },
  ],
  nurse: [
    { label: 'Assigned Patients', query: 'Show my assigned patients', icon: '🏥' },
    { label: 'Pending Vitals', query: 'Which patients need vitals checked?', icon: '❤️' },
    { label: 'Medication Schedule', query: 'What medications are due?', icon: '💊' },
    { label: 'Ward Status', query: 'Show me the ward status', icon: '🛏️' },
    { label: 'Critical Patients', query: 'Any critical patients in my ward?', icon: '🚨' },
    { label: 'Shift Info', query: 'Tell me about my current shift', icon: '🕐' },
  ],
  patient: [
    { label: 'My Appointments', query: 'Show my upcoming appointments', icon: '📅' },
    { label: 'My Medications', query: 'What medications am I taking?', icon: '💊' },
    { label: 'My Vitals', query: 'Show my latest vital signs', icon: '❤️' },
    { label: 'My Doctor', query: 'Who is my assigned doctor?', icon: '👨‍⚕️' },
    { label: 'My Bills', query: 'Show my billing summary', icon: '💰' },
    { label: 'Health Tips', query: 'Give me some health tips for my condition', icon: '💡' },
  ],
};

export function getQuickActions(role: UserRole): QuickAction[] {
  return quickActionsByRole[role];
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateAIResponse(
  query: string,
  role: UserRole,
  userId: string
): Promise<string> {
  // Simulate thinking delay
  await delay(600 + Math.random() * 1000);

  const q = query.toLowerCase().trim();

  // ── ADMINISTRATOR RESPONSES ──
  if (role === 'administrator') {
    return generateAdminResponse(q);
  }

  // ── DOCTOR RESPONSES ──
  if (role === 'doctor') {
    return generateDoctorResponse(q, userId);
  }

  // ── NURSE RESPONSES ──
  if (role === 'nurse') {
    return generateNurseResponse(q, userId);
  }

  // ── PATIENT RESPONSES ──
  if (role === 'patient') {
    return generatePatientResponse(q, userId);
  }

  return getGenericResponse(q);
}

function generateAdminResponse(q: string): string {
  // Hospital Overview
  if (matchesAny(q, ['overview', 'summary', 'hospital status', 'how is the hospital', 'dashboard'])) {
    const totalPatients = patients.length;
    const admitted = patients.filter((p) => p.status === 'Admitted').length;
    const critical = patients.filter((p) => p.status === 'Critical').length;
    const outpatient = patients.filter((p) => p.status === 'Outpatient').length;
    const totalDocs = doctors.length;
    const availableDocs = doctors.filter((d) => d.status === 'Available').length;
    const totalNurses = nurses.length;
    const onDutyNurses = nurses.filter((n) => n.status === 'On Duty').length;
    const totalBeds = departments.reduce((s, d) => s + d.bedsTotal, 0);
    const occupiedBeds = departments.reduce((s, d) => s + d.bedsOccupied, 0);
    const occupancy = ((occupiedBeds / totalBeds) * 100).toFixed(1);

    return `## 🏥 Hospital Overview

Here's the current status of MediCare Hospital:

**📋 Patient Statistics**
• Total Patients: **${totalPatients}**
• Admitted: **${admitted}** | Critical: **${critical}** | Outpatient: **${outpatient}**

**👨‍⚕️ Staff**
• Doctors: **${totalDocs}** (${availableDocs} available)
• Nurses: **${totalNurses}** (${onDutyNurses} on duty)

**🛏️ Bed Occupancy**
• Total Beds: **${totalBeds}** | Occupied: **${occupiedBeds}** | Available: **${totalBeds - occupiedBeds}**
• Occupancy Rate: **${occupancy}%**

${critical > 0 ? `\n⚠️ **Alert:** There ${critical === 1 ? 'is' : 'are'} **${critical}** critical patient${critical > 1 ? 's' : ''} requiring immediate attention.` : '✅ No critical alerts at this time.'}

Is there anything specific you'd like to drill into?`;
  }

  // Bed availability
  if (matchesAny(q, ['bed', 'occupancy', 'availability', 'rooms'])) {
    let response = `## 🛏️ Bed Availability by Department\n\n`;
    departments.forEach((dept) => {
      const available = dept.bedsTotal - dept.bedsOccupied;
      const occupancy = ((dept.bedsOccupied / dept.bedsTotal) * 100).toFixed(0);
      const bar = getProgressBar(dept.bedsOccupied, dept.bedsTotal);
      const status = parseInt(occupancy) > 85 ? '🔴' : parseInt(occupancy) > 60 ? '🟡' : '🟢';
      response += `**${dept.name}** ${status}\n${bar} ${occupancy}%\n${available} of ${dept.bedsTotal} beds available\n\n`;
    });
    const totalBeds = departments.reduce((s, d) => s + d.bedsTotal, 0);
    const totalOccupied = departments.reduce((s, d) => s + d.bedsOccupied, 0);
    response += `---\n**Total Available:** ${totalBeds - totalOccupied} beds across all departments`;
    return response;
  }

  // Staff
  if (matchesAny(q, ['staff', 'how many doctors', 'how many nurses', 'personnel', 'employees'])) {
    const availDocs = doctors.filter((d) => d.status === 'Available').length;
    const busyDocs = doctors.filter((d) => d.status === 'Busy' || d.status === 'In Surgery').length;
    const leaveDocs = doctors.filter((d) => d.status === 'On Leave').length;
    const onDuty = nurses.filter((n) => n.status === 'On Duty').length;
    const offDuty = nurses.filter((n) => n.status === 'Off Duty').length;

    return `## 👥 Staff Summary

**👨‍⚕️ Doctors (${doctors.length} total)**
• ✅ Available: **${availDocs}**
• 🔴 Busy/In Surgery: **${busyDocs}**
• 📴 On Leave: **${leaveDocs}**

| Doctor | Specialization | Status | Patients |
|--------|---------------|--------|----------|
${doctors.map((d) => `| ${d.name} | ${d.specialization} | ${d.status} | ${d.patientsCount} |`).join('\n')}

**👩‍⚕️ Nurses (${nurses.length} total)**
• ✅ On Duty: **${onDuty}**
• 📴 Off Duty: **${offDuty}**

| Nurse | Department | Shift | Ward |
|-------|-----------|-------|------|
${nurses.map((n) => `| ${n.name} | ${n.department} | ${n.shift} | ${n.assignedWard} |`).join('\n')}`;
  }

  // Revenue / Billing
  if (matchesAny(q, ['revenue', 'billing', 'income', 'money', 'financial'])) {
    const totalRevenue = billingRecords.reduce((s, b) => s + b.totalAmount, 0);
    const paid = billingRecords.filter((b) => b.status === 'Paid').reduce((s, b) => s + b.totalAmount, 0);
    const pending = billingRecords.filter((b) => b.status === 'Pending').reduce((s, b) => s + b.totalAmount, 0);
    const insurance = billingRecords.reduce((s, b) => s + b.insuranceCovered, 0);

    return `## 💰 Revenue Summary

**Financial Overview**
• Total Billed: **$${totalRevenue.toLocaleString()}**
• ✅ Collected: **$${paid.toLocaleString()}**
• ⏳ Pending: **$${pending.toLocaleString()}**
• 🏦 Insurance Coverage: **$${insurance.toLocaleString()}**
• 💵 Patient Responsibility: **$${(totalRevenue - insurance).toLocaleString()}**

**Recent Bills**
${billingRecords
  .map(
    (b) =>
      `• ${b.patientName} — $${b.totalAmount.toLocaleString()} (${b.status === 'Paid' ? '✅ Paid' : '⏳ Pending'})`
  )
  .join('\n')}

Collection Rate: **${((paid / totalRevenue) * 100).toFixed(1)}%**`;
  }

  // Critical patients
  if (matchesAny(q, ['critical', 'emergency', 'urgent', 'alert', 'danger'])) {
    const criticalPatients = patients.filter((p) => p.status === 'Critical');
    if (criticalPatients.length === 0) {
      return `## ✅ No Critical Patients\n\nThere are currently no patients in critical condition. All admitted patients are stable.`;
    }
    return `## 🚨 Critical Patient Alert

There ${criticalPatients.length === 1 ? 'is' : 'are'} **${criticalPatients.length}** critical patient${criticalPatients.length > 1 ? 's' : ''}:

${criticalPatients
  .map((p) => {
    const doc = doctors.find((d) => d.id === p.assignedDoctor);
    const latestVitals = vitalSigns.filter((v) => v.patientId === p.id).sort((a, b) => b.time.localeCompare(a.time))[0];
    return `### ${p.name} (Room: ${p.room || 'N/A'})
• **Diagnosis:** ${p.diagnosis}
• **Assigned Doctor:** ${doc?.name || 'N/A'}
• **Blood Group:** ${p.bloodGroup} | Age: ${p.age}
${latestVitals ? `• **Latest Vitals:** BP ${latestVitals.bloodPressure} | HR ${latestVitals.heartRate} bpm | SpO₂ ${latestVitals.oxygenLevel}%` : '• No recent vitals recorded'}`;
  })
  .join('\n\n')}

⚠️ *Immediate medical attention may be required.*`;
  }

  // Pending bills
  if (matchesAny(q, ['pending bill', 'unpaid', 'outstanding', 'due payment'])) {
    const pendingBills = billingRecords.filter((b) => b.status === 'Pending');
    const totalPending = pendingBills.reduce((s, b) => s + b.totalAmount, 0);
    return `## 📄 Pending Bills

**${pendingBills.length}** bills pending | Total: **$${totalPending.toLocaleString()}**

${pendingBills
  .map(
    (b) =>
      `• **${b.patientName}** — $${b.totalAmount.toLocaleString()} (Insurance: $${b.insuranceCovered.toLocaleString()}, Patient owes: $${(b.totalAmount - b.insuranceCovered).toLocaleString()})`
  )
  .join('\n')}

Would you like me to provide details on any specific bill?`;
  }

  // Appointments
  if (matchesAny(q, ['appointment', 'schedule', 'booking'])) {
    const scheduled = appointments.filter((a) => a.status === 'Scheduled').length;
    const completed = appointments.filter((a) => a.status === 'Completed').length;
    const inProgress = appointments.filter((a) => a.status === 'In Progress').length;
    return `## 📅 Appointment Summary

• 📋 Scheduled: **${scheduled}**
• ▶️ In Progress: **${inProgress}**
• ✅ Completed: **${completed}**

**Upcoming Appointments:**
${appointments
  .filter((a) => a.status === 'Scheduled')
  .map((a) => `• ${a.patientName} → ${a.doctorName} | ${a.date} at ${a.time} (${a.type})`)
  .join('\n')}`;
  }

  // Departments
  if (matchesAny(q, ['department', 'ward', 'unit', 'section'])) {
    return `## 🏢 Department Overview

${departments
  .map(
    (d) =>
      `**${d.name}** — Head: ${d.head}
  • Doctors: ${d.doctorsCount} | Nurses: ${d.nursesCount}
  • Beds: ${d.bedsOccupied}/${d.bedsTotal} occupied (${((d.bedsOccupied / d.bedsTotal) * 100).toFixed(0)}%)`
  )
  .join('\n\n')}`;
  }

  return getGenericResponse(q);
}

function generateDoctorResponse(q: string, userId: string): string {
  const myPatients = patients.filter((p) => p.assignedDoctor === userId);
  const myAppointments = appointments.filter((a) => a.doctorId === userId);
  const myPrescriptions = prescriptions.filter((p) => p.doctorId === userId);
  const currentDoctor = doctors.find((d) => d.id === userId);

  // My patients
  if (matchesAny(q, ['my patient', 'patient list', 'show patient', 'assigned patient'])) {
    if (myPatients.length === 0) {
      return `You currently have no patients assigned to you.`;
    }
    return `## 🏥 Your Patient List

You have **${myPatients.length}** patients under your care:

${myPatients
  .map((p) => {
    const latestVitals = vitalSigns.filter((v) => v.patientId === p.id).sort((a, b) => b.time.localeCompare(a.time))[0];
    return `### ${p.status === 'Critical' ? '🔴' : p.status === 'Admitted' ? '🟡' : '🟢'} ${p.name}
• **Status:** ${p.status} ${p.room ? `| Room: ${p.room}` : ''}
• **Diagnosis:** ${p.diagnosis || 'N/A'}
• **Age:** ${p.age} | **Blood Group:** ${p.bloodGroup}
${latestVitals ? `• **Latest Vitals:** BP ${latestVitals.bloodPressure} | HR ${latestVitals.heartRate} | SpO₂ ${latestVitals.oxygenLevel}%` : ''}`;
  })
  .join('\n\n')}`;
  }

  // Schedule / today
  if (matchesAny(q, ['schedule', 'today', "what's my", 'upcoming', 'calendar'])) {
    const scheduled = myAppointments.filter((a) => a.status === 'Scheduled' || a.status === 'In Progress');
    return `## 📅 Your Schedule

${currentDoctor ? `**${currentDoctor.name}** — ${currentDoctor.specialization}` : ''}

**Upcoming Appointments (${scheduled.length}):**

${scheduled.length > 0
  ? scheduled
      .map(
        (a) =>
          `• **${a.time}** — ${a.patientName} (${a.type}) ${a.status === 'In Progress' ? '▶️ In Progress' : '📋 Scheduled'}${a.notes ? `\n  _${a.notes}_` : ''}`
      )
      .join('\n')
  : '✅ No upcoming appointments. Your schedule is clear!'}

**Completed Today:** ${myAppointments.filter((a) => a.status === 'Completed').length}`;
  }

  // Critical alerts
  if (matchesAny(q, ['critical', 'alert', 'emergency', 'urgent', 'danger'])) {
    const criticalPatients = myPatients.filter((p) => p.status === 'Critical');
    if (criticalPatients.length === 0) {
      return `## ✅ No Critical Alerts\n\nAll your patients are currently stable. No immediate attention needed.`;
    }
    return `## 🚨 Critical Patient Alert

**${criticalPatients.length}** of your patients ${criticalPatients.length === 1 ? 'is' : 'are'} in critical condition:

${criticalPatients
  .map((p) => {
    const latestVitals = vitalSigns.filter((v) => v.patientId === p.id).sort((a, b) => b.time.localeCompare(a.time))[0];
    return `### 🔴 ${p.name} — Room: ${p.room || 'N/A'}
• **Diagnosis:** ${p.diagnosis}
• **Admitted:** ${p.admissionDate}
${latestVitals ? `• **Latest Vitals:** Temp ${latestVitals.temperature}°F | BP ${latestVitals.bloodPressure} | HR ${latestVitals.heartRate} bpm | SpO₂ ${latestVitals.oxygenLevel}%${latestVitals.notes ? `\n• **Note:** ${latestVitals.notes}` : ''}` : '• No recent vitals available'}`;
  })
  .join('\n\n')}

⚠️ *Please review and take appropriate action.*`;
  }

  // Prescriptions
  if (matchesAny(q, ['prescription', 'medication', 'medicine', 'drug', 'wrote'])) {
    return `## 💊 Your Recent Prescriptions

You have written **${myPrescriptions.length}** prescriptions:

${myPrescriptions
  .map(
    (p) =>
      `### ${p.patientName} — ${p.date}
• **Diagnosis:** ${p.diagnosis}
• **Medications:** ${p.medications.map((m) => `${m.name} (${m.dosage}, ${m.frequency})`).join(', ')}
${p.notes ? `• _Note: ${p.notes}_` : ''}`
  )
  .join('\n\n')}`;
  }

  // Vitals
  if (matchesAny(q, ['vital', 'blood pressure', 'heart rate', 'temperature', 'oxygen'])) {
    const patientVitals = myPatients.map((p) => {
      const latest = vitalSigns.filter((v) => v.patientId === p.id).sort((a, b) => b.time.localeCompare(a.time))[0];
      return { patient: p, vitals: latest };
    });
    return `## ❤️ Latest Vitals for Your Patients

${patientVitals
  .map(
    ({ patient, vitals }) =>
      `**${patient.name}** (${patient.status})
${vitals ? `• Temp: ${vitals.temperature}°F | BP: ${vitals.bloodPressure} | HR: ${vitals.heartRate} bpm | SpO₂: ${vitals.oxygenLevel}%
• Recorded: ${vitals.date} at ${vitals.time}` : '• _No vitals recorded yet_'}`
  )
  .join('\n\n')}`;
  }

  // Appointment stats
  if (matchesAny(q, ['how many appointment', 'appointment stat', 'appointment count'])) {
    return `## 📊 Appointment Statistics

• Total Appointments: **${myAppointments.length}**
• ✅ Completed: **${myAppointments.filter((a) => a.status === 'Completed').length}**
• 📋 Scheduled: **${myAppointments.filter((a) => a.status === 'Scheduled').length}**
• ▶️ In Progress: **${myAppointments.filter((a) => a.status === 'In Progress').length}**
• ❌ Cancelled: **${myAppointments.filter((a) => a.status === 'Cancelled').length}**

By Type:
• Consultation: ${myAppointments.filter((a) => a.type === 'Consultation').length}
• Follow-up: ${myAppointments.filter((a) => a.type === 'Follow-up').length}
• Emergency: ${myAppointments.filter((a) => a.type === 'Emergency').length}
• Surgery: ${myAppointments.filter((a) => a.type === 'Surgery').length}`;
  }

  return getGenericResponse(q);
}

function generateNurseResponse(q: string, userId: string): string {
  const currentNurse = nurses.find((n) => n.id === userId);
  const myPatients_ = patients.filter((p) => p.assignedNurse === userId);
  const myVitals = vitalSigns.filter((v) => v.nurseId === userId);

  // Assigned patients
  if (matchesAny(q, ['assign', 'my patient', 'patient list', 'show patient'])) {
    return `## 🏥 Your Assigned Patients

${currentNurse ? `**${currentNurse.name}** — ${currentNurse.department} | ${currentNurse.shift} Shift | ${currentNurse.assignedWard}` : ''}

You have **${myPatients_.length}** patients:

${myPatients_
  .map(
    (p) =>
      `### ${p.status === 'Critical' ? '🔴' : p.status === 'Admitted' ? '🟡' : '🟢'} ${p.name}
• **Status:** ${p.status} ${p.room ? `| Room: ${p.room}` : ''}
• **Diagnosis:** ${p.diagnosis || 'N/A'}
• **Doctor:** ${doctors.find((d) => d.id === p.assignedDoctor)?.name || 'N/A'}`
  )
  .join('\n\n')}`;
  }

  // Vitals
  if (matchesAny(q, ['vital', 'check', 'pending vital', 'blood pressure', 'temperature'])) {
    const recentVitals = myVitals.sort((a, b) => b.time.localeCompare(a.time));
    return `## ❤️ Vitals Summary

**Recently Recorded (${recentVitals.length} entries):**

${recentVitals
  .slice(0, 5)
  .map(
    (v) =>
      `• **${v.patientName}** (${v.date} at ${v.time})
  Temp: ${v.temperature}°F | BP: ${v.bloodPressure} | HR: ${v.heartRate} | SpO₂: ${v.oxygenLevel}%${v.notes ? ` | _${v.notes}_` : ''}`
  )
  .join('\n')}

**Patients Needing Vitals Check:**
${myPatients_
  .filter((p) => p.status === 'Admitted' || p.status === 'Critical')
  .map((p) => {
    const lastCheck = myVitals.filter((v) => v.patientId === p.id).sort((a, b) => b.time.localeCompare(a.time))[0];
    return `• ${p.name} — Last checked: ${lastCheck ? `${lastCheck.time}` : '⚠️ Not checked today'}`;
  })
  .join('\n')}`;
  }

  // Medications
  if (matchesAny(q, ['medication', 'medicine', 'drug', 'due', 'administer'])) {
    const patientMeds = myPatients_.map((p) => {
      const presc = prescriptions.find((pr) => pr.patientId === p.id);
      return { patient: p, prescription: presc };
    });
    return `## 💊 Medication Schedule

${patientMeds
  .filter((pm) => pm.prescription)
  .map(
    (pm) =>
      `### ${pm.patient.name} (Room: ${pm.patient.room || 'Outpatient'})
${pm.prescription!.medications.map((m) => `• **${m.name}** ${m.dosage} — ${m.frequency} (${m.duration})`).join('\n')}`
  )
  .join('\n\n')}

${patientMeds.filter((pm) => !pm.prescription).length > 0 ? `\n_${patientMeds.filter((pm) => !pm.prescription).map((pm) => pm.patient.name).join(', ')} — No active prescriptions_` : ''}`;
  }

  // Ward status
  if (matchesAny(q, ['ward', 'room', 'bed', 'floor'])) {
    const dept = departments.find((d) => d.name === currentNurse?.department);
    return `## 🛏️ Ward Status

**${currentNurse?.assignedWard || 'Your Ward'}** — ${currentNurse?.department || ''} Department

${dept ? `• Total Beds: **${dept.bedsTotal}**\n• Occupied: **${dept.bedsOccupied}**\n• Available: **${dept.bedsTotal - dept.bedsOccupied}**\n• Occupancy: **${((dept.bedsOccupied / dept.bedsTotal) * 100).toFixed(0)}%**` : ''}

**Patients in Ward:**
${myPatients_
  .filter((p) => p.room)
  .map((p) => `• Room **${p.room}**: ${p.name} (${p.status})`)
  .join('\n')}`;
  }

  // Critical patients
  if (matchesAny(q, ['critical', 'emergency', 'urgent', 'alert'])) {
    const critical = myPatients_.filter((p) => p.status === 'Critical');
    if (critical.length === 0) {
      return `## ✅ No Critical Patients\n\nAll your assigned patients are currently stable.`;
    }
    return `## 🚨 Critical Patients in Your Care

${critical
  .map((p) => {
    const vitals = vitalSigns.filter((v) => v.patientId === p.id).sort((a, b) => b.time.localeCompare(a.time))[0];
    return `### 🔴 ${p.name} — Room: ${p.room}
• Diagnosis: ${p.diagnosis}
• Doctor: ${doctors.find((d) => d.id === p.assignedDoctor)?.name}
${vitals ? `• Vitals: BP ${vitals.bloodPressure} | HR ${vitals.heartRate} | SpO₂ ${vitals.oxygenLevel}%` : '• ⚠️ No recent vitals'}`;
  })
  .join('\n\n')}

⚠️ Please ensure vitals are monitored frequently.`;
  }

  // Shift info
  if (matchesAny(q, ['shift', 'schedule', 'duty', 'work hour'])) {
    return `## 🕐 Shift Information

**${currentNurse?.name}**
• Department: **${currentNurse?.department}**
• Current Shift: **${currentNurse?.shift}**
• Status: **${currentNurse?.status}**
• Assigned Ward: **${currentNurse?.assignedWard}**
• Patients Under Care: **${currentNurse?.patientsCount}**

**Shift Hours:**
• Morning: 6:00 AM – 2:00 PM
• Afternoon: 2:00 PM – 10:00 PM
• Night: 10:00 PM – 6:00 AM`;
  }

  return getGenericResponse(q);
}

function generatePatientResponse(q: string, userId: string): string {
  const myData = patients.find((p) => p.id === userId);
  const myAppointments = appointments.filter((a) => a.patientId === userId);
  const myPrescriptions = prescriptions.filter((p) => p.patientId === userId);
  const myVitals = vitalSigns.filter((v) => v.patientId === userId);
  const myBills = billingRecords.filter((b) => b.patientId === userId);

  if (!myData) {
    return `I'm sorry, I couldn't find your patient records. Please contact the front desk for assistance.`;
  }

  // Appointments
  if (matchesAny(q, ['appointment', 'schedule', 'upcoming', 'visit', 'booking'])) {
    const upcoming = myAppointments.filter((a) => a.status === 'Scheduled');
    return `## 📅 Your Appointments

**Upcoming (${upcoming.length}):**
${upcoming.length > 0
  ? upcoming.map((a) => `• **${a.date}** at **${a.time}** with ${a.doctorName}\n  Type: ${a.type}${a.notes ? ` | _${a.notes}_` : ''}`).join('\n')
  : '_No upcoming appointments scheduled._'}

**Past Visits:**
${myAppointments
  .filter((a) => a.status === 'Completed')
  .map((a) => `• ${a.date} — ${a.doctorName} (${a.type}) ✅`)
  .join('\n') || '_No past visits recorded._'}

💡 You can schedule a new appointment from the Appointments page.`;
  }

  // Medications
  if (matchesAny(q, ['medication', 'medicine', 'drug', 'taking', 'prescription', 'pill'])) {
    if (myPrescriptions.length === 0) {
      return `## 💊 Medications\n\nYou don't have any active prescriptions. Please consult your doctor if you need medication.`;
    }
    return `## 💊 Your Current Medications

${myPrescriptions
  .map(
    (p) =>
      `**Prescribed by:** ${p.doctorName} on ${p.date}
**Diagnosis:** ${p.diagnosis}

${p.medications.map((m) => `• **${m.name}** ${m.dosage}\n  ${m.frequency} for ${m.duration}`).join('\n')}
${p.notes ? `\n📝 _Doctor's note: ${p.notes}_` : ''}`
  )
  .join('\n\n---\n\n')}

⚠️ Always take medications as prescribed. Contact your doctor if you experience any side effects.`;
  }

  // Vitals
  if (matchesAny(q, ['vital', 'blood pressure', 'heart rate', 'temperature', 'health stat', 'oxygen'])) {
    if (myVitals.length === 0) {
      return `## ❤️ Vital Signs\n\nNo vitals have been recorded yet. They will be updated during your next check-up.`;
    }
    const latest = myVitals.sort((a, b) => b.time.localeCompare(a.time))[0];
    return `## ❤️ Your Latest Vital Signs

**Last Recorded:** ${latest.date} at ${latest.time}

| Metric | Value | Status |
|--------|-------|--------|
| 🌡️ Temperature | ${latest.temperature}°F | ${latest.temperature > 99.5 ? '⚠️ Elevated' : '✅ Normal'} |
| 💉 Blood Pressure | ${latest.bloodPressure} | ${parseInt(latest.bloodPressure) > 140 ? '⚠️ High' : '✅ Normal'} |
| 💓 Heart Rate | ${latest.heartRate} bpm | ${latest.heartRate > 100 ? '⚠️ Elevated' : '✅ Normal'} |
| 🫁 Oxygen Level | ${latest.oxygenLevel}% | ${latest.oxygenLevel < 95 ? '⚠️ Low' : '✅ Normal'} |
${latest.weight ? `| ⚖️ Weight | ${latest.weight} kg | — |` : ''}

**Vitals History (${myVitals.length} records):**
${myVitals.sort((a, b) => b.time.localeCompare(a.time)).map((v) => `• ${v.date} ${v.time} — BP: ${v.bloodPressure}, HR: ${v.heartRate}, SpO₂: ${v.oxygenLevel}%`).join('\n')}`;
  }

  // Doctor
  if (matchesAny(q, ['my doctor', 'assigned doctor', 'who is my doctor', 'physician', 'specialist'])) {
    const doc = doctors.find((d) => d.id === myData.assignedDoctor);
    const nurse = nurses.find((n) => n.id === myData.assignedNurse);
    return `## 👨‍⚕️ Your Care Team

**Primary Doctor:**
• **${doc?.name || 'Not assigned'}**
• Specialization: ${doc?.specialization || 'N/A'}
• Department: ${doc?.department || 'N/A'}
• Experience: ${doc?.experience || 'N/A'}
• Qualification: ${doc?.qualification || 'N/A'}
• Contact: ${doc?.phone || 'N/A'}

**Assigned Nurse:**
• **${nurse?.name || 'Not assigned'}**
• Department: ${nurse?.department || 'N/A'}
• Shift: ${nurse?.shift || 'N/A'}
• Ward: ${nurse?.assignedWard || 'N/A'}

📞 For emergencies, please call the hospital emergency line.`;
  }

  // Billing
  if (matchesAny(q, ['bill', 'payment', 'cost', 'charge', 'insurance', 'money', 'pay'])) {
    if (myBills.length === 0) {
      return `## 💰 Billing\n\nYou don't have any bills on record. Billing is updated after consultations and procedures.`;
    }
    const totalDue = myBills.reduce((s, b) => s + b.totalAmount, 0);
    const insuranceCovered = myBills.reduce((s, b) => s + b.insuranceCovered, 0);
    return `## 💰 Your Billing Summary

• Total Charges: **$${totalDue.toLocaleString()}**
• Insurance Covered: **$${insuranceCovered.toLocaleString()}**
• Your Responsibility: **$${(totalDue - insuranceCovered).toLocaleString()}**

**Bills:**
${myBills
  .map(
    (b) =>
      `### Bill #${b.id} — ${b.date} (${b.status === 'Paid' ? '✅ Paid' : '⏳ Pending'})
${b.items.map((item) => `• ${item.description}: $${(item.amount * item.quantity).toLocaleString()}`).join('\n')}
**Total:** $${b.totalAmount.toLocaleString()}`
  )
  .join('\n\n')}

💡 Contact billing department for payment plans or insurance queries.`;
  }

  // Health tips
  if (matchesAny(q, ['health tip', 'advice', 'recommendation', 'wellness', 'self care', 'prevent'])) {
    const diagnosis = myData.diagnosis?.toLowerCase() || '';
    let tips = '';
    if (diagnosis.includes('heart') || diagnosis.includes('cardiac') || diagnosis.includes('coronary') || diagnosis.includes('hypertension') || diagnosis.includes('myocardial')) {
      tips = `Based on your cardiac condition:
• 🥗 Follow a heart-healthy diet (low sodium, low cholesterol)
• 🚶 Engage in moderate exercise (30 min walks daily)
• 🚭 Avoid smoking and limit alcohol
• 💊 Take your medications as prescribed
• 📊 Monitor your blood pressure regularly
• 😴 Get 7-8 hours of quality sleep
• 🧘 Practice stress management techniques`;
    } else if (diagnosis.includes('migraine')) {
      tips = `For managing your migraines:
• 💧 Stay well hydrated throughout the day
• 😴 Maintain a consistent sleep schedule
• 🖥️ Take regular breaks from screens
• 📝 Keep a headache diary to identify triggers
• 🧘 Practice relaxation techniques
• 🍫 Avoid known food triggers (chocolate, caffeine, alcohol)
• 💊 Take prescribed medications at first sign of migraine`;
    } else if (diagnosis.includes('fracture') || diagnosis.includes('orthop') || diagnosis.includes('hip')) {
      tips = `For your orthopedic recovery:
• 🏋️ Follow your physiotherapy exercises diligently
• 🦴 Ensure adequate calcium and Vitamin D intake
• 🚶 Gradually increase mobility as advised
• 🧊 Apply ice for swelling as needed
• 💊 Take pain medication as prescribed
• 📞 Report any unusual pain or swelling immediately`;
    } else {
      tips = `General wellness recommendations:
• 🥗 Eat a balanced, nutritious diet
• 💧 Drink 8 glasses of water daily
• 🚶 Get at least 30 minutes of exercise daily
• 😴 Sleep 7-8 hours per night
• 💊 Take all medications as prescribed
• 📅 Keep up with follow-up appointments
• 🧘 Manage stress through relaxation techniques`;
    }
    return `## 💡 Health Tips for You

**Your Condition:** ${myData.diagnosis || 'General Wellness'}

${tips}

_Always consult your doctor before making changes to your treatment plan._`;
  }

  return getGenericResponse(q);
}

function getGenericResponse(q: string): string {
  // Greetings
  if (matchesAny(q, ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy'])) {
    return `## 👋 Hello!

Welcome to MediCare AI Assistant! I'm here to help you with anything you need.

Here are some things I can help you with:
• 📊 View dashboards and summaries
• 🏥 Patient information
• 📅 Appointments and scheduling
• 💊 Medications and prescriptions
• ❤️ Vital signs and health data
• 💰 Billing and payments

Just ask me anything or use the quick action buttons below!`;
  }

  // Thank you
  if (matchesAny(q, ['thank', 'thanks', 'appreciate'])) {
    return `You're welcome! 😊 I'm always here to help. Feel free to ask me anything else about the hospital system.`;
  }

  // Help
  if (matchesAny(q, ['help', 'what can you do', 'capabilities', 'features', 'how to use'])) {
    return `## 🤖 MediCare AI Assistant

I can help you with various tasks depending on your role:

**General Commands:**
• Ask about patients, doctors, nurses
• View appointments and schedules
• Check vital signs and health data
• Review billing and payments
• Get health tips and recommendations

**Tips:**
• Use the **quick action buttons** for common queries
• Be specific in your questions for better answers
• I have access to all hospital data relevant to your role

What would you like to know?`;
  }

  // Fallback
  return `I understand you're asking about "${q}". Let me help you with that!

Here are some things I can assist with:
• 📊 **Dashboard & Overview** — Ask about hospital status or your summary
• 🏥 **Patients** — View patient information and status
• 📅 **Appointments** — Check schedules and bookings
• 💊 **Medications** — View prescriptions and medication schedules
• ❤️ **Vitals** — Check vital signs and health metrics
• 💰 **Billing** — Review charges and payments

Try rephrasing your question or use the quick action buttons for common queries!`;
}

function matchesAny(input: string, keywords: string[]): boolean {
  return keywords.some((keyword) => input.includes(keyword));
}

function getProgressBar(value: number, max: number): string {
  const percentage = value / max;
  const filled = Math.round(percentage * 10);
  const empty = 10 - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}
