const scrape = require('scrape-it')

module.exports = async ({ link }) =>
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
        selector: '.articulo',
        convert: x => x.trim().replace(/(\r\n|\n|\r)/gm, '')
      }
    })
  ).data
