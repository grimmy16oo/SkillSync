import { useState } from 'react'
import { CalendarDays, Download, FileText, Star, UsersRound } from 'lucide-react'
import { classroomMaterials, classroomMembers } from '../data/demoData.jsx'

const tabs = ['Overview', 'Materials', 'Meetings', 'Members', 'Feedback']
const demoMeeting = { scheduledAt: '2026-11-03T11:00:00', status: 'Scheduled' }

function ClassroomPage({ onBack }) {
  const [activeTab, setActiveTab] = useState('Overview')
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [reviews, setReviews] = useState([])
  const [message, setMessage] = useState('')
  const [reviewTarget, setReviewTarget] = useState('classroom')
  const [meetingUrl, setMeetingUrl] = useState('')
  const [meetingMessage, setMeetingMessage] = useState('')
  const [postedMaterials, setPostedMaterials] = useState([])

  const submitFeedback = event => {
    event.preventDefault()
    if (!rating) {
      setMessage('Choose a star rating before submitting.')
      return
    }
    if (!feedback.trim()) {
      setMessage('Add a little feedback about your experience.')
      return
    }
    setReviews(current => [{ rating, feedback: feedback.trim(), target: reviewTarget, date: new Date().toLocaleDateString() }, ...current])
    setRating(0)
    setFeedback('')
    setMessage('Thanks for sharing your feedback!')
  }

  const classroomReviews = reviews.filter(review => review.target === 'classroom')
  const averageRating = classroomReviews.length
    ? (classroomReviews.reduce((total, review) => total + review.rating, 0) / classroomReviews.length).toFixed(1)
    : '—'

  const postMaterial = event => {
    const file = event.target.files?.[0]
    if (!file) return
    setPostedMaterials(current => [{ title: file.name, type: file.type || 'File', size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`, tone: 'lavender' }, ...current])
    event.target.value = ''
  }

  const saveMeetingLink = event => {
    event.preventDefault()
    try {
      const parsed = new URL(meetingUrl)
      if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error('Enter a valid web link.')
      setMeetingUrl(parsed.toString())
      setMeetingMessage('Meeting link saved for this session.')
    } catch {
      setMeetingMessage('Enter a valid meeting URL starting with https://')
    }
  }

  return (
    <main className="classroom-page schema-classroom-page">
      <div className="classroom-breadcrumb"><button onClick={onBack}>My Learning</button><span>›</span><strong>Python Fundamentals</strong></div>
      <header className="classroom-heading"><div><h1>Python Fundamentals</h1></div></header>
      <nav className="classroom-tabs" role="tablist" aria-label="Course sections">{tabs.map(tab => <button key={tab} role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}</button>)}</nav>
      {activeTab === 'Overview' && <section className="classroom-grid schema-classroom-grid">
        <article className="classroom-card about-card"><h2>COURSE OVERVIEW</h2><p>Course materials, live sessions, members, and feedback for Python Fundamentals.</p><div className="classroom-tags"><span>Course: Python Fundamentals</span><span>Rating: {averageRating} · {reviews.length} reviews</span></div><h3 className="recent-materials-title">RECENT MATERIALS</h3><div className="recent-materials">{classroomMaterials.slice(0, 2).map(material => <article key={material.title}><span className={`material-icon tone-${material.tone}`}><FileText size={21} /></span><span><strong>{material.title}</strong><small>{material.type}</small></span></article>)}</div></article>
        <article className="classroom-card meeting-class-card"><h2>LIVE MEETING</h2><div className="class-meeting"><span className="class-date"><CalendarDays size={20} /></span><span><strong>{new Date(demoMeeting.scheduledAt).toLocaleString()}</strong><small>{demoMeeting.status}</small></span></div><form className="classroom-meeting-form" onSubmit={saveMeetingLink}><label htmlFor="classroom-meeting-url">Meeting link</label><div><input id="classroom-meeting-url" type="url" value={meetingUrl} onChange={event => setMeetingUrl(event.target.value)} placeholder="https://meet.google.com/..." /><button type="submit">Save link</button></div></form>{meetingMessage && <p className="classroom-inline-message" role="status">{meetingMessage}</p>}{meetingUrl && <a className="classroom-join-link" href={meetingUrl} target="_blank" rel="noreferrer">Join live meeting</a>}<div className="classroom-instructor-preview"><span className="classroom-person-avatar tone-mint">NR</span><span><strong>Nabil Rahman</strong><small>Course instructor</small></span><button type="button" onClick={() => { setReviewTarget('instructor'); setActiveTab('Feedback') }}>Rate instructor</button></div></article>
        <article className="class-announcement"><span><UsersRound size={26} /></span><div><strong>Course members</strong><p>{classroomMembers.length} members</p></div><button onClick={() => setActiveTab('Members')}>View members</button></article>
      </section>}
      {activeTab === 'Materials' && <section className="classroom-tab-content"><div className="classroom-section-heading"><div><h2>Course materials</h2><p>Choose a file to add it to this session’s material list.</p></div><label className="classroom-upload-button">＋ Post material<input type="file" onChange={postMaterial} /></label></div><div className="material-list">{[...postedMaterials, ...classroomMaterials].map((material, index) => <article className="material-row" key={`${material.title}-${index}`}><span className={`material-icon tone-${material.tone}`}><FileText size={22} /></span><div><strong>{material.title}</strong><small>{material.type} · {material.size || ''}</small></div>{index >= postedMaterials.length && <button disabled aria-label="File unavailable"><Download size={18} /></button>}</article>)}</div></section>}
      {activeTab === 'Meetings' && <section className="classroom-tab-content"><div className="classroom-section-heading"><div><h2>Live meetings</h2><p>Add a meeting URL for this course.</p></div></div><article className="meeting-row"><span className="class-date"><CalendarDays size={20} /></span><div><strong>{new Date(demoMeeting.scheduledAt).toLocaleString()}</strong><small>Status: {demoMeeting.status}</small></div></article><form className="classroom-meeting-form" onSubmit={saveMeetingLink}><label htmlFor="classroom-meeting-url-tab">Meeting link</label><div><input id="classroom-meeting-url-tab" type="url" value={meetingUrl} onChange={event => setMeetingUrl(event.target.value)} placeholder="https://meet.google.com/..." /><button type="submit">Save link</button></div></form>{meetingMessage && <p className="classroom-inline-message" role="status">{meetingMessage}</p>}{meetingUrl && <a className="classroom-join-link" href={meetingUrl} target="_blank" rel="noreferrer">Join live meeting</a>}</section>}
      {activeTab === 'Members' && <section className="classroom-tab-content"><div className="classroom-section-heading"><div><h2>Course members</h2><p>Instructor and learners</p></div><span>{classroomMembers.length} members</span></div><div className="member-grid">{classroomMembers.map(member => <article className="member-card" key={member.name}><span className={`classroom-person-avatar tone-${member.tone}`}>{member.initials}</span><span><strong>{member.name}</strong><small>{member.role.startsWith('Instructor') ? 'Instructor' : 'Learner'}</small></span></article>)}</div></section>}
      {activeTab === 'Feedback' && <section className="classroom-tab-content classroom-feedback">
        <div className="classroom-section-heading"><div><h2>Rate the {reviewTarget}</h2><p>Share what’s working well and what could be better.</p></div><span>{reviewTarget === 'classroom' ? averageRating : '—'} ★ · {reviews.filter(review => review.target === reviewTarget).length} {reviews.filter(review => review.target === reviewTarget).length === 1 ? 'review' : 'reviews'}</span></div>
        <form className="classroom-feedback-form" onSubmit={submitFeedback}>
          <div className="classroom-rate-target"><label><input type="radio" name="review-target" value="classroom" checked={reviewTarget === 'classroom'} onChange={() => setReviewTarget('classroom')} /> Classroom</label><label><input type="radio" name="review-target" value="instructor" checked={reviewTarget === 'instructor'} onChange={() => setReviewTarget('instructor')} /> Instructor</label></div>
          <fieldset className="classroom-rating-field"><legend>Your rating</legend><div className="classroom-star-picker" onMouseLeave={() => setHoveredRating(0)}>{[1, 2, 3, 4, 5].map(value => <button key={value} type="button" className={(hoveredRating || rating) >= value ? 'selected' : ''} aria-label={`${value} ${value === 1 ? 'star' : 'stars'}`} aria-pressed={rating === value} onMouseEnter={() => setHoveredRating(value)} onFocus={() => setHoveredRating(value)} onBlur={() => setHoveredRating(0)} onClick={() => setRating(value)}><Star size={30} fill="currentColor" /></button>)}</div></fieldset>
          <label className="classroom-feedback-label" htmlFor="classroom-feedback-text">Your feedback<textarea id="classroom-feedback-text" value={feedback} onChange={event => setFeedback(event.target.value)} maxLength={500} placeholder="What did you enjoy? What would improve your learning experience?" rows={5} /></label>
          <div className="classroom-feedback-submit"><span>{feedback.length}/500</span><button type="submit">Submit feedback</button></div>
          {message && <p className="classroom-feedback-message" role="status">{message}</p>}
        </form>
        {reviews.filter(review => review.target === reviewTarget).length > 0 && <div className="classroom-reviews"><h3>{reviewTarget === 'instructor' ? 'Instructor feedback' : 'Classroom feedback'}</h3>{reviews.filter(review => review.target === reviewTarget).map((review, index) => <article className="classroom-review" key={`${review.date}-${index}`}><div className="classroom-review-top"><span className="classroom-review-stars" aria-label={`${review.rating} out of 5 stars`}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span><time>{review.date}</time></div><p>{review.feedback}</p></article>)}</div>}
      </section>}
    </main>
  )
}

export default ClassroomPage
