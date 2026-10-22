export const validPages = ['home', 'discover', 'learning', 'teaching', 'requests', 'classroom', 'notifications', 'profile', 'settings']
export const readPageFromLocation = () => {
  const requestedPage = window.location.hash.slice(1)
  return validPages.includes(requestedPage) ? requestedPage : 'home'
}
