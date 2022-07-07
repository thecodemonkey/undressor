import fetch from "node-fetch";
import puppeteer from 'puppeteer';

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function imageUrlToBuffer(url: string) : Promise<Buffer> {
    const fimg = await fetch(url);
    return Buffer.from(await fimg.arrayBuffer())
}



async function urlUrlToBuffer(url: string, dimension: { width: number, height:number}, wait: number = 3000) : Promise<Buffer> {

    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox'], defaultViewport: dimension});
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });


    if (wait > 0) await sleep(wait);

    const image = await page.screenshot({type: 'png'});

    await browser.close();

    return image as Buffer;
}



export { imageUrlToBuffer, urlUrlToBuffer, sleep }