import { useState } from 'react'
import { BellRing, Check, Inbox, Plus, UserRound, X } from 'lucide-react'
import { getUserInitials } from '../app/userProfile.js'
import { initialRequestBuckets, initialSentRequests } from '../data/demoData.jsx'

function RequestsPage({ onHome, onDiscover, onLearning, onTeaching, onProfile, onOffer, userName }) {
  const [activeTab, setActiveTab] = useState('Received')
  const [showRequestNotice, setShowRequestNotice] = useState(initialRequestBuckets.received.length > 0)
  const [rejectedRequestNotice, setRejectedRequestNotice] = useState(null)
  const [selectedRequestIds, setSelectedRequestIds] = useState([])
  const [profilePreview, setProfilePreview] = useState(null)
  const [requestBuckets, setRequestBuckets] = useState(() => Object.fromEntries(
    Object.entries(initialRequestBuckets).map(([status, requests]) => [status, [...requests]]),
  ))
  const requests = requestBuckets[activeTab.toLowerCase()]

  const updateRequestStatus = (request, status) => {
    if (status === 'declined') {
      setRejectedRequestNotice(request)
      setShowRequestNotice(true)
    }
    setRequestBuckets(current => ({
      ...current,
      received: current.received.filter(item => item.id !== request.id),
      [status]: [{ ...request, status }, ...current[status]],
    }))
    setSelectedRequestIds(current => current.filter(id => id !== request.id))
  }

  const updateSelectedRequests = status => {
    requests.filter(request => selectedRequestIds.includes(request.id)).forEach(request => updateRequestStatus(request, status))
  }
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
        {showRequestNotice && activeTab === 'Received' && <aside className="request-arrival-toast" role="status"><span className="request-toast-icon"><BellRing size={19} /></span><div><strong>{rejectedRequestNotice ? 'Rejection notice sent' : 'Requests waiting for you'}</strong><p>{rejectedRequestNotice ? `${rejectedRequestNotice.name} will see that the ${rejectedRequestNotice.course} request was declined.` : `You have ${requestBuckets.received.length} incoming ${requestBuckets.received.length === 1 ? 'request' : 'requests'} to review.`}</p></div><button type="button" aria-label="Dismiss notification" onClick={() => setShowRequestNotice(false)}><X size={17} /></button></aside>}
        <header className="requests-heading"><h1 id="requests-title">Requests</h1></header>
        <div className="request-columns">
          <section className="received-column">
            <div className="request-list-heading"><div className="request-tabs" role="tablist" aria-label="Request status">{['Received', 'Accepted', 'Declined'].map(tab => <button key={tab} role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? 'active' : ''} onClick={() => { setActiveTab(tab); setSelectedRequestIds([]) }}>{tab}</button>)}</div></div>
            {activeTab === 'Received' && requests.length > 0 && <div className="request-bulk-toolbar"><label><input type="checkbox" checked={requests.length > 0 && selectedRequestIds.length === requests.length} onChange={event => setSelectedRequestIds(event.target.checked ? requests.map(request => request.id) : [])} /> Select all</label><span>{selectedRequestIds.length} selected</span><button type="button" disabled={!selectedRequestIds.length} className="accept-action" onClick={() => updateSelectedRequests('accepted')}><Check size={15} /> Accept selected</button><button type="button" disabled={!selectedRequestIds.length} className="decline-action" onClick={() => updateSelectedRequests('declined')}><X size={15} /> Reject selected</button></div>}
            <div className="received-list">{requests.map(request => <article className={`received-request tone-${request.tone}`} key={request.id}>{activeTab === 'Received' && <input className="request-select-checkbox" type="checkbox" aria-label={`Select request from ${request.name}`} checked={selectedRequestIds.includes(request.id)} onChange={event => setSelectedRequestIds(current => event.target.checked ? [...current, request.id] : current.filter(id => id !== request.id))} />}<span className="received-avatar">{request.initials}</span><div className="received-copy"><div className="received-person"><button type="button" className="request-profile-link" onClick={() => setProfilePreview(request)}>{request.name}</button><span>Course: {request.course}</span></div><small>{request.meta}</small>{request.message && <p>{request.message}</p>}</div>{activeTab === 'Received' ? <div className="request-actions"><button type="button" className="accept-action" onClick={() => updateRequestStatus(request, 'accepted')}><Check size={16} /> Accept</button><button type="button" className="decline-action" onClick={() => updateRequestStatus(request, 'declined')}><X size={16} /> Reject</button></div> : <span className={`request-status-pill ${activeTab === 'Accepted' ? 'accepted' : 'declined'}`}>{activeTab}</span>}</article>)}{!requests.length && <div className="empty-requests"><Inbox size={25} /><h2>No {activeTab.toLowerCase()} requests</h2></div>}</div>
          </section>
          <aside className="sent-column"><h2>Sent by you</h2><div className="sent-list">{initialSentRequests.filter(request => request.status !== 'Course full').map(request => { const Icon = request.icon; return <article className={`sent-request tone-${request.tone}`} key={request.title}><span className="sent-icon"><Icon size={21} /></span><span className="sent-copy"><strong>{request.title}</strong><small>{request.teacher} · {request.meta}</small></span><b className="sent-status">{request.status}</b></article> })}</div></aside>
        </div>
      </section>
      {profilePreview && <div className="posts-modal-backdrop" onClick={() => setProfilePreview(null)}><section className="posts-modal author-profile-preview" role="dialog" aria-modal="true" aria-labelledby="request-profile-title" onClick={event => event.stopPropagation()}><button className="posts-modal-close" onClick={() => setProfilePreview(null)} aria-label="Close"><X size={19} /></button><span className="author-preview-avatar"><UserRound size={30} /></span><p>LEARNER PROFILE</p><h2 id="request-profile-title">{profilePreview.name}</h2><div className="author-preview-tags"><span>{profilePreview.course}</span><span>Requests</span></div><p>{profilePreview.meta}</p></section></div>}
    </main>
  )
}

export default RequestsPage
