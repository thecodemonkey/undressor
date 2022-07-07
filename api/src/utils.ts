import fetch from "node-fetch";


async function urlToBuffer(url: string) : Promise<Buffer> {
    const fimg = await fetch(url);
    return Buffer.from(await fimg.arrayBuffer())
}



export { urlToBuffer }