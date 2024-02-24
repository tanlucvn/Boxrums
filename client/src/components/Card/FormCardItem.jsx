const FormCardItem = ({ children, title, error, row }) => {
    return (
        <div className="card_item">
            <div className={row ? 'card_body row' : 'card_body'}>
                {title || error ? (
                    <div className="m-1 font-medium select-none">
                        {title}
                        {error && <span className="form_error">{error}</span>}
                    </div>
                ) : null}

                {children}
            </div>
        </div>
    )
}

export default FormCardItem;