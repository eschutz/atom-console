'use babel';

import AtomConsole from '../lib/atom-console';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('AtomConsole', () => {
    let workspaceElement, activationPromise;

    beforeEach(() => {
        workspaceElement = atom.views.getView(atom.workspace);
        activationPromise = atom.packages.activatePackage('atom-console');
    });

    describe('when the atom-console:toggle event is triggered', () => {
        it('slides the console on or off screen', () => {
            // Before the activation event the view is not on the DOM, and no panel
            // has been created
            expect(workspaceElement.querySelector('.atom-console')).not.toExist();

            // This is an activation event, triggering it will cause the package to be
            // activated.
            atom.commands.dispatch(workspaceElement, 'atom-console:toggle');

            waitsForPromise(() => {
                return activationPromise;
            });

            runs(() => {
                expect(workspaceElement.querySelector('.atom-console')).toExist();

                let atomConsoleElement = workspaceElement.querySelector('.atom-console');
                expect(atomConsoleElement).toExist();

                let atomConsolePanel = atom.workspace.panelForItem(atomConsoleElement);
                //expect(AtomConsole.atomConsoleVisible).toEqual(true);
                atom.commands.dispatch(workspaceElement, 'atom-console:toggle');
                //expect(AtomConsole.atomConsoleVisible).toEqual(true);
            });
        });

        it('slides the console on or off screen', () => {
            // This test shows you an integration test testing at the view level.

            // Attaching the workspaceElement to the DOM is required to allow the
            // `toBeVisible()` matchers to work. Anything testing visibility or focus
            // requires that the workspaceElement is on the DOM. Tests that attach the
            // workspaceElement to the DOM are generally slower than those off DOM.
            jasmine.attachToDOM(workspaceElement);

            expect(workspaceElement.querySelector('.atom-console')).not.toExist();

            // This is an activation event, triggering it causes the package to be
            // activated.
            atom.commands.dispatch(workspaceElement, 'atom-console:toggle');

            waitsForPromise(() => {
                return activationPromise;
            });

            runs(() => {
                // Now we can test for view visibility
                let atomConsoleElement = workspaceElement.querySelector('.atom-console');
                expect(AtomConsole.atomConsoleVisible).toEqual(true);
                atom.commands.dispatch(workspaceElement, 'atom-console:toggle');
                expect(AtomConsole.atomConsoleVisible).toEqual(false);
            });
        });
    });
});
