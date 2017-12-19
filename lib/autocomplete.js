'use babel';

Object.values = obj => Object.keys(obj).map(key => obj[key]) || Object.values;

class Trie {
  constructor(symbol) {
    this.children = new NodeChildren();
    this.symbol = symbol;
  }

  static build(array) {
    let trie = new Trie('');
    for (let i = 0; i < array.length; i++) {
      trie.insert(array[i]);
    }
    return trie;
  }

  search(string) {
    node = this.children.get(string[0]);
    if (node) return string.length == 1 ? node : node.search(string.slice(1));
  }

  insert(string, root = this) {
    let node = root;
    let str = string + '$';
    let element, next_node;
    for (let i = 0; i < str.length; i++) {
      element = str[i];
      next_node = node.children.get(element);
      if (next_node) {
        node = next_node;
      } else {
        node.add_node(element);
        node = node.children.get(element);
      }
    }
    return this;
  }

  add_node(symbol) {
    this.children.add(new Trie(symbol));
  }

  remove_node(symbol) {
    this.children.delete()
  }
}

class NodeChildren {
  constructor() {
    this.children = new Object();
  }

  add(node) {
    this.children[node.symbol] = node;
  }

  get(symbol) {
    return this.children[symbol];
  }

  delete(symbol) {
    delete [this.children[symbol]];
  }

  length() {
    return Object.keys(this.children).length;
  }

  firstChild() {
    return this.length() == 1 ? Object.values(this.children)[0] : null;
  }
}

const COMMANDS_TRIE = Trie.build(
  Object.keys(atom.commands.registeredCommands).concat(
    Object.keys(
      require('./command/aliases.json')
    )
  )
);

export default function autocomplete(text) {
  trie = COMMANDS_TRIE.search(text);
  result = '';
  while (trie && trie.children.length() == 1) {
    trie = trie.children.firstChild();
    if (trie.symbol != '$') result += trie.symbol;
  }
  return text + result;
}
