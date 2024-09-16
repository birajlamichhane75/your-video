import { Search, SearchIcon } from 'lucide-react';
import React from 'react'

const SearchBar = () => {
    return ( 
        <div>
            <div className=' flex items-center gap-1 max-w-[45%] mx-auto rounded-lg bg-slate-200 border-slate-400 border'>
                <span className='px-2'><SearchIcon className='text-xl'/></span>
                <div className='w-full'>
                    <input type="text" placeholder='Search' className='outline-none w-full py-2 bg-slate-200 rounded-lg text-slate-800'/>
                </div>
            </div>
        </div>
     );
}
 
export default SearchBar;