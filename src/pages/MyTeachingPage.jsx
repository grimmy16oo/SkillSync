import { useEffect, useState } from 'react'
import { GraduationCap, Layers3, Plus } from 'lucide-react'
import { getUserInitials } from '../app/userProfile.js'
import { supabase } from '../lib/supabase.js'
import { teachingSeed } from '../data/demoData.jsx'

function MyTeachingPage({ onBack, onDiscover, onLearning, onOffer, onRequests, userName, onProfile, onCreatePost, user }) {
  const [posts, setPosts] = useState([])
  const [loadedUserId, setLoadedUserId] = useState(null)
  const [error, setError] = useState('')
  const loading = Boolean(user) && loadedUserId !== user.id

  useEffect(() => {
    if (!user || !supabase) return undefined
    let active = true
    supabase.from('posts').select('*').eq('user_id', user.id).eq('posting_role', 'instructor')
      .order('created_at', { ascending: false })
      .then(({ data, error: queryError }) => {
        if (!active) return
        if (queryError) setError(`Your instructor posts could not be loaded: ${queryError.message}`)
        else { setError(''); setPosts(data || []) }
        setLoadedUserId(user.id)
      })
    return () => { active = false }
  }, [user])

  return (
    <main className="teaching-page">
      <header className="discover-top">
        <nav className="discover-nav" aria-label="Main navigation">
          <button onClick={onDiscover}>Discover</button><button onClick={onLearning}>My Learning</button>
          <a className="current" href="#teaching-title" aria-current="page">My Teaching</a><button onClick={onRequests}>Requests</button>
        </nav>
        <div className="discover-nav-actions"><button className="offer-top" onClick={onOffer}><Plus size={17} /> Offer a Skill</button><button className="nav-avatar" aria-label={`Open ${userName}'s profile`} onClick={onProfile}>{getUserInitials(userName)}</button></div>
      </header>
      <div className="teaching-content">
        <div className="teaching-heading"><div><p>INSTRUCTOR SPACE</p><h1 id="teaching-title">My Teaching</h1></div><button onClick={onCreatePost}><Plus size={21} /> Offer a Skill</button></div>
        <section className="teaching-stats schema-teaching-note"><article><span>YOUR POSTS</span><strong>{posts.length}</strong><small>Instructor posts saved in your account</small></article></section>
        <h2 className="your-courses-title">Course offerings</h2>
        <section className="teaching-course-grid demo-teaching-grid">{teachingSeed.map(course => <article className={`teaching-course tone-${course.tone}`} key={course.title}><div className="teaching-course-heading"><span className="teaching-course-icon"><GraduationCap size={24} /></span><div><h3>{course.title}</h3><p>{course.category}</p></div></div></article>)}</section>
        <h2 className="your-courses-title">Your instructor posts</h2>
        {loading ? <p className="schema-state">Loading your posts…</p>
          : error ? <p className="schema-state schema-state-error" role="alert">{error}</p>
            : !user ? <section className="schema-state"><GraduationCap size={25} /><h2>Sign in to see your posts</h2><p>Instructor posts are associated with your signed-in account.</p></section>
              : posts.length === 0 ? <section className="schema-state"><GraduationCap size={25} /><h2>No skill offers yet</h2><p>Your skill offers will appear here.</p><button onClick={onCreatePost}><Plus size={16} /> Offer a Skill</button></section>
                : <section className="schema-post-grid">{posts.map(post => <article className="schema-post-card" key={post.post_id}><header><span className={`post-status status-${post.status}`}>{post.status}</span><time>{post.created_at ? new Date(post.created_at).toLocaleString() : ''}</time></header><p>{post.description}</p></article>)}</section>}
      </div>
    </main>
  )
}

export default MyTeachingPage
