"use client"
import FormSection from '@/helper/section/formSection/formSection';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const Register = () => {
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [fullName, setfullName] = useState("");
  const [avatar, setavatar] = useState();
  const [coverImage, setcoverImage] = useState();
  const [checkField, setcheckField] = useState(true);
  const [signupStatus, setsignupStatus] = useState(true);
  const [loading, setloading] = useState(false);
  const router = useRouter();

  const formData = new FormData();
  formData.append("username", username)
  formData.append("email", email)
  formData.append("password", password)
  formData.append("fullName", fullName)
  formData.append("avatar", avatar)
  formData.append("coverImage", coverImage)


  const handelSubmit = async () => {
    if (username && email && password && fullName && avatar) {
      setloading(true)
      setcheckField(true)

      const res = await axios.post(`http://localhost:3000/api/v1/user/register`, formData)
      const data = await res.data

      if (data.data.success) {
        console.log("Successfully Register");
        router.push('/login')
        setloading(false)
      }
      
      else {
        setsignupStatus(false)
        setloading(false)
      }
    }

    else {
      setcheckField(false);
      console.log("Every fields are requires");
    }

    setloading(false)
  }

  return (
    <div>
      <div className=''>
        <FormSection>
          <div className='mb-2'>
            <h2 className='text-white font-bold text-center'>Welcome to Share-Video</h2>
          </div>

          {
            !signupStatus &&
            <span className='text-center'>
              <p className='fieldError'>
                Sign Up Fail!
              </p>
            </span>

          }
          <div className='flex flex-col gap-5'>
            <span>
              <label htmlFor="" className='field'>Full Name</label>
              <input className='inputtext' type="text" name='fullName' value={fullName} placeholder='Enter your FullName' onChange={(e) => {
                setfullName(e.target.value)
              }} />
              {
                !checkField && !fullName &&
                (<span>
                  <p className="fieldError">
                    Full Name is required!
                  </p>
                </span>)
              }

            </span>

            <span>
              <label htmlFor="" className='field'>Username</label>
              <input className='inputtext' type="text" name='username' value={username} placeholder='Enter your Username' onChange={(e) => {

                setusername(e.target.value)
              }} />

              {
                !checkField && !username &&
                (<span>
                  <p className="fieldError">
                    Username is required!
                  </p>
                </span>)
              }

            </span>

            <span>
              <label htmlFor="" className='field'>Email</label>
              <input className='inputtext' type="text" name='email' value={email} placeholder='Enter your Email' onChange={(e) => {
                setemail(e.target.value)
              }} />

              {
                !checkField && !email &&
                (<span>
                  <p className="fieldError">
                    Email is require!
                  </p>
                </span>)
              }
            </span>

            <span>
              <label htmlFor="" className='field'>Password</label>
              <input className='inputtext' type="password" name='password' value={password} placeholder='Enter your Password' onChange={(e) => {
                setpassword(e.target.value)
              }} />

              {
                !checkField && !password &&
                (<span className="fieldError">
                  <p>Password is require!</p>
                </span>)
              }

            </span>

            <span>
              <label htmlFor="" className='field'>Avater</label>
              <input className="fileinput" type="file" name='avatar' onChange={(e) => {
                console.log(e.target.files[0]);
                setavatar(e.target.files[0])
              }} />

              {
                !checkField && !avatar &&
                < span className="fieldError">
                  <p>Avatar is require !</p>
                </span>
              }

            </span>

            <span>
              <label htmlFor="" className='field'>CoverImage</label>
              <input className="fileinput" type="file" name='coverImage' onChange={(e) => {

              }} />
            </span>

          </div>
          <span>
            {loading ?
              (<button disabled type="button" className=" text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 w-full">
                <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                </svg>
                
              </button>)
              :

              (<button
                onClick={handelSubmit}
                type="button"
                className=" text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 w-full">
                Register
              </button>)
            }

          </span>

          <div className='flex gap-2 justify-center'>
            <span><p>Already have account ?</p></span>
            <span><Link href="/login">Login</Link></span>
          </div>
        </FormSection>
      </div >
    </div >
  )
}

export default Register