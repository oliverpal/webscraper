const _ = require('lodash')

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
 * Process links to be absolute
 *
 * @param {string} href - The href to check
 * @return boolean
 *
 */
const processLinks = (links, targetUrl) => {

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


module.exports = {
    processLinks
}