import React from 'react'

const FormSection = ({children}) => {
    return (
        <div className='flex flex-col gap-8 shadow-lg w-[33%] mx-auto my-10 px-10 py-5 bg-slate-800 rounded-xl text-white'>
            {children}
        </div>
    );
}

export default FormSection;