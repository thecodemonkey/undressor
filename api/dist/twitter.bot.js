"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { initROClient, initStream } from './twitter.config'
const cron_1 = require("cron");
function process() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('hello...');
    });
}
const job = new cron_1.CronJob('0/5 * * * * *', () => __awaiter(void 0, void 0, void 0, function* () { yield process(); }), null, true);
// async function start() {
//     const twitter = initROClient();
//     const user = await twitter.v2.userByUsername('undressor');
//     const mentions = await twitter.v2.userMentionTimeline(user.data.id, {
//         since_id: '1491163106944622594'
//     });
//     console.log('timeline', JSON.stringify(mentions, null, 4));
//     // const stream = await initStream();
//     // stream.on(ETwitterStreamEvent.Data, console.log);
//     // stream.on(ETwitterStreamEvent.Connected, () => console.log('Stream is started.'));
//     // // Start stream!
//     // await stream.connect({ autoReconnect: true, autoReconnectRetries: Infinity });
// }
// (async () => {
//     start();
// })();
//# sourceMappingURL=twitter.bot.js.map