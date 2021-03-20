const scrape = require('scrape-it')
const data = require('../../data.json')

module.exports = async ({ link, maxPrice }) =>
  (
    await scrape(link, {
      price: {
        selector: '#precio-main',
        attr: 'data-price',
        convert: x => Number(x)
      },
      stock: {
        selector: '.buy-button',
        convert: x => x.includes('Comprar')
      },
      image: {
        selector: '.pc-com-zoom',
        attr: 'src'
      },
      name: {
        selector: '.articulo'
      }
    })
  ).data
