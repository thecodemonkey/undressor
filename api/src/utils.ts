import fetch from "node-fetch";
import puppeteer from 'puppeteer';
import fs from 'fs';
import { title } from "process";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function imageUrlToBuffer(url: string) : Promise<Buffer> {
    const fimg = await fetch(url);
    return Buffer.from(await fimg.arrayBuffer())
}


async function urlUrlToBuffer(url: string, options: { width: number, height:number, convertCanvas2Image?:boolean, headless?:boolean}, wait: number = 3000) : Promise<Buffer> {


    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none' ], headless: options.headless});
    const page = await browser.newPage();
    page.setViewport({ width: options.width, height: options.height, deviceScaleFactor: 2})
    await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36");

    await page.goto(url, { waitUntil: ["load","networkidle0"]  });


    if (wait > 0) await sleep(wait);

    if (options.convertCanvas2Image) {
        // const myFont = new FontFace('Jura', 'url(https://fonts.googleapis.com/css2?family=Jura:wght@300;400;600&display=swap)');
        // const font = await myFont.load();

        await page.evaluate(() => {
            function canvasToImage(element: HTMLCanvasElement) {
                // document.fonts.add(font);
                const dataUrl = element.toDataURL();
                const i = document.createElement('img');
                i.src = dataUrl;

                const properties = ['width', 'height', 'position', 'left', 'top'] as const;
                properties.forEach(key => i.style[key] = element.style[key])
                i.className = element.className;

                element.parentNode?.insertBefore(i, element);
                element.parentNode?.removeChild(element);
            }




            [].forEach.call(document.getElementsByTagName('canvas'), canvasToImage)
        })
    }

    const image = await page.screenshot({type: 'png'});

    if (options.headless)
        await browser.close();

    return image as Buffer;
}

async function save(path: string, buffer:Buffer) {
    await fs.writeFileSync(path, buffer);
}

function rnd(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function normalizeHashtags(tags:string[]){
    if (!tags || tags.length < 1) return [];

    const counts:any = {};
    tags.forEach( (x) => { counts[x] = ( counts[x] || 0) + 1; });
    return Object.keys(counts).map(k => ({ title: k, value: counts[k] }));
}

function printJSON(text:string, obj: any){
    console.log(`JSON VALUE of ${text}: \n\n ${JSON.stringify(obj, null, 4)} \n`);
}

export { imageUrlToBuffer, urlUrlToBuffer, sleep, save, rnd, normalizeHashtags, printJSON }