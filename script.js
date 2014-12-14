var tokener = function(str) {
  var startIndex = -1;
  var currPos = 0;
  var curl = 0;
  var stillSearching = true;
  var ignoreUntil = false;
  var blocks = [];

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
      }
    } else {
      if (currChar === ignoreUntil) {
        ignoreUntil = false;
      }
    }
    currPos++;
    if (curl === 0 && startIndex > 0) {
      stillSearching = false;
    }
  }
  if (curl > 0) {
    throw new Error("Did you miss a curly?");
  }
  return str.substring(startIndex, currPos);
}

console.log(tokener("header {\n div.header '}' } footer {\n div.footer }"));