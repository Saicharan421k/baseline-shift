import * as vscode from 'vscode';
import { refreshDiagnostics } from './diagnostics';
import { IndexOfActionProvider } from './CodeActions';
import { loadBaselineData } from './baseline'; // <-- Import our new loader function

// The activate function can be async!
export async function activate(context: vscode.ExtensionContext) {

    console.log('Baseline Shift is activating...');

    // ***** THIS IS THE NEW PART *****
    // We wait for the baseline data to be loaded before we do anything else.
    await loadBaselineData();

    console.log('Congratulations, your extension "baseline-shift" is now active!');

    const subscriptions = context.subscriptions;
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('baseline-shift');

    // The rest of the code is the same, but now it will only run after the data is loaded.
    if (vscode.window.activeTextEditor) {
        refreshDiagnostics(vscode.window.activeTextEditor.document, diagnosticCollection);
    }
    subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            refreshDiagnostics(editor.document, diagnosticCollection);
        }
    }));
    subscriptions.push(vscode.workspace.onDidSaveTextDocument(doc => {
        refreshDiagnostics(doc, diagnosticCollection);
    }));
    subscriptions.push(vscode.workspace.onDidChangeTextDocument(event => {
        refreshDiagnostics(event.document, diagnosticCollection);
    }));

    subscriptions.push(
        vscode.languages.registerCodeActionsProvider(['javascript', 'css'], new IndexOfActionProvider(), {
            providedCodeActionKinds: IndexOfActionProvider.providedCodeActionKinds
        })
    );
}

export function deactivate() {}