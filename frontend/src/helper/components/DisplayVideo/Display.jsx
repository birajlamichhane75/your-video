import Overlay from '@/helper/section/overlay/Overlay';
import SearchBar from '@/helper/ui/SearchBar/Searchbar';
import React from 'react'
import Videogrid from '../Videogrid/Videogrid';


const Display = () => {
    return (
        <div className='bg-gray-200 min-h-screen'>
            <Overlay>
                <SearchBar />
                <Videogrid />
            </Overlay>

        </div>
    );
}

export default Display;