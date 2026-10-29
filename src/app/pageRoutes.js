export const validPages = ['home', 'discover', 'learning', 'teaching', 'requests', 'classroom', 'notifications', 'profile', 'settings']
export const readPageFromLocation = () => {
  const requestedPage = window.location.hash.slice(1)
  if (requestedPage === 'posts') return 'discover'
  return validPages.includes(requestedPage) ? requestedPage : 'home'
}
