import fetch from 'node-fetch'
import cheerio from 'cheerio'

let getanime_ep = async(anime,ep)=>{
    let res= await fetch(`https://gogoanime.pe/${anime.replace(" ","-")}-episode-${ep}`)
    let $ = cheerio.load(await res.text())
    let d = cheerio.load($('.dowloads').html())
    let newp = d('a').attr().href
    return getvidlink(newp)
}
let getvidlink = async(link)=>{
   let res = await fetch(link)
   let $ = cheerio.load(await res.text())
   let vid = cheerio.load($('.dowload').html())
    return vid('a').attr().href
 }
export default {getanime_ep}