'use babel';

const COMMANDS = Object.keys(atom.commands.registeredCommands).concat(Object.keys(require('./command/aliases.json')));

export default function autocomplete(text) {
  let startRegex = new RegExp(`^${text}.*`);
  let matchedStarts = [];
  let match, returnMatch = null;

  for (let cmd of COMMANDS) {
    match = cmd.match(startRegex);
    if (match) matchedStarts.push(cmd);
  }

  if (matchedStarts.length == 1) {
      returnMatch = matchedStarts[0];
  } else if (matchedStarts.length == 0) {
    atom.beep();
  } else {

    let lastMatch = matchedStarts[0];
    for (let i in matchedStarts) {
      lastMatch = getSameStart(matchedStarts[i], lastMatch);
    }
    returnMatch = lastMatch;
  }

  return returnMatch;
}

function getSameStart(str1, str2) {
  let same = "";
  for (let i in str1) {
    if (str1[i] == str2[i]) {
      same = same.concat(str1[i]);
    } else {
      break;
    }
  }
  return same;
}
