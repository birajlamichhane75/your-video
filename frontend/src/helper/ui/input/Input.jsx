import React from 'react'

const Input = ({name,value,onChange,type,placeholder}) => {
    return ( 
        <div>
            <input 
            className='border-1 border-black px-5 py-2'
            type={type} 
            name={name} 
            value={value} 
            onChange={()=> onChange(e)} 
            placeholder={placeholder} />
        </div>
     );
}
 
export default Input;