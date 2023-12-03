const {JSDOM} = require('jsdom')

function getURLsFromHTML(htmlBody, baseURL) {
  const dom = new JSDOM(htmlBody)
  const linkElements = dom.window.document.querySelectorAll('a')
  const urls = [...linkElements].map(v=>{
    if (v.href.slice(0, 1) === '/') {
      try {
        const urlObj = new URL(`${baseURL}${v.href}`)
        return urlObj.href
      } catch (err) {
        console.log(`error with relative url: ${err.message}`)
      }      
    } else {
      try {
        const urlObj = new URL(v.href)
        return urlObj.href
      } catch (err) {
        console.log(`error with absolute url: ${err.message}`)
      }  
    }
    })
  return urls
}

function normalizeURL(urlString) {
  const urlObj = new URL(urlString)
  const hostPath= `${urlObj.hostname}${urlObj.pathname}`
  if (hostPath.length > 0 && hostPath.slice(-1) === '/'){
    return hostPath.slice(0, -1)
  }
  return hostPath
}

module.exports = {
  normalizeURL,
  getURLsFromHTML
}