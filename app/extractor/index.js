const axios = require('axios')
const cheerio = require('cheerio')
const _ = require('lodash')


/**
 * Checks if the href is valid
 *
 * @param {string} href - The href to check
 * @return boolean
 *
 */
const checkValidLink = (href) => (
    href != undefined &&
    href != '/' &&
    href != '#' &&
    !_.startsWith(href, '#') &&
    !href.includes('javascript:;')
)


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
        let links = []

        $(hrefs).each((i, link) => {
            let href = $(link).attr('href')
            if (checkValidLink(href)) links.push(href)
        })

        //return only unique links
        links = _.uniq(links)

        resolve(links)

    })

}


module.exports = {
    extractLinks,
    checkValidLink,
    checkUrlAvailability
}



