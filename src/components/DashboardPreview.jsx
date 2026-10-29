import { useEffect, useRef, useState } from 'react'
import { ArrowRight, BookOpen, CalendarDays, GraduationCap, Layers3, Sparkles } from 'lucide-react'
import StatCard from './StatCard.jsx'

function DashboardPreview({ onExplore, onOffer, onClassroom }) {
  const sectionRef = useRef(null)
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const node = sectionRef.current
    if (!node) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setRevealed(true); observer.disconnect() }
    }, { threshold: 0.16 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section className={`dashboard ${revealed ? 'is-revealed' : ''}`} id="dashboard" ref={sectionRef} aria-labelledby="dashboard-title">
      <div className="dashboard-intro">
        <h2 id="dashboard-title">Your SkillSync space<span>Learning and teaching, together.</span></h2>
        <p>Explore skill posts, manage your profile, and share what you know.</p>
        <div className="dashboard-actions">
          <button className="action action-gradient" onClick={onExplore}>Explore posts<ArrowRight size={17} /></button>
          <button className="action action-outline" onClick={onOffer}>Offer a Skill<ArrowRight size={17} /></button>
        </div>
      </div>
      <div className="card-grid">
        <StatCard className="learning-card" label="My Learning" icon={BookOpen}>
          <div className="main-stat"><strong>Courses</strong><span>Enrollment data requires the course and request tables.</span></div>
          <button type="button" onClick={onExplore} className="join-button">Browse posts<ArrowRight size={16} /></button>
        </StatCard>
        <StatCard className="skills-card" label="Skills" icon={Sparkles}>
          <div className="main-stat"><strong>Skills catalogue</strong><span>Skill names and categories are stored in SKILL.</span></div>
          <div className="skill-group"><span className="skill-caption">Choose learner or instructor skills from your profile.</span></div>
        </StatCard>
        <StatCard className="teaching-card" label="My Teaching" icon={GraduationCap}>
          <div className="main-stat"><strong>Instructor posts</strong><span>Posts are available in Discover.</span></div>
          <button type="button" onClick={onOffer} className="join-button">Create a post<ArrowRight size={16} /></button>
        </StatCard>
        <StatCard className="requests-card" label="Requests" icon={Layers3}>
          <div className="main-stat"><strong>Interest requests</strong><span>Request history needs INTEREST_REQUEST support.</span></div>
        </StatCard>
        <StatCard className="upcoming-card" label="Classrooms" icon={CalendarDays}>
          <div className="main-stat"><strong>Meetings and materials</strong><span>Classroom features need their backend tables.</span></div>
          <button type="button" onClick={onClassroom} className="join-button">Open classrooms<ArrowRight size={16} /></button>
        </StatCard>
        <StatCard className="achievements-card" label="Profile" icon={Sparkles}>
          <div className="main-stat"><strong>Member profile</strong><span>Name, email, institution, bio, roles, and selected skills.</span></div>
        </StatCard>
      </div>
    </section>
  )
}

export default DashboardPreview
