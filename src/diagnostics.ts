import * as vscode from 'vscode';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as postcss from 'postcss';
import { isBaselineSupported } from './baseline'; // <-- IMPORT OUR NEW FUNCTION

export function refreshDiagnostics(doc: vscode.TextDocument, diagnosticCollection: vscode.DiagnosticCollection) {
    if (doc.languageId === 'javascript') {
        runJavaScriptDiagnostics(doc, diagnosticCollection);
    } else if (doc.languageId === 'css') {
        runCssDiagnostics(doc, diagnosticCollection);
    }
}

function runJavaScriptDiagnostics(doc: vscode.TextDocument, diagnosticCollection: vscode.DiagnosticCollection) {
    // First, check if the modern feature we want to suggest is actually in Baseline.
    if (!isBaselineSupported('array-includes')) {
        diagnosticCollection.clear(); // If not, don't show any diagnostics.
        return;
    }

    const diagnostics: vscode.Diagnostic[] = [];
    const code = doc.getText();
    try {
        const ast = parser.parse(code, { sourceType: 'module', plugins: ['jsx'] });
        traverse(ast, {
            BinaryExpression(path) {
                const node = path.node;
                const isIndexOfCheck = (node.operator === '!==' || node.operator === '!=') && node.left.type === 'CallExpression' && node.left.callee.type === 'MemberExpression' && node.left.callee.property.type === 'Identifier' && node.left.callee.property.name === 'indexOf' && node.right.type === 'UnaryExpression' && node.right.operator === '-' && node.right.argument.type === 'NumericLiteral' && node.right.argument.value === 1;
                if (isIndexOfCheck && node.loc) {
                    const range = new vscode.Range(new vscode.Position(node.loc.start.line - 1, node.loc.start.column), new vscode.Position(node.loc.end.line - 1, node.loc.end.column));
                    const message = 'Modernize this: .includes() is a Baseline-supported and more readable alternative.';
                    const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Hint);
                    diagnostics.push(diagnostic);
                }
            }
        });
        diagnosticCollection.set(doc.uri, diagnostics);
    } catch (error) {
        diagnosticCollection.set(doc.uri, []);
    }
}

function runCssDiagnostics(doc: vscode.TextDocument, diagnosticCollection: vscode.DiagnosticCollection) {
    // Check if Flexbox is a valid Baseline suggestion before flagging floats.
    if (!isBaselineSupported('flexbox')) {
        diagnosticCollection.clear();
        return;
    }

    const diagnostics: vscode.Diagnostic[] = [];
    const code = doc.getText();
    try {
        const root = postcss.parse(code, { from: doc.fileName });
        root.walkRules(rule => {
            rule.walkDecls(decl => {
                if (decl.prop === 'float' && (decl.value === 'left' || decl.value === 'right')) {
                    if (decl.source && decl.source.start && decl.source.end) {
                        const range = new vscode.Range(new vscode.Position(decl.source.start.line - 1, decl.source.start.column - 1), new vscode.Position(decl.source.end.line - 1, decl.source.end.column));
                        const message = 'Consider using Flexbox or Grid for layout. Both are fully Baseline-supported and more powerful than floats.';
                        const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Hint);
                        diagnostics.push(diagnostic);
                    }
                }
            });
        });
        diagnosticCollection.set(doc.uri, diagnostics);
    } catch (error) {
        diagnosticCollection.set(doc.uri, []);
    }
}