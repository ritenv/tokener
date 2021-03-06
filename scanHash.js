var Scanner = function(content) {

}
Scanner.prototype = {
    raw: null,

    /**
     * Scan raw text for outermost curly braces and tag
     * @param  {String} raw Raw content format
     * @return {Array}      Array of content and tag
     */
    scanAttribs: function(raw) {
        var str = raw;
        var startIndex = -1;
        var currPos = 0;
        var curl = 0;
        var stillSearching = true;
        var ignoreUntil = false;
        var blocks = [];
        var lastNewLine = -1;
        var lastCurlEnd = -1;
        var firstSquare = -1;
        while (stillSearching && currPos <= str.length) {
            var currChar = str.charAt(currPos);
            // console.log("Looking at: " + currPos + currChar);
            if (!ignoreUntil) {
                switch (currChar) {
                    case '[':
                        if (startIndex === -1) {
                            startIndex = currPos;
                            if (firstSquare === -1) {
                                firstSquare = currPos;
                            }
                            continue;
                        } else
                            curl++;
                        break;
                    case ']':
                        curl--;
                        break;
                    case '"':
                    case '\'':
                        ignoreUntil = currChar;
                        break;
                    case '/':
                        var nextChar = str.charAt(currPos + 1);
                        if (nextChar === '/') {
                            ignoreUntil = '\n';
                        } else if (nextChar === '*') {
                            ignoreUntil = '*/';
                        }
                        break;
                    case '\n':
                        lastNewLine = currPos;
                        break;
                }
            } else {
                if (currChar === ignoreUntil) {
                    ignoreUntil = false;
                }
            }
            if (curl === 0 && startIndex > 0) {
                var block = str.substring(startIndex + 1, currPos);
                var tag = str.substring((lastCurlEnd === -1 ? 0 : lastCurlEnd + 1), startIndex).trim();

                if (block.trim()) {
                    blocks.push(block);
                    startIndex = -1;
                }
                lastCurlEnd = currPos;
            }
            currPos++;
        }
        if (curl > 0) {
            throw new Error("Did you miss a curly?");
        }
        return {
            blocks: blocks,
            meta: str.substring(0, firstSquare)
        }
    },

    /**
     * Setter function for the object
     * @param {String} key Name of property
     * @param {String} val Value of property
     */
    set: function(key, val) {
        var pInstance = this;
        if (typeof val === "undefined") {
            return;
        }
        if (typeof pInstance[key] != "undefined") {
            pInstance[key] = val;
        }
    },

    /**
     * Getter function for the object
     * @param  {String} key Name of property
     * @return {Any}     Value of property
     */
    get: function(key) {
        var pInstance = this;
        if (typeof pInstance[key] != "undefined") {
            return pInstance[key];
        } else {
            throw new Error('Property \'' + key +'\' does not exist');
        }
    }
}
exports = scanner = new Scanner();

var attribs = (scanner.scanAttribs('a#sample-button[href="#"][rel="lightbox"]'));
console.log(attribs.blocks);
console.log(attribs.blocks.join(" "));



