const axios = require('axios')
const cheerio = require('cheerio')
const _ = require('lodash')
const url = require('url')

//Define target url
const TARGET_URL = ""


/**
 * Fetch page with axios and return a promise
 *
 * @param {string} url - The url to fetch
 * @return promise
 *
 */
const fetchPage = (url) => {
    return axios.get(url)
}


/**
 * Returns true if href starts with http or https
 *
 * @param {string} href - The href to check
 * @return boolean
 *
 */
const isAbsolutePath = (href) => {
    return (_.startsWith(href, "http://") || _.startsWith(href, "https://"))
}


/**
 * Extract links from html
 *
 * @param {string} html - html
 * @return promise
 *
 */
const extractLinks = (html) => {

    return new Promise((resolve, reject) => {
        let $ = cheerio.load(html)
        let hrefs = $('a')
        let links = [];

        $(hrefs).each((i, link) => {
            let href = $(link).attr('href')
            if (checkValidLink(href)) links.push(href)
        })

        //return only unique links
        links = _.uniq(links)

        resolve(links)

    })

}


/**
 * Checks if the href is valid
 *
 * @param {string} href - The href to check
 * @return boolean
 *
 */
const checkValidLink = (href) => {
    return (
        href != undefined &&
        href != '/' &&
        href != '#' &&
        !_.startsWith(href, '#') &&
        !href.includes('javascript:;')
    )
}

/**
 * Process links to be absolute
 *
 * @param {string} href - The href to check
 * @return boolean
 *
 */
const processLinks = (links) => {

    return new Promise((resolve, reject) => {
        let linksProcessed = []
        links.map((link) => {
            if (isAbsolutePath(link) == true) linksProcessed.push(link)
            else {
                let fullPath = new URL(link, targetUrl)
                linksProcessed.push(fullPath.href)
            }
        })

        resolve(linksProcessed)
    })
}


/**
 * Checks the availability
 *
 * @param {array} urls - The urls to check
 * @return boolean
 *
 */
const checkUrlAvailability = (urls) => {
    urls.map((url) => {
        axios
            .get(url)
            .then((res) => console.log(url + ' -> ' + res.status))
            .catch((e) => {
                if (e.response) {
                    console.log(url + ' -> ' + e.response.status)
                }

            })
    })
}


fetchPage(targetUrl)
    .then((res) => {
        console.log(res.config.url)
        console.log(res.status)
        return extractLinks(res.data)
    })
    .then((hrefs) => {
        return processLinks(hrefs)
    })
    .then((processedLinks) => {
        checkUrlAvailability(processedLinks)
        //console.log(processedLinks)
    })
    .catch((e) => console.log(e))