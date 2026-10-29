import { useEffect, useState } from 'react'
import AppLayout from './layouts/AppLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import DiscoverPage from './pages/DiscoverPage.jsx'
import MyLearningPage from './pages/MyLearningPage.jsx'
import MyTeachingPage from './pages/MyTeachingPage.jsx'
import RequestsPage from './pages/RequestsPage.jsx'
import ClassroomPage from './pages/ClassroomPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import { readPageFromLocation, validPages } from './app/pageRoutes.js'
import { supabase } from './lib/supabase.js'
import { getUserName } from './app/userProfile.js'
import { addProfileSkill as insertProfileSkill, createCatalogSkill, loadSkillData, removeProfileSkill as deleteProfileSkill } from './lib/skillService.js'

function App() {
  const [authMode, setAuthMode] = useState(null)
  const [page, setPageState] = useState(readPageFromLocation)
  const [user, setUser] = useState(null)
  const [sessionReady, setSessionReady] = useState(() => !supabase)
  const [skillData, setSkillData] = useState({ catalog: [], profileSkills: [], roles: [] })
  const [skillLoadError, setSkillLoadError] = useState('')
  const [profileData, setProfileData] = useState(null)
  const [profileLoadError, setProfileLoadError] = useState('')
  const [startPost, setStartPost] = useState(false)
  const [startPostRole, setStartPostRole] = useState('')

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
      setProfileData(null)
      setProfileLoadError('')
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

  useEffect(() => {
    if (!user?.id || !supabase) return undefined
    let alive = true
    supabase.from('profiles').select('user_id,full_name,institution,bio').eq('user_id', user.id).maybeSingle()
      .then(({ data, error }) => {
        if (!alive) return
        if (error) setProfileLoadError(error.message)
        else { setProfileData(data); setProfileLoadError('') }
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
      institution: profile.institution,
      bio: profile.bio,
    }).eq('user_id', user.id)
    if (profileError) throw profileError
    setProfileData({ user_id: user.id, full_name: profile.name, institution: profile.institution, bio: profile.bio })
    const { data, error } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        full_name: profile.name,
        institution: profile.institution,
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

  useEffect(() => {
    const handleHistoryNavigation = () => setPageState(readPageFromLocation())
    window.addEventListener('popstate', handleHistoryNavigation)
    return () => window.removeEventListener('popstate', handleHistoryNavigation)
  }, [])
  useEffect(() => { window.scrollTo(0, 0) }, [page, authMode])

  if (authMode) return <AuthPage mode={authMode} onModeChange={setAuthMode} onBack={() => setAuthMode(null)} onAuthenticate={authenticate} />
  if (page === 'home') return <HomePage onAuth={setAuthMode} onExplore={() => setPage('discover')} onOffer={() => setPage('teaching')} onClassroom={() => setPage('classroom')} />

  const pageContent = page === 'discover'
    ? <DiscoverPage user={user} sessionReady={sessionReady} startPost={startPost} startPostRole={startPostRole} onComposerOpened={() => { setStartPost(false); setStartPostRole('') }} onLogin={() => setAuthMode('login')} onSignup={() => setAuthMode('signup')} userName={getUserName(user)} skillCatalog={skillData.catalog} profileSkills={skillData.profileSkills} skillRoles={skillData.roles} skillLoadError={skillLoadError} onCreateSkill={createProfileSkill} onAddSkill={(skillId, role) => changeProfileSkill(skillId, role, 'add')} onProfile={() => setPage('profile')} onBack={() => setPage('home')} onOffer={() => setPage('teaching')} onLearning={() => setPage('learning')} onTeaching={() => setPage('teaching')} onRequests={() => setPage('requests')} />
    : page === 'learning'
      ? <MyLearningPage userName={getUserName(user)} onProfile={() => setPage('profile')} onBack={() => setPage('home')} onDiscover={() => setPage('discover')} onOffer={() => setPage('teaching')} onTeaching={() => setPage('teaching')} onRequests={() => setPage('requests')} onClassroom={() => setPage('classroom')} />
      : page === 'teaching'
        ? <MyTeachingPage user={user} userName={getUserName(user)} onProfile={() => setPage('profile')} onCreatePost={() => { setStartPost(true); setStartPostRole('instructor'); setPage('discover') }} onBack={() => setPage('home')} onDiscover={() => setPage('discover')} onLearning={() => setPage('learning')} onOffer={() => setPage('teaching')} onRequests={() => setPage('requests')} />
        : page === 'requests'
          ? <RequestsPage userName={getUserName(user)} onHome={() => setPage('home')} onDiscover={() => setPage('discover')} onLearning={() => setPage('learning')} onTeaching={() => setPage('teaching')} onProfile={() => setPage('profile')} onOffer={() => setPage('teaching')} />
          : page === 'classroom'
            ? <ClassroomPage onBack={() => setPage('learning')} />
            : <ProfilePage user={user} profileData={profileData} profileLoadError={profileLoadError} skillCatalog={skillData.catalog} profileSkills={skillData.profileSkills} skillRoles={skillData.roles} skillLoadError={skillLoadError} onChangeSkill={changeProfileSkill} onCreateSkill={createProfileSkill} onAddRole={addProfileRole} onRemoveRole={removeProfileRole} onSaveProfile={saveUserProfile} onBack={() => setPage('home')} onOffer={() => setPage('teaching')} />

  return <AppLayout page={page} user={user} onLogout={logout} onNavigate={setPage}>{pageContent}</AppLayout>
}

export default App
