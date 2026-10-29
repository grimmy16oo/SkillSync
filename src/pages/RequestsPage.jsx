import { useState } from 'react'
import { Compass, Inbox, Plus } from 'lucide-react'
import { getUserInitials } from '../app/userProfile.js'
import { initialRequestBuckets, initialSentRequests } from '../data/demoData.jsx'

function RequestsPage({ onHome, onDiscover, onLearning, onTeaching, onProfile, onOffer, userName }) {
  const [activeTab, setActiveTab] = useState('Received')
  const requests = initialRequestBuckets[activeTab.toLowerCase()]
  return (
    <main className="requests-page">
      <header className="discover-top request-topnav">
        <nav className="discover-nav" aria-label="Main navigation">
          <button onClick={onDiscover}>Discover</button><button onClick={onLearning}>My Learning</button><button onClick={onTeaching}>My Teaching</button>
          <a className="current" href="#requests-title" aria-current="page">Requests</a>
        </nav>
        <div className="discover-nav-actions"><button className="offer-top" onClick={onOffer}><Plus size={17} /> Offer a Skill</button><button className="nav-avatar" aria-label="Open profile" onClick={onProfile}>{getUserInitials(userName)}</button></div>
      </header>
      <section className="requests-content">
        <header className="requests-heading"><p className="learner-eyebrow">DEMO REQUESTS · NOT SAVED</p><h1 id="requests-title">Requests</h1><p>Preview the request lists. Live request status needs the INTEREST_REQUEST backend table.</p></header>
        <div className="request-columns">
          <section className="received-column">
            <div className="request-list-heading"><div className="request-tabs" role="tablist" aria-label="Demo request status">{['Received', 'Accepted', 'Declined'].map(tab => <button key={tab} role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div></div>
            <div className="received-list">{requests.map(request => <article className={`received-request tone-${request.tone}`} key={request.id}><span className="received-avatar">{request.initials}</span><div className="received-copy"><div className="received-person"><strong>{request.name}</strong><span>Course: {request.course}</span></div><small>{request.meta}</small></div><span className="schema-demo-tag">DEMO</span></article>)}{!requests.length && <div className="empty-requests"><Inbox size={25} /><h2>No {activeTab.toLowerCase()} demo requests</h2></div>}</div>
          </section>
          <aside className="sent-column"><h2>Sent by you · demo</h2><div className="sent-list">{initialSentRequests.map(request => { const Icon = request.icon; return <article className={`sent-request tone-${request.tone}`} key={request.title}><span className="sent-icon"><Icon size={21} /></span><span className="sent-copy"><strong>{request.title}</strong><small>{request.teacher} · {request.meta}</small></span><b className="sent-status">{request.status}</b></article> })}</div><div className="request-discover-cta"><h3>Looking for something else?</h3><button onClick={onDiscover}><Compass size={16} fill="currentColor" /> Discover posts</button></div></aside>
        </div>
      </section>
    </main>
  )
}

export default RequestsPage
