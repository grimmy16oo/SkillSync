export function getUserName(user) {
  return user?.user_metadata?.full_name?.trim()
    || user?.user_metadata?.name?.trim()
    || user?.email?.split('@')[0]
    || 'Student'
}

export function getUserInitials(userOrName) {
  const name = typeof userOrName === 'string' ? userOrName : getUserName(userOrName)
  return name.split(/[\s._-]+/).filter(Boolean).slice(0, 2).map(part => part[0].toUpperCase()).join('') || 'S'
}
