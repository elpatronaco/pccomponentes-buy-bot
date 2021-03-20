const scrape = require('scrape-it')

module.exports = async ({ link }) =>
  (
    await scrape(link, {
      price: {
        selector: '.container-price-total',
        convert: x =>
          Number(
            x
              .trim()
              .replace(/[^0-9,]/g, '')
              .replace(',', '.')
          )
      },
      stock: {
        selector: '.product-availability',
        convert: x => !x.trim().includes('Sin Stock')
      },
      image: {
        selector: '#_image2',
        attr: 'src'
      },
      name: {
        selector: '.product-first-part',
        convert: x => x.trim().replace(/(\r\n|\n|\r)/gm, "")
      }
    })
  ).data
