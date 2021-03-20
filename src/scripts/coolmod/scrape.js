const scrape = require('scrape-it')

module.exports = async ({ link }) =>
  (
    await scrape(link, {
      price: {
        selector: 'span[class="text-price-total"]',
        how: x => Number(x.textContent.trim())
      },
      stock: {
        selector: '.button-buy'
      },
      image: {
        selector: 'div.container-main-image a img',
        attr: 'src'
      },
      name: {
        selector: '.product-first-part',
        convert: x => x.textContent.trim()
      }
    })
  ).data
