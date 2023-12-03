const {JSDOM} = require('jsdom')


async function crawlPage(currentURL) {
  console.log(`Actively crawling: ${currentURL}`)

  try{
    const resp = await fetch(currentURL)
    if (resp.status > 399) {
      console.log(`error in fetch with status code: ${resp.status} on page ${currentURL}`)
      return
    }

    const contentType = resp.headers.get("content-type")
    if (!contentType.includes("text/html")) {
      console.log(`not valid html response, contentType: ${contentType} on page ${currentURL}`)
      return
    }  
    console.log(await resp.text())
  } catch(err) {
    console.log(`error in fetch: ${err.message}, on page ${currentURL}`)
  }
  
}

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
  getURLsFromHTML, 
  crawlPage
}