var tokener = function(str) {
  var startIndex = -1;
  var currPos = 0;
  var curl = 0;
  var stillSearching = true;
  var toIgnore = false;
  var blocks = [];

  while (stillSearching && currPos <= str.length) {
    var currChar = str.charAt(currPos);
    // console.log("Looking at: " + currPos + currChar);
    if (!toIgnore) {
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
          toIgnore = currChar;
          break;
      }
    } else {
      if (currChar === toIgnore) {
        toIgnore = false;
      }
    }
    currPos++;
    if (curl === 0 && startIndex > 0) {
      stillSearching = false;
    }
  }
  console.log("Done");
  return str.substring(startIndex, currPos);
}

console.log(tokener("header {\n div.header '}' } footer {\n div.footer }"));
