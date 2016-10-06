'use babel';

import AtomConsoleView from './atom-console-view';
import AtomConsole from './atom-console-class';
import {
    CompositeDisposable
} from 'atom';

export default {

    atomConsoleView: null,
    bottomPanel: null,
    subscriptions: null,
    atomConsoleWrapper: null,
    atomConsoleVisible: null,

    activate(state) {
        this.atomConsoleView = new AtomConsoleView(state.atomConsoleViewState);
        this.atomConsoleWrapper = atom.workspace.addBottomPanel({
            item: this.atomConsoleView.getElement()
        });
        this.consoleHeight = parseInt(getComputedStyle(this.atomConsoleWrapper.getItem()).getPropertyValue("height").replace("px", ""));

        this.bottomPanel = document.querySelectorAll('atom-panel.bottom.tool-panel\.panel-bottom')[0];
        this.bottomPanel.classList.add('custom-bottom-panel');

        //this.atomConsole = new AtomConsole(this, this.consoleHeight); -- Not currently working
        this.atomConsoleVisible = false;

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'atom-console:toggle': () => this.toggle(),
            'atom-console:send-command' : () => this.atomConsoleView.sendCommand(),
        }));

        this.animateSpeed = 3;

    },

    deactivate() {
        this.atomConsoleWrapper.destroy();
        this.subscriptions.dispose();
        this.atomConsoleView.destroy();
    },

    serialize() {
        return {
            atomConsoleViewState: this.atomConsoleView.serialize()
        };
    },

    // These two methods will be later implemented in a separate class file

    console_animate_in() {
        let atom_console = this.atomConsoleWrapper.getItem();
        let height = this.consoleHeight;
        let pos = 0;
        let id = setInterval(frame, this.animateSpeed);

        function frame() {
            if (pos == height) {
                clearInterval(id);
            } else {
                pos++;
                atom_console.style.height = pos + 'px';
            }
        }
        this.atomConsoleVisible = true;
    },

    console_animate_out() {
        let atom_console = this.atomConsoleWrapper.getItem();
        let height = this.consoleHeight;
        let pos = height;
        let id = setInterval(frame, this.animateSpeed);

        function frame() {
            if (pos == 0) {
                clearInterval(id);
            } else {
                pos--;
                atom_console.style.height = pos + 'px';
            }

        }
        this.atomConsoleVisible = false;
    },


    toggle() {
        console.log('AtomConsole was toggled!');
        if (this.atomConsoleVisible) {
            this.console_animate_out();
            atom.views.getView(atom.workspace).focus();
        } else {
            this.console_animate_in();
            const cursor = document.querySelector('atom-text-editor[mini].console::shadow .cursors .cursor');
            cursor.setAttribute('style', cursor.getAttribute('style').replace('height: 20px', 'height: 15px'));
            document.querySelector('atom-text-editor[mini].console').focus();
        }
    }

};
