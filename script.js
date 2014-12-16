var tokener = function(str) {
  var startIndex = -1;
  var currPos = 0;
  var curl = 0;
  var stillSearching = true;
  var ignoreUntil = false;
  var blocks = [];
  var lastNewLine = -1;

  while (stillSearching && currPos <= str.length) {
    var currChar = str.charAt(currPos);
    // console.log("Looking at: " + currPos + currChar);
    if (!ignoreUntil) {
      switch(currChar) {
        case '{':
          if (startIndex === -1) {
            startIndex = currPos;
            continue;
          } else
            curl++;
          break;
        case '}':
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
      var block = str.substring(startIndex+1, currPos-1);
      var tag = str.substring(0, startIndex).trim();

      if (block.trim()) {
        blocks.push({
          tag: tag,
          block: block
        });
        startIndex = currPos;
      }
    }
    currPos++;
  }
  if (curl > 0) {
    throw new Error("Did you miss a curly?");
  } else {
    console.log("Compilation successful!");
  }
  return blocks;
}
var blocks = tokener("html {\nheader {\ndiv.header '}'\n}\nfooter {\n div.footer \n} \n}");
if (blocks.length) {
  console.log(blocks);
  //console.log(tokener(blocks[0].block.trim()));
}
//console.log(blocks);