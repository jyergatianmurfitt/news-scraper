const fs = require('fs');
const { launch } = require('puppeteer');

const newsPages = {'Zawya': 'https://www.zawya.com/en/mena'}

 Promise.all(Object.entries(newsPages).map(async ([source, link]) => {
  const browser = await launch();
  const page = await browser.newPage();
  await page.goto(link);

  //adjust paths for additional sources
  const articleDetails = await page.$$eval('.english-mena-slot-top-stories-2 .teaser-title a[href]:not(nav, .nav, #nav, header, .header, #header, footer, .footer, #footer)', links =>
    links.map(link => ({ 'headline': link.innerText, 'articleLink': link.href}))
  );
  
  await browser.close();

  return articleDetails.map(article => ({...article, source}));

})).then(res => {

  const formattedResults = res.flat().map((article) => 
  `<tr>
      <td class="col-1" scope="row" style="font-weight: bold">${article.source}</td>
      <td class="col-2" style="text-align: left"><a href="${article.articleLink}" target="_blank" rel="noopener noreferrer">${article.headline}</a></td>
    </tr>`);

    const html  = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
        <title>News scraper</title>
      </head>
      <body>
        <section>
          <div class="container-fluid">
            <div class="row justify-content-center" style="margin: 1rem 0; vertical-align: middle;">
              <div class="col-md-6 text-center">
                <h2 class="heading-section" style="margin-bottom: 0;">News Scraper Results</h2>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="table-wrap">
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th class="col-1" scope="col">Source</th>
                        <th class="col-2" scope="col">Headline</th>
                      </tr>
                    </thead>
                    <tbody>
                    ${formattedResults.join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossorigin="anonymous"></script>
      </body>
    </html>
    `

    fs.writeFile('output/headlines.html', html, (err) => {
      if (err) {
      console.log('Error on: ' + value);
      throw err;
    }

    console.log('Success!')
  })}
)