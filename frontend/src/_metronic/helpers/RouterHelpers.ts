export function getCurrentUrl(pathname: string) {
  return pathname.split(/[?#]/)[0]
}

export function checkIsActive(pathname: string, url: string) {
  const current = getCurrentUrl(pathname)
  if (!current || !url) {
    return false
  }

  // 完全匹配
  if (current === url) {
    return true
  }

  // 精確匹配：當前路徑以菜單 URL 開頭，且下一個字符是 '/' 或路徑結束
  // 這樣可以避免 /tom/order 匹配到 /tom/order/overview 的情況
  // 但允許 /tom/order/overview 匹配到 /tom/order/overview
  if (current.startsWith(url)) {
    const nextChar = current[url.length]
    // 如果下一個字符是 '/' 或不存在（路徑結束），則匹配
    if (nextChar === '/' || nextChar === undefined) {
      return true
    }
  }

  return false
}
