import * as vscode from 'vscode'; // Импортируем API VS Code для работы с расширениями

let isAutoLogEnabled = true; // Флаг для включения/отключения функции автоматического добавления временных меток

export function activate(context: vscode.ExtensionContext) {
    // Регистрируем команду "Add Timestamp"
    let disposable = vscode.commands.registerCommand('extension.addTimestamp', () => {
        const editor = vscode.window.activeTextEditor; // Получаем активный редактор
        if (editor) {
            // Формируем временную метку в часовом поясе GMT+3
            const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Etc/GMT-3' });
            editor.edit(editBuilder => {
                // Вставляем временную метку в место, где находится курсор
                editBuilder.insert(editor.selection.active, `// ${timestamp}\n`);
            });
        }
    });

    // Обработчик события сохранения документа
    const onSave = vscode.workspace.onDidSaveTextDocument((document) => {
        if (!isAutoLogEnabled) {
            return; // Если функция авто-лога отключена, ничего не делаем
        }
        const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Etc/GMT-3' }); // Создаем временную метку
        const edit = vscode.window.activeTextEditor; // Получаем активный редактор
        if (edit) {
            edit.edit(editBuilder => {
                // Вставляем временную метку в конец файла
                editBuilder.insert(new vscode.Position(edit.document.lineCount, 0), `\n// Last saved: ${timestamp}`);
            });
        }
    });

    // Регистрируем команду для включения авто-лога
    let enableLog = vscode.commands.registerCommand('extension.enableAutoLog', () => {
        isAutoLogEnabled = true; // Устанавливаем флаг в true
        vscode.window.showInformationMessage('Auto log on save enabled.'); // Показываем уведомление пользователю
    });

    // Регистрируем команду для отключения авто-лога
    let disableLog = vscode.commands.registerCommand('extension.disableAutoLog', () => {
        isAutoLogEnabled = false; // Устанавливаем флаг в false
        vscode.window.showInformationMessage('Auto log on save disabled.'); // Показываем уведомление пользователю
    });

    // Добавляем все зарегистрированные команды и обработчик в подписки
    context.subscriptions.push(disposable, onSave, enableLog, disableLog);
}

export function deactivate() {
    // Функция вызывается при деактивации расширения, можно добавить логику очистки ресурсов, если нужно
}
