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

function App() {
  const [authMode, setAuthMode] = useState(null)
  const [classroomTab, setClassroomTab] = useState('Overview')
  const [requestBuckets, setRequestBuckets] = useState(initialRequestBuckets)
  const [teachingCourses, setTeachingCourses] = useState(teachingSeed)
  const [sentCourseRequests, setSentCourseRequests] = useState(initialSentRequests)
  const [notifications, setNotifications] = useState(notificationSeed)
  const [notificationPreferences, setNotificationPreferences] = useState({ Requests: true, Meetings: true, Courses: false })
  const [page, setPageState] = useState(readPageFromLocation)

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

  if (authMode) return <AuthPage mode={authMode} onModeChange={setAuthMode} onBack={() => setAuthMode(null)} onLogin={() => { setAuthMode(null); setPage('discover') }} />
  if (page === 'home') return <HomePage onAuth={setAuthMode} onExplore={() => setPage('discover')} onOffer={() => setPage('teaching')} onClassroom={() => { setClassroomTab('Meetings'); setPage('classroom') }} />

  const pageContent = page === 'discover'
    ? <DiscoverPage onBack={() => setPage('home')} onOffer={() => setPage('teaching')} onLearning={() => setPage('learning')} onTeaching={() => setPage('teaching')} onRequests={() => setPage('requests')} onRequest={sendCourseRequest} requestedCourseTitles={sentCourseRequests.map(request => request.title)} />
    : page === 'learning'
      ? <MyLearningPage onBack={() => setPage('home')} onDiscover={() => setPage('discover')} onOffer={() => setPage('teaching')} onTeaching={() => setPage('teaching')} onRequests={() => setPage('requests')} onClassroom={() => setPage('classroom')} />
      : page === 'teaching'
        ? <MyTeachingPage onBack={() => setPage('home')} onDiscover={() => setPage('discover')} onLearning={() => setPage('learning')} onOffer={() => setPage('teaching')} onRequests={() => setPage('requests')} onUpdateRequest={updateRequest} courses={teachingCourses} setCourses={setTeachingCourses} />
        : page === 'requests'
          ? <RequestsPage onHome={() => setPage('home')} onDiscover={() => setPage('discover')} onLearning={() => setPage('learning')} onTeaching={() => setPage('teaching')} onNotifications={() => setPage('notifications')} onProfile={() => setPage('profile')} onOffer={() => setPage('teaching')} sentRequests={sentCourseRequests} requestBuckets={requestBuckets} onUpdateRequest={updateRequest} />
          : page === 'classroom'
            ? <ClassroomPage onBack={() => setPage('learning')} initialTab={classroomTab} />
            : page === 'notifications'
              ? <NotificationsPage onBack={() => setPage('requests')} onAcceptRequest={acceptNotifiedRequest} notifications={notifications} setNotifications={setNotifications} preferences={notificationPreferences} setPreferences={setNotificationPreferences} />
              : page === 'profile'
                ? <ProfilePage onBack={() => setPage('home')} onOffer={() => setPage('teaching')} />
                : <SettingsPage preferences={notificationPreferences} setPreferences={setNotificationPreferences} />

  return <AppLayout page={page} onNavigate={destination => { if (destination === 'classroom') setClassroomTab('Overview'); setPage(destination) }}>{pageContent}</AppLayout>
}

export default App
