"use client"
import FormSection from '@/helper/section/formSection/formSection';
import Link from 'next/link';
import React, { useState } from 'react'

const Login = () => {
  const [username, setusername] = useState();
  const [email, setemail] = useState();
  const [password, setpassword] = useState();

  const handelSubmit = () => {
    console.log("Email", email, "password", password, "username", username);

  }

  return (
    <div>
      <div className='min-h-screen flex items-center'>
        <FormSection>

          <div className='mb-2'>
            <h2 className='text-white font-bold text-center'>Sign In to Share-Video</h2>
          </div>
          <div className='flex flex-col gap-5'>
            <span>
              <label htmlFor="" className='field'>Username</label>
              <input className='inputtext' type="text" name='username' value={username} placeholder='Enter your Username' onChange={(e) => {

                setusername(e.target.value)
              }} />
            </span>

            <span>
              <label htmlFor="" className='field'>Email</label>
              <input className='inputtext' type="text" name='email' value={email} placeholder='Enter your Email' onChange={(e) => {
                setemail(e.target.value)
              }} />
            </span>

            <span>
              <label htmlFor="" className='field'>Password</label>
              <input className='inputtext' type="text" name='password' value={password} placeholder='Enter your Password' onChange={(e) => {
                setpassword(e.target.value)
              }} />
            </span>
          </div>

          <button
            onClick={handelSubmit}
            type="button"
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 m-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 w-full">
            SignIn
          </button>

          <div className='flex gap-2 justify-center'>
            <span><p>Didn't have account ?</p></span>
            <span><Link href="/register">Register</Link></span>
          </div>

        </FormSection>
      </div>
    </div>
  )
}


export default Login