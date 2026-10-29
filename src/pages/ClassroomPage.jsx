import { useState } from 'react'
import { CalendarDays, Download, FileText, UsersRound } from 'lucide-react'
import { classroomMaterials, classroomMembers } from '../data/demoData.jsx'

const tabs = ['Overview', 'Materials', 'Meetings', 'Members']
const demoMeeting = { scheduledAt: '2026-11-03T11:00:00', status: 'Scheduled' }

function ClassroomPage({ onBack }) {
  const [activeTab, setActiveTab] = useState('Overview')
  return (
    <main className="classroom-page schema-classroom-page">
      <div className="classroom-breadcrumb"><button onClick={onBack}>My Learning</button><span>›</span><strong>Demo classroom</strong></div>
      <header className="classroom-heading"><div><p className="learner-eyebrow">DEMO CLASSROOM · NOT SAVED</p><h1>Python Fundamentals</h1></div><span className="schema-demo-tag">Sample</span></header>
      <nav className="classroom-tabs" role="tablist" aria-label="Demo classroom sections">{tabs.map(tab => <button key={tab} role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}</button>)}</nav>
      {activeTab === 'Overview' && <section className="classroom-grid schema-classroom-grid">
        <article className="classroom-card about-card"><h2>CLASSROOM OVERVIEW</h2><p>A sample classroom preview. The ER diagram connects classrooms to a course offering and stores its name, status, and rating.</p><div className="classroom-tags"><span>classroomName: Python Fundamentals</span><span>status: Active</span><span>rating: 4.8 · demo</span></div><h3 className="recent-materials-title">RECENT MATERIALS · DEMO</h3><div className="recent-materials">{classroomMaterials.slice(0, 2).map(material => <article key={material.title}><span className={`material-icon tone-${material.tone}`}><FileText size={21} /></span><span><strong>{material.title}</strong><small>{material.type} · sample file</small></span></article>)}</div></article>
        <article className="classroom-card meeting-class-card"><h2>LIVE MEETING · DEMO</h2><div className="class-meeting"><span className="class-date"><CalendarDays size={20} /></span><span><strong>{new Date(demoMeeting.scheduledAt).toLocaleString()}</strong><small>{demoMeeting.status} · sample only</small></span></div><p className="schema-demo-copy">No live meeting URL is connected.</p></article>
        <article className="class-announcement"><span><UsersRound size={26} /></span><div><strong>Sample classroom members</strong><p>{classroomMembers.length} demo members · not loaded from Supabase</p></div><button onClick={() => setActiveTab('Members')}>View members</button></article>
      </section>}
      {activeTab === 'Materials' && <section className="classroom-tab-content"><div className="classroom-section-heading"><div><h2>Course materials · demo</h2><p>Sample MATERIAL records. Files are not uploaded.</p></div><span>{classroomMaterials.length} samples</span></div><div className="material-list">{classroomMaterials.map(material => <article className="material-row" key={material.title}><span className={`material-icon tone-${material.tone}`}><FileText size={22} /></span><div><strong>{material.title}</strong><small>{material.type} · demo file</small></div><button disabled aria-label="Demo file unavailable"><Download size={18} /></button></article>)}</div></section>}
      {activeTab === 'Meetings' && <section className="classroom-tab-content"><div className="classroom-section-heading"><div><h2>Live meetings · demo</h2><p>Sample schedule; no meeting URL is available.</p></div><span>LIVE_MEETING</span></div><article className="meeting-row"><span className="class-date"><CalendarDays size={20} /></span><div><strong>{new Date(demoMeeting.scheduledAt).toLocaleString()}</strong><small>Status: {demoMeeting.status} · demo</small></div></article></section>}
      {activeTab === 'Members' && <section className="classroom-tab-content"><div className="classroom-section-heading"><div><h2>Class members · demo</h2><p>Sample CLASSROOM_MEMBER records.</p></div><span>{classroomMembers.length} samples</span></div><div className="member-grid">{classroomMembers.map(member => <article className="member-card" key={member.name}><span className={`classroom-person-avatar tone-${member.tone}`}>{member.initials}</span><span><strong>{member.name}</strong><small>{member.role.startsWith('Instructor') ? 'Instructor' : 'Learner'}</small></span></article>)}</div></section>}
    </main>
  )
}

export default ClassroomPage
