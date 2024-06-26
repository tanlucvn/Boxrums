import List from '@editorjs/list';
import Image from '@editorjs/image'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import Embed from '@editorjs/embed'
import InlineCode from '@editorjs/inline-code'
import AttachesTool from '@editorjs/attaches';
import CodeBox from '@bomdi/codebox';

const uploadImageByURL = (e) => {
    let link = new Promise((resolve, reject) => {
        try {
            resolve(e)
        }
        catch (err) {
            reject(err)
        }
    })

    return link.then(url => {
        return {
            success: 1,
            file: { url }
        }
    })
}


const uploadImageByFile = (e) => {

}
export const tools = {
    embed: Embed,
    list: {
        class: List,
        inlineToolbar: true
    },
    /* image: {
        class: Image,
        config: {
            uploader: {
                uploadByUrl: uploadImageByURL,
                uploadByFile: uploadImageByFile,
            },
        }
    }, */
    marker: Marker,
    header: {
        class: Header,
        config: {
            placeholder: "Type Heading ....",
            levels: [2, 3, 4],
            defaultLevel: 2,
        }
    },
    inlineCode: InlineCode,
    quote: {
        class: Quote,
        inlineToolbar: true
    },
    attaches: {
        class: AttachesTool,
        config: {
            endpoint: 'http://localhost:8008/uploadFile'
        }
    },
    codeBox: {
        class: CodeBox,
        config: {
            themeName: 'atom-one-dark', // Optional
            useDefaultTheme: 'dark' // Optional. This also determines the background color of the language select drop-down
        }
    },
}
