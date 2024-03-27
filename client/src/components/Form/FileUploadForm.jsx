import { Fragment, useContext, useEffect, useState } from 'react';

import { StoreContext } from '@/stores/Store';

import { Strings, imageTypes, fileExt } from '@/support/Constants';

import FileInput from './FileInput';

const FileUploadForm = ({ mini, title, hint, sendFiles, clearFiles, multiple = true, accept }) => {
    const { lang } = useContext(StoreContext)
    const [files, setFiles] = useState([])
    const [inputVisible, setInputVisible] = useState(true)
    const maxCount = multiple ? 4 : 1

    useEffect(() => {
        if (clearFiles && files.length !== 0) {
            setFiles([]);
            setInputVisible(true);
        }
        if (files.length > 0) {
            sendFiles && sendFiles(files);
        } else {
            setInputVisible(true);
        }
    }, [files, sendFiles, clearFiles]);


    useEffect(() => {
        document.addEventListener('paste', handlePaste)
        return () => {
            document.removeEventListener('paste', handlePaste)
        }
    })

    const handlePaste = (e) => {
        if (files.length >= maxCount) return

        const newFile = e.clipboardData.files[0]
        if (!newFile || newFile.type.indexOf('image') === -1) return

        const mergedArray = [...files, newFile]
        let limitedArray = mergedArray.slice(0, maxCount)
        limitedArray.map(i => i.url = URL.createObjectURL(i))
        setFiles(limitedArray)
        setInputVisible(false)
    }

    const handleFile = (e) => {
        if (files.length >= maxCount) return

        const newFiles = e.target.files
        const newFilesArray = Array.from(newFiles)
        const mergedArray = [...files, ...newFilesArray]
        let limitedArray = mergedArray.slice(0, maxCount)
        limitedArray.map(i => i.url = URL.createObjectURL(i))
        setFiles(limitedArray)
        setInputVisible(false)
    }

    const removeFile = (fileToRemove) => {
        setFiles(files.filter(file => file.name !== fileToRemove.name));
        sendFiles(files.filter(file => file.name !== fileToRemove.name));
    }

    return (
        !mini ? (
            <div className={files.length ? 'card_item attach_list' : 'card_item'}>
                {files && (
                    files.map((item, index) => (
                        <Fragment key={index}>
                            {imageTypes.find(i => i === item.type) ? (
                                <div className="attached_file card_left" style={{ backgroundImage: `url(${item.url})` }}>
                                    <span className="remove_file" onClick={() => removeFile(item)}>
                                        <i class="fi fi-rr-cross-small"></i>
                                    </span>
                                </div>
                            ) : (
                                <div className="attached_file card_left empty relative">
                                    <div className="remove_file" onClick={() => removeFile(item)}>
                                        <i class="fi fi-rr-cross-small"></i>
                                    </div>
                                    <div className="flex items-center justify-center absolute inset-0 z-0">
                                        <i class="fi fi-rs-file text-2xl opacity-40"></i>
                                    </div>
                                    <div className="attached_info">
                                        <span className='text-sm font-bold'>{fileExt.exec(item.name)[1]}</span>
                                    </div>

                                </div>
                            )}
                        </Fragment>
                    ))
                )}

                {/* <p className='text-sm'>{title || Strings.attachFile[lang]}</p> */}

                {inputVisible && (
                    <div className="card_body file_input_body flex items-center gap-3 w-full my-2">
                        <div className="form_block">
                            <FileInput
                                onChange={handleFile}
                                multiple={multiple}
                                accept={accept}
                                disabled={files.length >= maxCount}
                            />
                        </div>

                        <div className='select-none cursor-help ml-auto'>
                            <div className="relative group">
                                <i className="fi fi-rr-interrogation text-2xl"></i>
                                <div className="absolute bottom-12 right-0 z-10 hidden px-3 py-2 bg-black rounded-lg shadow-lg w-[180px] max-w-[180px] group-hover:block">
                                    <p className="text-sm text-grey">
                                        {hint || `${Strings.maxFilesCount[lang]}: 4; ${Strings.maxSize[lang]}: 20 Mb ${Strings.perFile[lang]}`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        ) : (
            <Fragment>
                {files.length ? (
                    <div className="card_item attach_list">
                        {files && (
                            files.map((item, index) => (
                                <Fragment key={index}>
                                    {imageTypes.find(i => i === item.type) ? (
                                        <div className="attached_file card_left" style={{ backgroundImage: `url(${item.url})` }}>
                                            <span className="remove_file" onClick={() => removeFile(item)}>
                                                <i class="fi fi-rr-cross-small"></i>
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="attached_file card_left empty relative">
                                            <div className="remove_file" onClick={() => removeFile(item)}>
                                                <i class="fi fi-rr-cross-small"></i>
                                            </div>
                                            <div className="flex items-center justify-center absolute inset-0 z-0">
                                                <i class="fi fi-rs-file text-2xl opacity-40"></i>
                                            </div>
                                            <div className="attached_info">
                                                <span className='text-sm font-bold'>{fileExt.exec(item.name)[1]}</span>
                                            </div>

                                        </div>
                                    )}
                                </Fragment>
                            ))
                        )}
                    </div>
                ) : null}

                <input
                    id="miniFileInput"
                    type="file"
                    className="hidden"
                    multiple={multiple}
                    accept={accept}
                    onChange={handleFile}
                    disabled={files.length >= maxCount}
                />
                <label htmlFor="miniFileInput" className="message_action_item" title={Strings.chooseAFile[lang]}>
                    <i class="fi fi-rr-clip"></i>
                </label>
            </Fragment>
        )
    )
}

export default FileUploadForm;