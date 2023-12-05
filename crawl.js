const {JSDOM} = require('jsdom')
const axios = require('axios')


async function crawlOnePage(baseURL, url) {
  console.log(`Actively crawling: ${url}`)

  try{
    const resp = await fetch(url)
    if (resp.status > 399) {
      console.log(`error in fetch with status code: ${resp.status} on page ${currentURL}`)
      return
    }

    const contentType = resp.headers.get("content-type")
    if (!contentType.includes("text/html")) {
      console.log(`not valid html response, contentType: ${contentType} on page ${currentURL}`)
      return
    }  
    const htmlBody = await resp.text()
    nextURLs = getVidFromHTML(htmlBody, baseURL)
    return nextURLs
    
  } catch(err) {
    console.log(`error in fetch: ${err.message}, on page ${url}`)
  }
}


async function getStatsFromYoutubeVideo(arr) {
  console.log('traversing each youtube link')
  arr = arr.slice(0, 10)
  let compiledArr = []
  for (let url of arr){
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    const id = params.get('v');
    const apiKey = process.env.YT_API_KEY
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${id}&part=statistics&key=${apiKey}`
    const response = await axios.get(apiUrl);
    const data = response.data
    if (data.items && data.items.length > 0) {
      const stats = data.items[0].statistics
      compiledArr.push([url, stats])
    }
    
  }
  return compiledArr
  
}

async function crawlPage(baseURL, currentURL, pages) {
  

  const baseURLObj = new URL(baseURL)
  const currentURLObj = new URL(currentURL)
  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages
  }

  const normalizedCurrentURL = normalizeURL(currentURL)
  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL]++
    return pages
  }

  pages[normalizedCurrentURL] = 1

  console.log(`Actively crawling: ${currentURL}`)

  try{
    const resp = await fetch(currentURL)
    if (resp.status > 399) {
      console.log(`error in fetch with status code: ${resp.status} on page ${currentURL}`)
      return pages
    }

    const contentType = resp.headers.get("content-type")
    if (!contentType.includes("text/html")) {
      console.log(`not valid html response, contentType: ${contentType} on page ${currentURL}`)
      return pages
    }  
    const htmlBody = await resp.text()
    nextURLs = getURLsFromHTML(htmlBody, baseURL)

    for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages)
    }
  } catch(err) {
    console.log(`error in fetch: ${err.message}, on page ${currentURL}`)
  }
  return pages
}

function getVidFromHTML(htmlBody, baseURL) {
  const dom = new JSDOM(htmlBody)
  
  const scripts = dom.window.document.querySelectorAll('script')
  let arr = []
  for (let script of scripts) {
    const content = script.textContent;
    if (content.includes('commandMetadata')) {
      
      const data = content.split(`"url":"/watch?`)
      data.forEach(v=> {
        
        let regex = /v=([^"\\]*)/g
        let match = regex.exec(v)
        if (match !== null && !arr.includes(`https://youtube.com/watch?${match[0]}`)) {
          arr.push(`https://youtube.com/watch?${match[0]}`)
        }
      })
      
      break;
    }
  }
  return arr
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
  const hostPath= `${urlObj.hostname}${urlObj.pathname}${urlObj.search}`
  if (hostPath.length > 0 && hostPath.slice(-1) === '/'){
    return hostPath.slice(0, -1)
  }
  return hostPath
}

module.exports = {
  normalizeURL,
  getURLsFromHTML, 
  crawlPage,
  crawlOnePage,
  getStatsFromYoutubeVideo
}