import fetch from "node-fetch";
import puppeteer from 'puppeteer';
import fs from 'fs';

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function imageUrlToBuffer(url: string) : Promise<Buffer> {
    const fimg = await fetch(url);
    return Buffer.from(await fimg.arrayBuffer())
}


async function urlUrlToBuffer(url: string, dimension: { width: number, height:number}, wait: number = 3000) : Promise<Buffer> {

    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    page.setViewport({ width: dimension.width, height: dimension.height, deviceScaleFactor: 2})

    await page.goto(url, { waitUntil: ["load","networkidle0"]  });

    if (wait > 0) await sleep(wait);

    await page.evaluate(() => {
        function canvasToImage(element: HTMLCanvasElement) {
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

    const image = await page.screenshot({type: 'png'});

    await browser.close();

    return image as Buffer;
}

async function save(path: string, buffer:Buffer) {
    await fs.writeFileSync(path, buffer);
}


export { imageUrlToBuffer, urlUrlToBuffer, sleep, save }