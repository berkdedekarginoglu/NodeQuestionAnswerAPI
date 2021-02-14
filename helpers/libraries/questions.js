const slugify = require('slugify')

const slugy = async (title) => {

    return await slugify(title, {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: /[*+~.()'"!:@]/g, // remove characters that match regex, defaults to `undefined`
        lower: true      // convert to lower case, defaults to `false`
    })

}

module.exports = {
    slugy
}