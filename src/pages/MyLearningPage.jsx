import { useState } from 'react'
import { ArrowRight, BookOpen, Compass, Layers3, Plus } from 'lucide-react'
import { getUserInitials } from '../app/userProfile.js'
import { learningCourses } from '../data/demoData.jsx'

function MyLearningPage({ onDiscover, onBack, onOffer, onTeaching, onRequests, onClassroom, userName, onProfile }) {
  const [activeTab, setActiveTab] = useState('In progress')
  const activeCourse = learningCourses.find(course => course.status === 'In progress')
  const visibleCourses = learningCourses.filter(course => course.status === activeTab)
  return (
    <main className="learning-page">
      <header className="discover-top">
        <nav className="discover-nav" aria-label="Main navigation">
          <button onClick={onDiscover}>Discover</button>
          <a className="current" href="#learning-title" aria-current="page">My Learning</a>
          <button onClick={onTeaching}>My Teaching</button><button onClick={onRequests}>Requests</button>
        </nav>
        <div className="discover-nav-actions"><button className="offer-top" onClick={onOffer}><Plus size={17} /> Offer a Skill</button><button className="nav-avatar" aria-label={`Open ${userName}'s profile`} onClick={onProfile}>{getUserInitials(userName)}</button></div>
      </header>
      <div className="learning-layout schema-empty-layout">
        <section className="learning-main">
          <div className="learning-title-row"><div><p className="learner-eyebrow">LEARNER SPACE · DEMO DATA</p><h1 id="learning-title">My Learning</h1></div><button className="find-course-button" onClick={onDiscover}><Compass size={19} fill="currentColor" /> Discover posts</button></div>
          {activeCourse && <section className="continue-card"><div className="continue-icon"><BookOpen size={35} /></div><div className="continue-copy"><p>DEMO COURSE PREVIEW</p><h2>{activeCourse.title}</h2><span>{activeCourse.instructor} · {activeCourse.lessons}</span></div><button className="resume-button" onClick={onDiscover}><Compass size={17} /> Discover</button></section>}
          <div className="learning-tabs" role="tablist" aria-label="Demo learning courses">
            {['In progress', 'Completed', 'Saved'].map(tab => <button key={tab} role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}</button>)}
          </div>
          <section className="learning-course-grid">
            {visibleCourses.map(course => { const Icon = course.icon; return <article className={`learning-course tone-${course.tone}`} key={course.title}>
              <div className="learning-course-top"><span className="learning-icon"><Icon size={22} /></span><span className="course-week">DEMO</span></div>
              <h2>{course.title}</h2><p>{course.instructor}</p><div className="lesson-progress"><span>{course.lessons}</span>{course.percent > 0 && <strong>{course.percent}%</strong>}</div>
              {course.percent > 0 && <div className="progress-track"><span style={{ width: `${course.percent}%` }} /></div>}
              {course.status === 'In progress' && <button className="open-classroom" onClick={onClassroom}>Open classroom<ArrowRight size={15} /></button>}
            </article> })}
            {!visibleCourses.length && <article className="learning-course"><div className="learning-course-top"><span className="learning-icon"><Layers3 size={22} /></span><span className="course-week">DEMO</span></div><h2>No {activeTab.toLowerCase()} demo courses</h2><p>This view contains sample content only. Real enrollments need backend support.</p></article>}
          </section>
        </section>
      </div>
    </main>
  )
}

export default MyLearningPage
