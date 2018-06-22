export function RedirectNavbar(username, path, history) {
  history.push(`/user/${username}/${path}`)
}