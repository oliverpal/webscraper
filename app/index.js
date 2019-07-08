const _ = require('lodash')
const url = require('url')
require('dotenv').config({ path: './.env' })


const  { extractLinks, checkUrlAvailability } = require('./extractor')
const { fetchPage } = require('./fetcher')
const { processLinks } = require('./processor')

//Define target url
const TARGET_URL = "https://www.afd.de"


fetchPage(TARGET_URL)
    .then((res) => {
        console.log(res.config.url)
        console.log(res.status)
        return extractLinks(res.data)
    })
    .then((hrefs) => {
        return processLinks(hrefs, TARGET_URL)
    })
    .then((processedLinks) => {
        checkUrlAvailability(processedLinks)
        //console.log(processedLinks)
    })
    .catch((e) => console.log(e))
    