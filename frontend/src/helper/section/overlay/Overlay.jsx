import React from 'react'

const Overlay = ({children}) => {
    return ( 
        <div className='max-w-[80rem] mx-auto'>
            {children}
        </div>
     );
}
 
export default Overlay;