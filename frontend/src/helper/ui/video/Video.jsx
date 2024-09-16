import React from 'react'

const Video = ({src,height,width}) => {
    return (
        <video width={width} height={height} controls={true} autoPlay  className='overflow-hidden rounded-lg'>
            <source src={src} type="video/mp4" />
        
            Your browser does not support the video tag.
        </video>
    )
}
 
export default Video;

