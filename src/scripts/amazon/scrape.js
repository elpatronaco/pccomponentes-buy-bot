const scrape = require('scrape-it')

module.exports = async ({ link }) =>
  (
    await scrape(link, {
      price: {
        selector: '#price_inside_buybox',
        convert: x => {
          console.log(x)
          return Number(x.replace(/[^0-9,]/g, '').replace(',', '.'))
        }
      },
      stock: {
        selector: '#availability',
        convert: x => x.includes('En stock')
      },
      image: {
        selector: '#landingImage',
        attr: 'src'
      },
      name: {
        selector: '#productTitle',
        convert: x => x.trim().replace(/(\r\n|\n|\r)/gm, '')
      }
    })
  ).data
