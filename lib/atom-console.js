'use babel';

import AtomConsoleView from './atom-console-view';
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
        require('atom-package-dependencies').install();
        this.atomConsoleView = new AtomConsoleView(state.atomConsoleViewState);
        this.atomConsoleWrapper = atom.workspace.addBottomPanel({
            item: this.atomConsoleView.getElement()
        });
        this.consoleHeight = parseInt(getComputedStyle(this.atomConsoleWrapper.getItem()).getPropertyValue("height").replace("px", ""));

        this.atomConsoleVisible = false;

        document.querySelector('atom-panel.bottom.tool-panel.panel-bottom').style.borderBottom = "none";

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'atom-console:toggle': () => this.toggle(),
            'atom-console:send-command': () => this.atomConsoleView.sendCommand(),
            'atom-console:stop-tool': () => this.atomConsoleView.commandHandler.stopTool(),
            'atom-console:focus': () => document.querySelector('atom-text-editor[mini].console').focus()
        }));

        this.initialCursorHeight = parseInt(document.querySelector('atom-text-editor[mini].console::shadow .cursors .cursor').style.height.replace("px", ""));
        this.consoleCursorHeight = this.initialCursorHeight - this.initialCursorHeight / 4;

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

    toggle() {
        if (this.atomConsoleVisible) {
            this.atomConsoleVisible = this.atomConsoleView.console_animate_out(this.atomConsoleWrapper, this.consoleHeight);
            atom.views.getView(atom.workspace).focus();
        } else {
            this.atomConsoleVisible = this.atomConsoleView.console_animate_in(this.atomConsoleWrapper, this.consoleHeight);
            const cursor = document.querySelector('atom-text-editor[mini].console::shadow .cursors .cursor');
            if (cursor) { // To avoid spec getting null from cursor.setAttribute – Will be cleaned up in future
                cursor.setAttribute('style', cursor.getAttribute('style').replace(`height: ${this.initialCursorHeight}px`, `height: ${this.consoleCursorHeight}px`));
            };
            const editor = document.querySelector('atom-text-editor[mini].console');
            if (editor) { // Spec doesn't find the editor either
                editor.focus();
            };
        }
    }

};
