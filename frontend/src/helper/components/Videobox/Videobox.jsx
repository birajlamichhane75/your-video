import Video from '@/helper/ui/video/Video';
import React from 'react'

const Videobox = ({src,title,desc,owner}) => {
    return ( 
        <div className='border rounded-lg'>
            <div className='min-w-[4rem] min-h-[10rem]'>
                <Video src={src} height={"300"} width={"450"}/>
            </div>

            <div className='border-t'>
                <div className='line-clamp-2'>
                    <p>{title}</p>
                    <p>{desc}</p>
                </div>
            </div>
        </div>
     );
}
 
export default Videobox;