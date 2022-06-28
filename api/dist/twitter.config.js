"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initStream = exports.initROClient = void 0;
require("dotenv/config");
const twitter_api_v2_1 = require("twitter-api-v2");
function initROClient() {
    const twitterClient = new twitter_api_v2_1.TwitterApi(process.env.BEARER_TOKEN);
    return twitterClient.readOnly;
}
exports.initROClient = initROClient;
function initStream() {
    const twitterClient = new twitter_api_v2_1.TwitterApi(process.env.BEARER_TOKEN);
    return twitterClient.v2.sampleStream();
}
exports.initStream = initStream;
//# sourceMappingURL=twitter.config.js.map