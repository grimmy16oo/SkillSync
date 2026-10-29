import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import AppLayout from './layouts/AppLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import DiscoverPage from './pages/DiscoverPage.jsx'
import MyLearningPage from './pages/MyLearningPage.jsx'
import MyTeachingPage from './pages/MyTeachingPage.jsx'
import RequestsPage from './pages/RequestsPage.jsx'
import ClassroomPage from './pages/ClassroomPage.jsx'
import NotificationsPage from './pages/NotificationsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import { initialRequestBuckets, initialSentRequests, notificationSeed, teachingSeed } from './data/demoData.jsx'
import { readPageFromLocation, validPages } from './app/pageRoutes.js'
import { supabase } from './lib/supabase.js'
import { getUserName } from './app/userProfile.js'
import { addProfileSkill as insertProfileSkill, createCatalogSkill, loadSkillData, removeProfileSkill as deleteProfileSkill } from './lib/skillService.js'

function App() {
  const [authMode, setAuthMode] = useState(null)
  const [classroomTab, setClassroomTab] = useState('Overview')
  const [requestBuckets, setRequestBuckets] = useState(initialRequestBuckets)
  const [teachingCourses, setTeachingCourses] = useState(teachingSeed)
  const [sentCourseRequests, setSentCourseRequests] = useState(initialSentRequests)
  const [notifications, setNotifications] = useState(notificationSeed)
  const [notificationPreferences, setNotificationPreferences] = useState({ Requests: true, Meetings: true, Courses: false })
  const [page, setPageState] = useState(readPageFromLocation)
  const [user, setUser] = useState(null)
  const [sessionReady, setSessionReady] = useState(() => !supabase)
  const [skillData, setSkillData] = useState({ catalog: [], profileSkills: [], roles: [] })
  const [skillLoadError, setSkillLoadError] = useState('')
  const [startCoursePost, setStartCoursePost] = useState(false)

  useEffect(() => {
    if (!supabase) {
      return undefined
    }
    let alive = true
    supabase.auth.getSession().then(({ data, error }) => {
      if (!alive) return
      if (error) console.error('Unable to restore Supabase session:', error.message)
      setUser(data?.session?.user ?? null)
      setSessionReady(true)
    }).catch(error => {
      if (alive) {
        console.error('Unable to restore Supabase session:', error)
        setSessionReady(true)
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setSessionReady(true)
      if (event === 'SIGNED_OUT') {
        setSkillData({ catalog: [], profileSkills: [], roles: [] })
        setSkillLoadError('')
      }
    })
    return () => {
      alive = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!user?.id) return undefined
    let alive = true
    loadSkillData(user.id).then(data => {
      if (!alive) return
      setSkillData(data)
      setSkillLoadError('')
    }).catch(error => {
      if (alive) setSkillLoadError(error.message || 'Unable to load your skill profile.')
    })
    return () => { alive = false }
  }, [user?.id])

  const authenticate = async ({ mode, email, password, fullName, institution, roleChoice }) => {
    if (!supabase) throw new Error('Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env, then restart Vite.')
    const response = mode === 'signup'
      ? await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName, institution, role_choice: roleChoice } },
        })
      : await supabase.auth.signInWithPassword({ email, password })
    if (response.error) throw response.error
    if (mode === 'signup' && !response.data.session) {
      return { message: 'Check your email for a confirmation link to finish creating your account.' }
    }
    setAuthMode(null)
    setPage('discover')
    return null
  }

  const logout = async () => {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Unable to sign out:', error.message)
    setAuthMode(null)
    setPage('home')
  }

  const saveUserProfile = async profile => {
    if (!supabase || !user) throw new Error('You must be signed in to update your profile.')
    const { error: profileError } = await supabase.from('profiles').update({
      full_name: profile.name,
      institution: profile.university,
      bio: profile.bio,
    }).eq('user_id', user.id)
    if (profileError) throw profileError
    const { data, error } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        full_name: profile.name,
        institution: profile.university,
        university: profile.university,
        program: profile.program,
        bio: profile.bio,
      },
    })
    if (error) throw error
    setUser(data.user)
  }

  const changeProfileSkill = async (skillId, role, action) => {
    if (!user) throw new Error('Sign in to update your skills.')
    const skillType = role === 'instructor' ? 'offering' : 'learning'
    if (!skillData.roles.includes(role)) throw new Error(`Your account doesn't have the ${role} role.`)
    if (action === 'add') await insertProfileSkill(user.id, skillId, skillType)
    else await deleteProfileSkill(user.id, skillId, skillType)
    setSkillData(await loadSkillData(user.id))
  }

  const createProfileSkill = async skillName => {
    if (!user) throw new Error('Sign in to add a skill.')
    const skill = await createCatalogSkill(skillName)
    setSkillData(current => ({
      ...current,
      catalog: [...current.catalog.filter(item => item.skill_id !== skill.skill_id), skill]
        .sort((left, right) => left.skill_name.localeCompare(right.skill_name)),
    }))
    return skill
  }

  const addProfileRole = async role => {
    if (!user || !supabase) throw new Error('Sign in to update your roles.')
    if (!['learner', 'instructor'].includes(role)) throw new Error('Choose learner or instructor.')
    if (skillData.roles.includes(role)) return
    const { error } = await supabase.from('user_roles').insert({ user_id: user.id, role })
    if (error) throw error
    setSkillData(await loadSkillData(user.id))
  }

  const removeProfileRole = async role => {
    if (!user || !supabase) throw new Error('Sign in to update your roles.')
    if (!['learner', 'instructor'].includes(role)) throw new Error('Choose learner or instructor.')
    const { data, error } = await supabase.from('user_roles')
      .delete()
      .eq('user_id', user.id)
      .eq('role', role)
      .select('role')
      .maybeSingle()
    if (error?.code === '23503' && error.message.includes('posts_user_id_posting_role_fkey')) {
      throw new Error("You can't remove this role while you have existing posts using it.")
    }
    if (error) throw error
    if (!data) throw new Error('No role was removed. Rerun the updated role SQL migration in Supabase, then try again.')
    setSkillData(current => ({ ...current, roles: current.roles.filter(item => item !== role) }))
  }

  const setPage = destination => {
    const nextPage = validPages.includes(destination) ? destination : 'home'
    setPageState(nextPage)
    const nextUrl = nextPage === 'home' ? `${window.location.pathname}${window.location.search}` : `#${nextPage}`
    if (window.location.hash !== (nextPage === 'home' ? '' : `#${nextPage}`)) window.history.pushState({ page: nextPage }, '', nextUrl)
  }

  const updateRequest = (request, accepted) => {
    setRequestBuckets(current => ({
      received: current.received.filter(item => item.id !== request.id),
      accepted: accepted ? [request, ...current.accepted] : current.accepted,
      declined: accepted ? current.declined : [request, ...current.declined],
    }))
    setTeachingCourses(current => current.map(course => course.title !== request.course ? course : {
      ...course,
      pending: Math.max(0, course.pending - 1),
      learners: course.learners + (accepted ? 1 : 0),
      requests: course.requests.filter(item => item.id !== request.id),
    }))
    setNotifications(current => current.map(item => item.requestId === request.id ? { ...item, unread: false } : item))
  }

  const acceptNotifiedRequest = requestId => {
    const request = requestBuckets.received.find(item => item.id === requestId)
    if (request) updateRequest(request, true)
  }

  const sendCourseRequest = course => {
    if (sentCourseRequests.some(request => request.title === course.title)) return
    setSentCourseRequests(current => [{ title: course.title, teacher: course.teacher, meta: 'sent just now', status: 'Pending', tone: course.tone, icon: course.icon }, ...current])
    setNotifications(current => [{ id: Date.now(), group: 'Today', type: 'Requests', icon: CheckCircle2, message: <>Your request for <strong>{course.title}</strong> was sent.</>, time: 'Just now', unread: true, tone: 'mint' }, ...current])
  }

  useEffect(() => {
    const handleHistoryNavigation = () => setPageState(readPageFromLocation())
    window.addEventListener('popstate', handleHistoryNavigation)
    return () => window.removeEventListener('popstate', handleHistoryNavigation)
  }, [])
  useEffect(() => { window.scrollTo(0, 0) }, [page, authMode])

  if (authMode) return <AuthPage mode={authMode} onModeChange={setAuthMode} onBack={() => setAuthMode(null)} onAuthenticate={authenticate} />
  if (page === 'home') return <HomePage onAuth={setAuthMode} onExplore={() => setPage('discover')} onOffer={() => setPage('teaching')} onClassroom={() => { setClassroomTab('Meetings'); setPage('classroom') }} />

  const pageContent = page === 'discover'
    ? <DiscoverPage user={user} sessionReady={sessionReady} startCoursePost={startCoursePost} onComposerOpened={() => setStartCoursePost(false)} onLogin={() => setAuthMode('login')} onSignup={() => setAuthMode('signup')} userName={getUserName(user)} skillCatalog={skillData.catalog} profileSkills={skillData.profileSkills} skillRoles={skillData.roles} skillLoadError={skillLoadError} onCreateSkill={createProfileSkill} onAddSkill={(skillId, role) => changeProfileSkill(skillId, role, 'add')} onProfile={() => setPage('profile')} onBack={() => setPage('home')} onOffer={() => setPage('teaching')} onLearning={() => setPage('learning')} onTeaching={() => setPage('teaching')} onRequests={() => setPage('requests')} onRequest={sendCourseRequest} requestedCourseTitles={sentCourseRequests.map(request => request.title)} />
    : page === 'learning'
      ? <MyLearningPage userName={getUserName(user)} onProfile={() => setPage('profile')} onBack={() => setPage('home')} onDiscover={() => setPage('discover')} onOffer={() => setPage('teaching')} onTeaching={() => setPage('teaching')} onRequests={() => setPage('requests')} onClassroom={() => setPage('classroom')} />
      : page === 'teaching'
        ? <MyTeachingPage userName={getUserName(user)} onProfile={() => setPage('profile')} onCreateCoursePost={() => { setStartCoursePost(true); setPage('discover') }} onBack={() => setPage('home')} onDiscover={() => setPage('discover')} onLearning={() => setPage('learning')} onOffer={() => setPage('teaching')} onRequests={() => setPage('requests')} onUpdateRequest={updateRequest} courses={teachingCourses} setCourses={setTeachingCourses} />
        : page === 'requests'
          ? <RequestsPage userName={getUserName(user)} onHome={() => setPage('home')} onDiscover={() => setPage('discover')} onLearning={() => setPage('learning')} onTeaching={() => setPage('teaching')} onNotifications={() => setPage('notifications')} onProfile={() => setPage('profile')} onOffer={() => setPage('teaching')} sentRequests={sentCourseRequests} requestBuckets={requestBuckets} onUpdateRequest={updateRequest} />
          : page === 'classroom'
            ? <ClassroomPage onBack={() => setPage('learning')} initialTab={classroomTab} />
            : page === 'notifications'
              ? <NotificationsPage onBack={() => setPage('requests')} onAcceptRequest={acceptNotifiedRequest} notifications={notifications} setNotifications={setNotifications} preferences={notificationPreferences} setPreferences={setNotificationPreferences} />
              : page === 'profile'
                ? <ProfilePage user={user} skillCatalog={skillData.catalog} profileSkills={skillData.profileSkills} skillRoles={skillData.roles} skillLoadError={skillLoadError} onChangeSkill={changeProfileSkill} onCreateSkill={createProfileSkill} onAddRole={addProfileRole} onRemoveRole={removeProfileRole} onSaveProfile={saveUserProfile} onBack={() => setPage('home')} onOffer={() => setPage('teaching')} />
                : <SettingsPage preferences={notificationPreferences} setPreferences={setNotificationPreferences} />

  return <AppLayout page={page} user={user} onLogout={logout} onNavigate={destination => { if (destination === 'classroom') setClassroomTab('Overview'); setPage(destination) }}>{pageContent}</AppLayout>
}

export default App
