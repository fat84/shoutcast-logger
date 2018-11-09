const request = require('request');
// helpers

module.exports = function (url) {
    return new Promise((resolve, reject) => {
        request({
            url: `${url}/7.html`,
            headers: { 'User-Agent': 'Mozilla/5.0' }
            }, 
            (err, resp, body) => {
                if(err) reject(err)
    
                const regex = /<body>(.*?)<\/body>/i;
                const match = regex.exec(body);
                let data = match[1].split(',');

                resolve(parseInt(data[0], 10))
            })
    })
    
}
