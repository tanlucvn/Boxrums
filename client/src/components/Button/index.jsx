import { Link } from 'react-router-dom';

import './style.scss';

const InputButton = ({ text, className }) => {
    return (
        <input className={className ? 'btn-dark ' + className : 'btn-dark'} type="submit" value={text} />
    )
}

const LinkButton = ({ text, className, link }) => {
    return (
        <Link to={link} className={'btn-dark ' + className}>
            {text}
        </Link>
    )
}

const Button = ({ text, className, onClick }) => {
    return (
        <div onClick={onClick} className={'btn-dark ' + className}>
            {text}
        </div>
    )
}


export { InputButton, LinkButton, Button };