"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode")); // Импортируем API VS Code для работы с расширениями
let isAutoLogEnabled = true; // Флаг для включения/отключения функции автоматического добавления временных меток
function activate(context) {
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
function deactivate() {
    // Функция вызывается при деактивации расширения, можно добавить логику очистки ресурсов, если нужно
}
//# sourceMappingURL=extension.js.map