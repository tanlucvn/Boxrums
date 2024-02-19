import { useEffect, useRef } from 'react';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

import './style.scss'

export default function TextareaForm({ value, placeholder = '', required = false, onChange, className, panel = true }) {
    const editorRef = useRef();

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.togglePreview(false);
        }
    }, []);

    return <MdEditor className={className} ref={editorRef} modelValue={value} onChange={onChange} placeholder={placeholder} language='en-US' showCodeRowNumber='true' theme='dark' preview='false' />;
}
