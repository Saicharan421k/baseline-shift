import * as vscode from 'vscode';

/**
 * Provides the "Quick Fix" for modernizing indexOf checks.
 */
export class IndexOfActionProvider implements vscode.CodeActionProvider {

    public static readonly providedCodeActionKinds = [
        vscode.CodeActionKind.QuickFix
    ];

    provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.CodeAction[] {
        // For each diagnostic existing on the line, see if we can offer a fix.
        return context.diagnostics
            .filter(diagnostic => diagnostic.message.startsWith('Modernize this:'))
            .map(diagnostic => this.createCommandCodeAction(diagnostic));
    }

    private createCommandCodeAction(diagnostic: vscode.Diagnostic): vscode.CodeAction {
        const action = new vscode.CodeAction('Upgrade to .includes()', vscode.CodeActionKind.QuickFix);
        
        // This is the magic: we create a "WorkspaceEdit" that describes the change.
        action.edit = new vscode.WorkspaceEdit();
        
        // We'll replace the entire outdated expression with the new, modern one.
        const document = vscode.window.activeTextEditor?.document;
        if (document) {
            const originalText = document.getText(diagnostic.range);
            
            // Use a simple pattern match to extract the array and the argument.
            // Example: "fruits.indexOf(item) !== -1"
            const match = originalText.match(/(.*)\.indexOf\((.*)\)/);

            if (match && match[1] && match[2]) {
                const arrayVariable = match[1].trim(); // "fruits"
                const argument = match[2].trim(); // "item"
                const replacementText = `${arrayVariable}.includes(${argument})`;

                // Tell VS Code to replace the old code (covered by the diagnostic's range) with the new text.
                action.edit.replace(document.uri, diagnostic.range, replacementText);
            }
        }
        
        // Mark this as the preferred action for this diagnostic.
        action.isPreferred = true;

        return action;
    }
}