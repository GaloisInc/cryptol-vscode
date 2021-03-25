'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

//import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient';
interface CryptolState{
    cryptolTerminal : vscode.Terminal;
    cryptolTerminalOpen : boolean;
    loadedFile : string;
}
// show symbol definition 
/*class GoDefinitionProvider implements vscode.DefinitionProvider{
    public provideDefinition(
        document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken):
        Thenable<vscode.Location>{

        }
    )
}*/

// helper functions
function selectionOrWord(currentEditor : vscode.TextEditor) : string {
    let selectedText = currentEditor.document.getText(currentEditor.selection);
    if(selectedText===""){
        selectedText=
        currentEditor.document.getText(
            currentEditor.document.getWordRangeAtPosition(currentEditor.selection.active)
        );
    }
    return selectedText;
}

function runInTerminal(cs : CryptolState){
    prepareTerminal(cs.cryptolTerminal, cs.cryptolTerminalOpen);
    let currentEditor = vscode.window.activeTextEditor;
    if(currentEditor){
        cs.cryptolTerminal.sendText(":l " + currentEditor.document.fileName);
        cs.loadedFile = currentEditor.document.fileName;
    }
}

function prepareTerminal(cryptolTerminal: vscode.Terminal, cryptolTerminalOpen : boolean) : vscode.Terminal {
    if(!cryptolTerminalOpen){
        let terminalPath:string = vscode.workspace.getConfiguration('cryptol').get('path','cryptol');
        console.log(terminalPath);
        cryptolTerminal = vscode.window.createTerminal("Cryptol extension REPL", terminalPath);
        cryptolTerminalOpen=true;
    }
    cryptolTerminal.show(true);
    return cryptolTerminal;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "cryptol" is now active!');
    let terminalPath:string = vscode.workspace.getConfiguration('cryptol').get('path','cryptol');
    console.log(terminalPath);
    const cryptolTerminal = vscode.window.createTerminal("Cryptol extension REPL", terminalPath);
    const cryptolTerminalOpen: boolean = true;
    const loadedFile = "";

    let cs : CryptolState = {cryptolTerminal: cryptolTerminal, cryptolTerminalOpen: cryptolTerminalOpen, loadedFile: loadedFile};

    vscode.window.onDidCloseTerminal((terminal => { if (terminal === cryptolTerminal) { cs.cryptolTerminalOpen = false, cs.loadedFile="";} }));

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
        if(currentEditor){
            if(cs.loadedFile !== currentEditor.document.fileName){
                runInTerminal(cs);
            }
            cryptolTerminal.sendText(selectionOrWord(currentEditor));
        }
    });

    disposable = vscode.commands.registerCommand('cryptol.typeSelectionInTerminal', () => {
        prepareTerminal(cryptolTerminal, cryptolTerminalOpen);
        let currentEditor = vscode.window.activeTextEditor;
        if(currentEditor){
            if(cs.loadedFile !== currentEditor.document.fileName){
                runInTerminal(cs);
            }
            cryptolTerminal.sendText(":t " + selectionOrWord(currentEditor));
        }
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}