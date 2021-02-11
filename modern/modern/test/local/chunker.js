var Test = Test || {};

/* eslint indent: [{ "outerIIFEBody": 0 }] */
(function() {
'use strict';

// "isIOS" is correct
if (Test.browser.isIOS || Test.browser.isAndroid) {
    Test.chunks = [
        // This one is incredibly slow and GC heavy
        ['specs/panel/Resizable.js']
    ];
}
else {
    Test.chunks = null;
}

// TODO This function is duplicated in Classic toolkit. Refactor and combine.
Test.chunker = function(array, chunkNo, numChunks) {
    var chunks = Test.chunks,
        urls = array.slice(),
        result = [],
        chunk, found, url, size, i, len, j, jlen, k, klen;

    if (!chunks) {
        return false;
    }

    // If we're passed a chunk number that we have a definition for, it's easy
    if (chunks[chunkNo]) {
        chunks = chunks[chunkNo];

        URLS:
        for (i = 0, len = urls.length; i < len; i++) {
            url = urls[i];

            CHUNK:
            for (j = 0, jlen = chunks.length; j < jlen; j++) {
                if (url.indexOf(chunks[j]) !== -1) {
                    result.push(url);

                    if (result.length === chunks.length) {
                        break URLS;
                    }

                    break CHUNK;
                }
            }
        }

        // ¯\_(ツ)_/¯
        if (!result || !result.length) {
            return false;
        }

        return result;
    }

    // If that's the rest, we need to remove URLs mentioned in special chunks first
    for (i = 0, len = urls.length; i < len; i++) {
        url = urls[i];
        found = false;

        CHUNK:
        for (j = 0, jlen = chunks.length; j < jlen; j++) {
            chunk = chunks[j];

            for (k = 0, klen = chunk.length; k < klen; k++) {
                if (url.indexOf(chunk[k]) !== -1) {
                    found = true;
                    break CHUNK;
                }
            }
        }

        if (!found) {
            result.push(url);
        }
    }

    urls = result;
    result = [];

    // Then fall back to the default splitting algorithm
    size = Math.ceil(urls.length / numChunks);

    while (urls.length) {
        result.push(urls.splice(0, size));
    }

    chunk = result[chunkNo];

    return chunk && chunk.length ? chunk : false;
};

})();
