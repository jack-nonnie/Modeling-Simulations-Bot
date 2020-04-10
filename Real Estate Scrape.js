const fs = require('fs');
const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
puppeteer.use(pluginStealth());

(async() =>{
    const extractPostings = async (url) =>{
        const page = await browser.newPage();
        await page.goto(url,{waitUntil: 'networkidle0'});
        console.log(`scraping: ${url}`)

        //Scrape data we want
        const postingsOnPage = await page.evaluate(()=>
        Array.from(document.querySelectorAll('li article'))
        .map((post) => ({
            url: post.querySelector('a.details-titleLink').href,
            area: post.querySelector('li.details_info').innerText.trim(),
            title: post.querySelector('a.details-titleLink').innerText.trim(),
            price: post.querySelector('ul li.price-info span.price').innerText.trim(),
            image: post.querySelector('figure.photo img').src,
            type: post.querySelector('li.price-info span.secondary_text').innerText.trim(),
            details: post.querySelector('ul.details_info').innerText.trim().split(/\r\n|\r|\n/),
        }))
    );
    await page.close();

    //Should we end recursion?
    if(postingsOnPage.length < 1){ 
        //yes
        //so.. terminate script
        console.log(`terminate recursion on: ${url}`)
        return postingsOnPage
    }else{ 
        //no
        //so.. Fetch next page URL
        const nextPageNumber = parseInt(url.match(/page=(\d+)$/)[1],10) +1;
        const nextUrl = `https://streeteasy.com/for-rent/manhattan?page=${nextPageNumber}`
        return postingsOnPage.concat(await extractPostings(nextUrl))
    }
    };

    // const titles = await page.evaluate(
    //     () => Array.from(document
    //         .querySelectorAll('h3.details-title'))
    //         .map(loc => loc.innerText.trim())
    // );

    // const images = await page.evaluate(
    //     () => Array.from(document
    //         .querySelectorAll('figure.photo img'))
    //         .map((photo) => photo.src)
    // );

    const browser = await puppeteer.launch({headless:false});
    const firstUrl = 'https://streeteasy.com/for-rent/manhattan?page=480';
    const postings = await extractPostings(firstUrl)
    console.log(postings);
    const jsonContent = await JSON.stringify(postings);
    console.log(jsonContent);
    fs.writeFileSync('output.json',jsonContent, 'utf8', function(err){
        if(err){
            console.log('An error occured while writing JSON Object to file');
            return console.log(err);
        }
        console.log("JSON file has been saved");
    });
    await browser.close();

})();
//Array.from(document.querySelectorAll('li article img')).map((photo) => photo.src)
//Array.from(document.querySelectorAll('h3.details-title')).map((loc) => loc.innerText.trim())
//Array.from(document.querySelectorAll('figure.photo img')).map((photo) => photo.src)
