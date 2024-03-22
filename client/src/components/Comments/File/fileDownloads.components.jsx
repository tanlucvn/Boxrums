import React, { useContext, useState } from 'react'
import NoDataMessage from '../../NoData';
import AnimationWrapper from '../../../common/page-animation';
import { BACKEND, Strings, fileExt, imageTypes, videoTypes } from '@/support/Constants';
import { StoreContext } from '@/stores/Store';
import { FileContext } from '@/pages/Uploads/File';
import FileCommentField from './fileCommentField.component';
import FileCommentCard from './fileCommentCard.component';
import { LabelInputBox } from '../../Form/Input';
import axios from 'axios';
import { dateFormat, formatBytes } from '@/support/Utils';
import { AttachCard } from '@/components/Card/Card2';

const FileDownloads = () => {
    const { lang } = useContext(StoreContext)
    const { file, setFile, comment, downloadsWrapper, setDownloadsWrapper } = useContext(FileContext)
    const [loading, setLoading] = useState(false)

    const onDownload = () => {
        if (!loading) {
            setLoading(true);
            axios
                .put(`${BACKEND}/api/file/download`, { fileId: file._id }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    const data = response.data;
                    if (!data.error) {
                        setFile({ ...file, ...data });
                        const win = window.open(`${BACKEND}${data.file.url}`, '_blank');
                        win.focus();
                    } else {
                        throw Error(data.error?.message || 'Error');
                    }
                })
                .catch(error => console.error(error))
                .finally(() => setLoading(false));
        }
    };

    // console.log(file)

    return (
        <div
            className={'max-sm:w-full fixed ' + (downloadsWrapper ? 'top-0 sm:right-0' : "top-[100%] sm:right-[-100%]") + " duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-7 overflow-y-auto overflow-x-hidden"}
        >
            <div className="relative">
                <h1 className='text-xl font-medium'>{Strings.download[lang]}</h1>
                <p className='text-lg mt-2 w-[70&] text-dark-grey line-clamp-1 '>{file.title}</p>
                <button onClick={() => setDownloadsWrapper(preVal => !preVal)} className='absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey'>
                    <i className='fi fi-rr-cross text-2xl mt-1'></i>
                </button>
                <hr className='border-grey my-8 w-[120%] -ml-10' />

                <div>
                    <p className='text-dark-grey/80 my-2'>File name:
                        <span className='text-black font-bold ml-2'>
                            {file.file.url.replace("/uploads/", "")}
                        </span>
                    </p>

                    <p className='text-dark-grey/80 my-2'>{Strings.extension[lang]}:
                        <span className='text-black font-bold ml-2'>
                            {fileExt.exec(file.file.url)[1]}
                        </span>
                    </p>

                    <p className='text-dark-grey/80 my-2'>{Strings.fileSize[lang]}:
                        <span className='text-black font-bold ml-2'>
                            {formatBytes(file.file.size)}
                        </span>
                    </p>

                    <p className='text-dark-grey/80 my-2'>{Strings.createdAt[lang]}:
                        <span className='text-black font-bold ml-2'>
                            {dateFormat(file.createdAt)}
                        </span>
                    </p>

                    {imageTypes.find(i => i === file.file.type) ? (
                        <img
                            className="relative w-full h-[300px] rounded-md my-5"
                            src={BACKEND + file.file.url}
                            onClick={() => imageView(BACKEND + file.file.url)}
                            alt="Preview"
                        />
                    ) : videoTypes.find(i => i === file.file.type) ? (
                        <video
                            className="relative w-full h-[300px] rounded-md my-5"
                            src={BACKEND + file.file.url}
                            poster={BACKEND + file.file.thumb}
                            controls
                        />
                    ) : <AttachCard data={file} />}


                    {file && file.desc &&
                        <>
                            <LabelInputBox text={Strings.desc[lang]} />
                            <div className='bg-grey p-5 rounded-md'>
                                <p className='text-dark-grey/80'>
                                    {file.desc}
                                </p>
                            </div>
                        </>}

                    <button onClick={onDownload} className='btn-dark w-full mt-7 mb-3'>
                        {loading ? Strings.downloading[lang] : Strings.download[lang]}
                    </button>
                    <button className='btn-light w-full'>Share</button>
                </div>
            </div>
        </div>
    )
}

export default FileDownloads