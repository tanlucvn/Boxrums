import { MdPreview, config } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import './style.scss';
import { useRef, useState } from 'react';

const Markdown = ({ source, onImageClick }) => {
    const mdHeadingId = (_text, _level, index) => `heading-${index}`;

    return (
        <>
            <MdPreview editorId={"thread"} language='en-US' modelValue={source} theme='dark' codeTheme='github' showCodeRowNumber="true" mdHeadingId={mdHeadingId} />
        </>
    )
}

export default Markdown;