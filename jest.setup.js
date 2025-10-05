import 'abort-controller/polyfill';

import nodeFetch from 'node-fetch';

global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

global.fetch = nodeFetch;
global.Request = nodeFetch.Request;
global.Response = nodeFetch.Response;
global.Headers = nodeFetch.Headers;

global.TransformStream = class TransformStream {
    constructor() { }
    start() { }
    transform() { }
    flush() { }
    cancel() { }
};

global.BroadcastChannel = class BroadcastChannel {
    constructor() { }
    postMessage() { }
    close() { }
};