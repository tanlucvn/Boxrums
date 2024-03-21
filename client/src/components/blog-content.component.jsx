import { StoreContext } from "@/stores/Store"
import { Strings } from "@/support/Constants"
import { useContext, useState } from "react"
import { toast } from 'react-hot-toast'

const Img = ({ url, caption }) => {
  return (
    <div>
      <img src={url} alt="Img" /> {caption.length ? <p className="w-full text-center my-3 md:mb-12 text-base text-dark-grey">{caption}</p> : ''}
    </div>
  )
}

const Quote = ({ quote, caption }) => {
  return (
    <div className="bg-purple/10 p-3 pl-5 border-l-4 border-purple">
      <p className="text-xl leading-10 md:text-2xl" dangerouslySetInnerHTML={{ __html: quote }}></p>
      {caption.length ? <p className="w-full text-purple text-base">{caption}</p> : ""}
    </div>
  )
}

const List = ({ style, items }) => {
  return (
    <ol className={`pl-5 ${style === 'ordered' ? " list-decimal" : " list-disc"}`}>
      {
        items.map((item, i) => {
          return <li key={i} className="my-4" dangerouslySetInnerHTML={{ __html: item }}></li>
        })
      }
    </ol>
  )
}

const Code = ({ data, language }) => {
  StoreContext.current
  const { lang } = useContext(StoreContext)
  const [viewCode, setViewCode] = useState(false)

  const handleCopyClick = () => {
    const textarea = document.createElement('textarea');
    textarea.value = data.replace(/<[^>]+>/g, '');
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    toast.success(Strings.copied[lang]);
  };

  return (
    <>
      <div className="flex items-center gap-3 justify-between">
        <button className="btn-light text-sm px-3 rounded-md flex gap-3" onClick={() => setViewCode(prev => !prev)}>
          {Strings.viewCode[lang]}
          {!viewCode ? <i class="fi fi-rr-display-code text-sm"></i> : <i class="fi fi-sr-display-code text-sm"></i>}
        </button>

        {viewCode &&
          <span class="text-sm font-medium px-2.5 py-0.5 rounded-full ml-2 capitalize">
            {language}
          </span>
        }

        {viewCode &&
          <button className="bg-purple/20 text-purple text-sm font-medium px-2.5 py-0.5 rounded-full ml-2 capitalize" onClick={handleCopyClick}>
            {Strings.copyCode[lang]}
          </button>
        }
      </div>
      {viewCode && <div className="mt-2 bg-grey p-3 pl-5" dangerouslySetInnerHTML={{ __html: data }}>
      </div>}
    </>
  )
}

const BlogContent = ({ block }) => {
  const { type, data } = block;

  // console.log(data)

  if (type === "paragraph") {
    return <p dangerouslySetInnerHTML={{ __html: data.text }}></p>;
  }

  if (type === "header") {
    if (data.level === 3) {
      return <h3
        className="text-2xl font-bold"
        dangerouslySetInnerHTML={{ __html: data.text }}
      ></h3>
    }
    return <h2
      className="text-3xl font-bold"
      dangerouslySetInnerHTML={{ __html: data.text }}
    ></h2>
  }

  if (type === 'image') {
    return <Img url={data.file.url} caption={data.caption} />
  }

  if (type === 'quote') {
    return <Quote quote={data.text} caption={data.caption} />
  }

  if (type === 'list') {
    return <List style={data.style} items={data.items} />
  }

  if (type === 'codeBox') {
    return <Code data={data.code} language={data.language} />
  }

  else {
    return <h1></h1>;
  }
};

export default BlogContent;
