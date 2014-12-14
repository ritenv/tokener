var fn = function() {
  var block = "header {\n div.header '}' } footer {\n div.footer }",
      startIndex = block.indexOf("{") /* index of first bracket */,
      currPos = startIndex,
      openBrackets = 0,
      stillSearching = true,
      waitForChar = false;

  while (stillSearching && currPos <= block.length) {
    var currChar = block.charAt(currPos);

    if (!waitForChar) {
      switch (currChar) {
        case '{':
          openBrackets++; 
          break;
        case '}':
          openBrackets--;
          break;
        case '"':
        case "'":
          waitForChar = currChar;
          break;
        case '/':
          var nextChar = block.charAt(currPos + 1);
          if (nextChar === '/') {
            waitForChar = '\n';
          } else if (nextChar === '*') {
            waitForChar = '*/';
          }
      }
    } else {
      if (currChar === waitForChar) {
        if (waitForChar === '"' || waitForChar === "'") {
          block.charAt(currPos - 1) !== '\\' && (waitForChar = false);
        } else {
          waitForChar = false;
        }
      } else if (currChar === '*') {
        block.charAt(currPos + 1) === '/' && (waitForChar = false);
      }
    }

    currPos++ 
    if (openBrackets === 0) { stillSearching = false; }
  }

  console.log(block.substring(startIndex , currPos)); // 
}
fn();