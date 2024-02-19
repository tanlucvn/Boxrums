import { useState } from 'react';

export const useForm = (callback, initialState = {}) => {
    const [values, setValues] = useState(initialState)

    const onChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
        // console.log("target", e.target.name)
        // console.log("value", e.target.value)
    }

    const addValue = (data) => {
        setValues({ ...values, [data.name]: data.value })
    }

    const onQuillChange = (name, content) => {
        setValues({ ...values, [name]: content });
    };

    const onSubmit = (e) => {
        e.preventDefault()

        callback()
    }

    return {
        onChange,
        addValue,
        onQuillChange,
        onSubmit,
        values,
        reset: () => setValues(initialState)
    }
};
