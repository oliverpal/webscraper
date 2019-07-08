const axios = require('axios')

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


module.exports = {
    fetchPage
}