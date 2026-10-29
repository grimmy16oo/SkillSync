import { Plus } from 'lucide-react'
import { getUserInitials } from '../app/userProfile.js'
import DiscoverPosts from '../components/DiscoverPosts.jsx'
import { courses } from '../data/demoData.jsx'

function DiscoverPage({
  user, sessionReady, startPost, startPostRole, onComposerOpened, onLogin, onSignup,
  onBack, onOffer, onLearning, onTeaching, onRequests, userName, onProfile,
}) {

  return (
    <main className="discover-page">
      <header className="discover-top">
        <nav className="discover-nav" aria-label="Main navigation">
          <a className="current" href="#discover-title" aria-current="page">Discover</a>
          <button onClick={onLearning}>My Learning</button>
          <button onClick={onTeaching}>My Teaching</button>
          <button onClick={onRequests}>Requests</button>
        </nav>
        <div className="discover-nav-actions">
          <button className="offer-top" onClick={onOffer}><Plus size={17} /> Offer a Skill</button>
          <button className="nav-avatar" aria-label={`Open ${userName}'s profile`} onClick={onProfile}>{getUserInitials(userName)}</button>
        </div>
      </header>

      <section className="discover-content" aria-labelledby="discover-title">
        <div className="discover-heading">
          <div><p className="course-count">SAMPLE COURSE CARDS · DEMO CONTENT</p><h1 id="discover-title">Discover Skills</h1></div>
        </div>
        <div className="discover-grid demo-course-grid" aria-label="Demo course previews">
          {courses.slice(0, 3).map(course => {
            const Icon = course.icon
            return <article className={`course-card tone-${course.tone}`} key={course.title}>
              <div className="course-topline"><span className="course-icon"><Icon size={19} /></span><span className="course-category">DEMO · {course.category}</span></div>
              <h2>{course.title}</h2><p className="course-description">{course.description}</p>
              <div className="course-teacher"><span className="teacher-avatar">{course.initials}</span><span>{course.teacher}</span></div>
            </article>
          })}
        </div>
      </section>
      <DiscoverPosts user={user} sessionReady={sessionReady} startPost={startPost} startPostRole={startPostRole} onComposerOpened={onComposerOpened} onLogin={onLogin} onSignup={onSignup} />
    </main>
  )
}

export default DiscoverPage
