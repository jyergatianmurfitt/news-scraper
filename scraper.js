const fs = require('fs');
const { launch } = require('puppeteer');

const newsPages = ['https://www.reuters.com/world/middle-east/', 'https://www.zawya.com/en/mena'];

// news title, news source, link to article

const result = (async () => {
  const results = newsPages.reduce(async (acc, newsPage) => {
    const browser = await launch();
    const page = await browser.newPage();
    await page.goto(newsPage);
    
    const articleLinks = await page.$$eval('a:not(nav, .nav, #nav, header, .header, #header, footer, .footer, #footer)', links =>
      links.map(link => link.outerHTML)
    );

    console.log(articleLinks);
  
    await browser.close();
  }, {})

  console.log(results)
  return results;
  })();

  // fs.writeFile('output/headlines.csv', result, function(result) {})