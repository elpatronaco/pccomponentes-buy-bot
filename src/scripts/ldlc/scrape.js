const scrape = require('scrape-it')
const data = require('../../data.json')

// Number(x.replace("€", ".")

module.exports = async ({ link, maxPrice }) =>
  (
    await scrape(link, {
      price: {
        selector: '#product-page-price',
        attr: "data-price"
      },
      stock: {
        selector: '.modal-stock-web',
        convert: x => x.includes('En stock')
      },
      image: {
        selector: '#ctl00_cphMainContent_ImgProduct',
        attr: 'src'
      },
      name: {
        selector: '.title-1',
        convert: x => x.trim(),
      }
    })
  ).data
