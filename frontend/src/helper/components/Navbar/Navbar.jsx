import Overlay from '@/helper/section/overlay/Overlay';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const Navbar = () => {
    return (
        <nav className='px-10 py-5 w-full shadow-lg bg-slate-200'>
            <Overlay>
                <div className='grid grid-cols-2 mb-4'>
                    <div className='flex justify-start'>
                        <h1>Logo</h1>
                    </div>

                    <div className='flex justify-end'>
                        <span>
                            <Image src="/profile.png" height={"500"} width={500} alt="" className='h-10 w-10 rounded-full border-2 object-cover'/>
                        </span>
                    </div>

                </div>
            </Overlay>

            <Overlay>
                <div>
                    <ul className="menu flex gap-10 justify-center items-center">
                        <li><Link href={""}>Home</Link></li>
                        <li><Link href={""}>Tweet</Link></li>
                        <li><Link href={""}>History</Link></li>
                        <li><Link href={""}>Setting</Link></li>
                    </ul>
                </div>
            </Overlay>
        </nav>

    );
}

export default Navbar;