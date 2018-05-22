'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "cryptol" is now active!');
    const cryptolTerminal = vscode.window.createTerminal("Cryptol extension REPL", "cryptol");
    const cryptolTerminalOpen = true;
    const loadedFile = "";
    let cs = { cryptolTerminal: cryptolTerminal, cryptolTerminalOpen: cryptolTerminalOpen, loadedFile: loadedFile };
    vscode.window.onDidCloseTerminal((terminal => { if (terminal == cryptolTerminal) {
        cs.cryptolTerminalOpen = false, cs.loadedFile = "";
    } }));
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('cryptol.runInTerminal', () => {
        runInTerminal(cs);
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('cryptol.runSelectionInTerminal', () => {
        prepareTerminal(cryptolTerminal, cryptolTerminalOpen);
        let currentEditor = vscode.window.activeTextEditor;
        if (currentEditor) {
            if (cs.loadedFile != currentEditor.document.fileName) {
                runInTerminal(cs);
            }
            cryptolTerminal.sendText(selectionOrWord(currentEditor));
        }
    });
    disposable = vscode.commands.registerCommand('cryptol.typeSelectionInTerminal', () => {
        prepareTerminal(cryptolTerminal, cryptolTerminalOpen);
        let currentEditor = vscode.window.activeTextEditor;
        if (currentEditor) {
            if (cs.loadedFile != currentEditor.document.fileName) {
                runInTerminal(cs);
            }
            cryptolTerminal.sendText(":t " + selectionOrWord(currentEditor));
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function selectionOrWord(currentEditor) {
    let selectedText = currentEditor.document.getText(currentEditor.selection);
    if (selectedText == "") {
        selectedText =
            currentEditor.document.getText(currentEditor.document.getWordRangeAtPosition(currentEditor.selection.active));
    }
    return selectedText;
}
function runInTerminal(cs) {
    prepareTerminal(cs.cryptolTerminal, cs.cryptolTerminalOpen);
    let currentEditor = vscode.window.activeTextEditor;
    if (currentEditor) {
        cs.cryptolTerminal.sendText(":l " + currentEditor.document.fileName);
        cs.loadedFile = currentEditor.document.fileName;
    }
}
function prepareTerminal(cryptolTerminal, cryptolTerminalOpen) {
    if (!cryptolTerminalOpen) {
        cryptolTerminal = vscode.window.createTerminal("Cryptol extension REPL", "cryptol");
        cryptolTerminalOpen = true;
    }
    cryptolTerminal.show(true);
    return cryptolTerminal;
}
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map