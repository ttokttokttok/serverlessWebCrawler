function printReport(pages) {
  console.log('===========')
  console.log('REPORT')
  console.log('===========')
  const sortedPages = sortPages(pages)
  for (const sortedPage of sortedPages) {
    const url = sortedPage[0]
    const hits = sortedPage[1]
    console.log(`Found ${hits} link to page: ${url}`)
  }
  console.log('===========')
  console.log('REPORT')
  console.log('===========')
}



function sortPages(pages){
  pagesArr = Object.entries(pages)
  pagesArr.sort((a,b) => {
    aHits = a[1]
    bHits = b[1]
    return b[1] - a[1]
  })
  return pagesArr
}

function sortvids(arr) {
  arr.sort((a, b) => {
    let viewCountA = parseInt(a[1].viewCount);
    let viewCountB = parseInt(b[1].viewCount);
  
    let likeCountA = parseInt(a[1].likeCount);
    let likeCountB = parseInt(b[1].likeCount);
  
    if (viewCountA < viewCountB) {
      return 1;
    } else if (viewCountA > viewCountB) {
      return -1;
    } else {
      if (likeCountA < likeCountB) {
        return 1;
      } else if (likeCountA > likeCountB) {
        return -1;
      } else {
        return 0;
      }
    }
  });
  return arr
}

module.exports = {
  sortPages, printReport, sortvids
}