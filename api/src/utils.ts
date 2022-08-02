import fetch from "node-fetch";
import puppeteer, { Browser } from 'puppeteer';
import fs from 'fs';
import crypto from 'crypto'


function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function imageUrlToBuffer(url: string) : Promise<Buffer> {
    const fimg = await fetch(url);
    return Buffer.from(await fimg.arrayBuffer())
}


async function urlUrlToBuffer(url: string, options: { width: number, height:number, convertCanvas2Image?:boolean, headless?:boolean}, wait: number = 3000) : Promise<Buffer> {
    let browser:Browser = null;

    try {
        browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none' ], headless: options.headless});

        const page = await browser.newPage();
        page.setViewport({ width: options.width, height: options.height, deviceScaleFactor: 2})
        await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36");

        console.log(`PUPPETEER: call url: ${url}`);
        await page.setDefaultNavigationTimeout(120000);
        await page.goto(url, { waitUntil: ["load","networkidle0"]  });

        if (wait > 0) await sleep(wait);

        console.log(`PUPPETEER: call url done.`);

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

        console.log(`PUPPETEER: take screenshot.`);
        const image = await page.screenshot({type: 'png'});

        console.log(`PUPPETEER: return buffer ${ image.length }.`);
        return image as Buffer;

    } catch(e) {
        console.log('PUPPETEER: error while navigate', e);
    }
    finally {
        if (browser && options.headless){
            console.log('PUPPETEER: close browser.');
            await browser.close();
        }
        else
        {
            console.log('PUPPETEER: DONT close browser!');
        }
    }
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

function getBytes(value: string) : Buffer {
    const bytes = [];
    for (let i = 0; i < value.length; i++) {
        bytes.push(value.charCodeAt(i));
    }

    return Buffer.from(bytes);
};


function encrypt(plainValue: string): string {
    const iv = getBytes(process.env.ENCRYPTION_IV)
    const cipher = crypto.createCipheriv('aes-256-ctr', process.env.ENCRYPTION_KEY, iv);

    const encrypted = Buffer.concat([cipher.update(plainValue), cipher.final()]);
    return `${encrypted.toString('hex')}`;
}

function decrypt(hexValue: string) {
    const iv = getBytes(process.env.ENCRYPTION_IV)
    const decipher = crypto.createDecipheriv('aes-256-ctr', process.env.ENCRYPTION_KEY, iv);

    const decrpyted = Buffer.concat(
        [decipher.update(Buffer.from(hexValue, 'hex')), decipher.final()]);

    return decrpyted.toString();
}


export { imageUrlToBuffer, urlUrlToBuffer, sleep, save, rnd, normalizeHashtags, printJSON, encrypt, decrypt }