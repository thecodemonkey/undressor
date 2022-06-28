"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const db = __importStar(require("./db"));
const twitter_config_1 = require("./twitter.config");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // console.log('call db...');
            const res = yield db.getLastMention();
            console.log('res', res);
            const lastmention = yield checkMentions(res.id);
            if (lastmention) {
                console.log('persist lastmention...', lastmention);
                yield db.updateLastMention(lastmention);
            }
        }
        catch (e) {
            console.error('error while processing', e);
        }
    });
}
function checkMentions(lastMentionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const twitter = (0, twitter_config_1.initROClient)();
        // console.log(`call users id of '${ process.env.TWITTER_NAME }' `);
        const user = yield twitter.v2.userByUsername(process.env.TWITTER_NAME);
        // console.log(`'${process.env.TWITTER_NAME}' id is: ${user.data.id} `);
        const mentions = yield twitter.v2.userMentionTimeline(user.data.id, {
            since_id: lastMentionId
        });
        const mentResult = mentions.data;
        if (mentResult.meta.result_count < 1) {
            console.log('NO RESULT!');
            return null;
        }
        else {
            console.log('\nmentions: ', JSON.stringify(mentResult.data, null, 4));
            return mentResult.data[0];
        }
    });
}
const job = new cron_1.CronJob('0/10 * * * * *', () => __awaiter(void 0, void 0, void 0, function* () { yield run(); }), null, true);
// async function start() {
//     // stream.on(ETwitterStreamEvent.Data, console.log);
//     // stream.on(ETwitterStreamEvent.Connected, () => console.log('Stream is started.'));
//     // // Start stream!
//     // await stream.connect({ autoReconnect: true, autoReconnectRetries: Infinity });
// }
// (async () => {
//     start();
// })();
//# sourceMappingURL=twitter.bot.js.map