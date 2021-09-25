import fetch from "node-fetch"
import cheerio from 'cheerio'
import puppeteer from 'puppeteer'
// export let getanime_ep = async()

export let getanimeep = async(anime,epno)=>{
    let res = await fetch(`https://streamani.net/videos/${anime}-episode-${epno}`)
    let $ = cheerio.load(await res.text())
    let ifr = $('iframe').attr().src;
    return await getvidlink(ifr)
}


export let getvidlink= async(ifrlink)=>{
    try{  
        const browser =await puppeteer.launch({headless: true});
        const ifpage = await browser.newPage()
        await ifpage.goto("https:"+ifrlink)
        await ifpage.waitForTimeout(500)
        ifpage.click('video')
        await ifpage.waitForTimeout(500)
        await ifpage.bringToFront()
        ifpage.click('video')
        await ifpage.waitForTimeout(100)
        return await ifpage.$eval('video',(vid)=>{
            return vid.src
        })
        .then((res)=>{
            browser.close()
            return res
        })
}
catch(e){
    console.error(e)
}
}


export let getSearchResults = async(anime)=>{
    const res = await fetch(`https://gogoanime.pe//search.html?keyword=${anime}`)
    const $ = cheerio.load(await res.text())
    let lis = $('.items').html()
    let results = cheerio.load(lis)
    let cimgs=[],names = [],latesteps = []
        results('.name').each(function(i, elm) {
    
            names.push(results(this).text())
        });
    
        results('.released').each(function(i, elm) {
            
            latesteps.push(results(this).text().trim())
        });
    
        results('img').each(function(i, elm) {
    
            cimgs.push(results(this).attr().src)
        });
        let rawsearchres = {cimgs,names,latesteps}
        return jsonconverter(rawsearchres)
}


export let getHomePage = async(pagenumber)=>{
        const res = await fetch(`https://gogoanime.pe/?page=${pagenumber}`)
        const $ = cheerio.load(await res.text())
        // console.log($.html());
        let lis = $('.items').html()
        let results = cheerio.load(lis)
        let cimgs=[],names = [],latesteps = []
        let fjson = []
            results('.name').each(function(i, elm) {
        
                names.push(results(this).text())
            });
        
            results('.episode').each(function(i, elm) {
                
                latesteps.push(results(this).text().trim())
            });
        
            results('img').each(function(i, elm) {
        
                cimgs.push(results(this).attr().src)
            });
            let rawsearchres = {cimgs,names,latesteps}
            return jsonconverter(rawsearchres)
}
let jsonconverter=(rawsearchres)=>{
    let fjson = []
    for(let i=0 ;i<rawsearchres.cimgs.length;i++){
        let tob = {
            "anime":rawsearchres.names[i],
            "cover":rawsearchres.cimgs[i],
            "latestep":rawsearchres.latesteps[i]
        }
            fjson.push(tob)
    }
    return fjson
}

let getanimeinfopage = async(anime)=>{
    const res = await fetch(`https://gogoanime.pe/category/${anime}`)
    let $ = cheerio.load(await res.text())
    let ul = $('.active').text().split("-")      
    let lastep = ul[ul.length -1]
    // let aniinfo = {}
    // let ps = $('.anime_info_body_bg').html()
    // console.log(ps);
    return lastep
}
getanimeinfopage("jujutsu-kaisen-tv")
export default {getHomePage,getSearchResults,getanimeep,getvidlink,getanimeinfopage}