"use client"
import React, { useEffect, useState } from 'react'
import Videobox from '../Videobox/Videobox';
import axios from 'axios';

const Videogrid = () => {
    const [video, setvideo] = useState();


    useEffect(() => {
        const getVideo = async()=>{
            const res = await axios.get("http://localhost:3000/api/v1/user/get-videos");
            const data = res.data;
            if(!data.success){
                console.log("Could not get video");
                return;
            }
            setvideo(data.data)
            console.log(data.data);
            
        }
        getVideo();
    }, []);
    return ( 
        <div className='grid grid-cols-4 gap-5 gap-y-10 mt-10'>
            {
                video && video.map((e,i)=>(
                    <Videobox src={e.video} title={e.title} desc={e.desc} owner={e.owner} />
                ))
            }
        </div>
     );
     <Videobox />
}
 
export default Videogrid;