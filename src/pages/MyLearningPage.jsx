import { ArrowRight, Compass, Plus } from 'lucide-react'
import { getUserInitials } from '../app/userProfile.js'
import { learningCourses } from '../data/demoData.jsx'

function MyLearningPage({ onDiscover, onOffer, onTeaching, onRequests, onClassroom, userName, onProfile }) {
  const visibleCourses = learningCourses.filter(course => course.status !== 'Saved')
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
          <div className="learning-title-row"><h1 id="learning-title">My Learning</h1><button className="find-course-button" onClick={onDiscover}><Compass size={19} fill="currentColor" /> Discover posts</button></div>
          <section className="learning-course-grid">
            {visibleCourses.map(course => { const Icon = course.icon; return <article className={`learning-course tone-${course.tone}`} key={course.title}>
              <div className="learning-course-top"><span className="learning-icon"><Icon size={22} /></span></div>
              <h2>{course.title}</h2><p>{course.instructor}</p>
              {course.status === 'In progress' && <button className="open-classroom" onClick={onClassroom}>Open classroom<ArrowRight size={15} /></button>}
            </article> })}
          </section>
        </section>
      </div>
    </main>
  )
}

export default MyLearningPage
