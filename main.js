const {crawlPage, crawlOnePage, getStatsFromYoutubeVideo} = require('./crawl.js')
const {printReport, sortvids} = require('./report.js')
require('dotenv').config()

async function main() {
  if (process.argv.length < 3) {
    console.log('no website provided')
    process.exit(1)
  }  
  if (process.argv.length > 3) {
    console.log('too many command lines args')
    process.exit(1)
  }  

  const baseURL = process.argv[2]

  console.log(`Starting crawl of ${baseURL}`)
  const pages = await crawlPage(baseURL, baseURL, {})
  printReport(pages)
}

async function youtubeRetrieval() {
  if (process.argv.length < 3) {
    console.log('no website provided')
    process.exit(1)
  }  
  if (process.argv.length > 3) {
    console.log('too many command lines args')
    process.exit(1)
  }  

  const baseURL = process.argv[2]

  console.log(`Starting crawl of ${baseURL}`)
  const pages = await crawlOnePage(baseURL, baseURL, {})
  const statsArr = await getStatsFromYoutubeVideo(pages)
  const sortedArr = sortvids(statsArr)
  
  console.log(sortedArr)
}

// main()
youtubeRetrieval()