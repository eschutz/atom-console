'use babel';

// CURRENTLY UNUSED – WILL BE IMPLEMENTED IN A LATER VERSION

export default class AtomConsole {
  constructor(win, height) {
    this.win = win;
    this._console = this.win.consoleWrapper.getItem();
    this.height = height;
  }

  animate_in() {
    this.pos = 0
    let id = setInterval(this.frame(0, id), 3);
    this.visible = true;
  }

  animate_out() {
    this.pos = this.height
    let id = setInterval(this.frame(this.height, id), 3);
    this.visible = false;
  }

//(this.pos == position && position >= this.height)||(this.pos == position && position == 0)

  frame(position, interval) {
      if (this.pos == position) {
          clearInterval(interval); // Signal to clear interval
      } else {
        if (this.pos < position) {
          this.pos++;
        } else if (this.pos > position) {
          this.pos--;
        }
          this._console.style.height = this.pos + 'px';
      }
  }
}
