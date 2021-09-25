import scrapper from './scrapper.js'
import express from 'express'
import NodeCache from 'node-cache'
import stscr from './staticscrp.js'
const myCache = new NodeCache()
const app = express()
const port = process.env.PORT||3000
app.get('/',async(req,res)=>res.json(await scrapper.getHomePage()))

app.get('/search/:anime',async(req,res)=>res.json(await scrapper.getSearchResults(req.params['anime'])))

app.get('/:anime/:epno',
    async(req,res)=>res.json({"episodelink":await stscr.getanime_ep(req.params['anime'],req.params['epno'])}))
    
app.get('/:anime/:epno',
async(req,res)=>res.render("player.ejs",{"episodelink":await stscr.getanime_ep(req.params['anime'],req.params['epno'])}))
app.listen(port,()=>console.log(`listening on port ${port}`))