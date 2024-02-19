import { useContext } from 'react';

import { StoreContext } from '@/stores/Store';

import { Strings } from '@/support/Constants';

const FileInput = ({ onChange, multiple = false, accept, disabled }) => {
    const { lang } = useContext(StoreContext)

    return (
        <>
            <input
                className='hidden'
                id="fileInput"
                type="file"
                multiple={multiple}
                accept={accept}
                onChange={onChange}
                disabled={disabled}
            />
            <label htmlFor="fileInput" className="flex items-center gap-5" title={Strings.chooseAFile[lang]}>
                <div className="relative flex items-center justify-center font-medium border-0 px-4 py-2 w-max min-w-[100px] h-9 text-black bg-grey text-sm rounded-md cursor-pointer select-none">{Strings.choose[lang]}</div>
                <span className='text-sm'>{Strings.fileNotSelected[lang]}</span>
            </label>
        </>
    )
}

export default FileInput;