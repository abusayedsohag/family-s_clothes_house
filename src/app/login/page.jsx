"use client"
import { MainContext } from '@/context/MainContext';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const Login = () => {

    const [see, setSee] = useState(false)
    const { signIn, user } = useContext(MainContext)

    const router = useRouter();

    useEffect(() => {
        if (user) router.push("/");
    }, [user, router]);


    const handleSubmit = (e) => {
        e.preventDefault();

        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(password)) {
            return alert('Please Type a Strong Password')
        }

        signIn(email, password)
            .then(res => {
                if (res.user) {
                    Swal.fire({
                        title: "Login Successful!",
                        icon: "success",
                        draggable: true
                    });
                }
            })
    }



    return (
        <div className='flex justify-center items-center min-h-screen'>
            <div className='max-w-sm'>
                <form onSubmit={handleSubmit} className="fieldset bg-base-200 border-base-300 rounded-box border p-4 shadow-2xl shadow-sky-300">

                    <label className="label">Email</label>
                    <input type="email" name='email' className="input" placeholder="Email" required />

                    <label className="label">Password</label>
                    <label className='input'>
                        <input type={see.pass ? "text" : "password"} placeholder="Password" name='password' required />
                        <button onClick={() => setSee({ ...see, pass: !see.pass })} type='button'>
                            {
                                see.pass ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye-off"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                )
                            }
                        </button>
                    </label>

                    <input type="submit" value="Login" className='btn btn-neutral mt-4' />
                </form >
            </div >
        </div>
    );
};

export default Login;