const scrape = require('scrape-it')

module.exports = async ({ link }) =>
  (
    await scrape(link, {
      price: {
        selector: "span[itemprop='price']",
        attr: 'content',
        convert: x => Number(x)
      },
      stock: {
        selector: '#product-availability',
        convert: x => !x.trim().includes('Fuera de stock')
      },
      image: {
        selector: '.js-thumb',
        attr: 'src'
      },
      name: {
        selector: 'h1.product-detail-name',
        convert: x => x.trim().replace(/(\r\n|\n|\r)/gm, '')
      }
    })
  ).data
