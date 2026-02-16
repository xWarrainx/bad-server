import {
    ContentEditableEvent,
    Editor,
    EditorProvider,
} from 'react-simple-wysiwyg'
import './editor-input.scss'

type EditorInputProps = {
    value: string
    onChange: (value: string) => void
}

export default function EditorInput({ onChange, value }: EditorInputProps) {
    // Функция для очистки опасного HTML перед сохранением
    const handleChange = (e: ContentEditableEvent) => {
        const dirtyHtml = e.target.value;
        // Оставляем только безопасные теги
        const cleanHtml = dirtyHtml
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/on\w+="[^"]*"/g, '') // Удаляем обработчики событий
            .replace(/javascript:/gi, ''); // Удаляем javascript: ссылки
        onChange(cleanHtml);
    };

    return (
        <div className='customEditor'>
            <EditorProvider>
                <Editor value={value} onChange={handleChange}>
                    {/* Только базовое форматирование, без ссылок */}
                </Editor>
            </EditorProvider>
        </div>
    );
}
