"use client"
import Spinner from '@/app/admin/Components/Spinner';
import { MainContext } from '@/context/MainContext';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import Swal from 'sweetalert2';

const Register = () => {

    const router = useRouter();

    const [img, setImg] = useState();
    const [imgLoad, setImgLoad] = useState(false);
    const [see, setSee] = useState({ pass: false, repass: false })

    const { registerUser, loading } = useContext(MainContext)

    const handleImgUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImgLoad(true)

        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);

        img.onload = async () => {
            const width = img.width;
            const height = img.height;

            if (width === height) {
                const formData = new FormData();
                formData.append('image', file)

                try {
                    const apiKey = "be11c4ec521ea545fa7a526e92d4ac66";
                    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                        method: "POST",
                        body: formData,
                    });

                    const data = await res.json();

                    if (data.success) {
                        const imageURL = data.data.url;
                        setImg(imageURL);
                    } else {
                        alert("Image upload failed!");
                    }
                } catch (err) {
                    alert("Error uploading image!");
                } finally {
                    setImgLoad(false);
                }
            } else {
                alert("size error")
                setImgLoad(false);
            }
        };
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;

        const image = img;
        const name = form.name.value;
        const email = form.email.value;
        const number = form.number.value;
        const password = form.password.value;
        const re_password = form.re_password.value;

        const data = { image, name, email, number, password }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (number.length !== 10) {
            return alert("Invalid Number")
        }

        if (!passwordRegex.test(password)) {
            return alert('Please Type a Strong Password')
        }

        if (password !== re_password) {
            return alert('Password Not Match')
        }

        try {
            const responding = await fetch(`/api/accounts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })

            const res = await responding.json()

            if (res.success) {
                const result = await registerUser({ email, password, name, image });

                if (result.user) {
                    Swal.fire({
                        title: "Registration Successful!",
                        icon: "success",
                        draggable: true
                    });
                    router.push("/")
                } else {
                    Swal.fire({
                        title: "Something Error!",
                        text: `${result.code}`,
                        icon: "warning",
                        draggable: true
                    });
                }

            } else {
                Swal.fire({
                    title: "Something Error!",
                    text: `${res.message}`,
                    icon: "warning",
                    draggable: true
                });
            }
        } catch (error) {
            alert("Something Error")
        }
    }


    return (
        <div className='flex min-h-screen justify-center items-center'>
            <div className='min-w-xs'>
                <form onSubmit={handleSubmit} className="fieldset bg-base-200 border-base-300 rounded-box border p-4 shadow-2xl shadow-sky-300">

                    <div className='flex justify-center items-center mb-4'>
                        <label className='border-3 w-36 h-36 border-gray-300 rounded-full flex justify-center items-center'>
                            {
                                imgLoad ? (
                                    <Spinner></Spinner>
                                ) : (

                                    img ? (
                                        <img
                                            src={img}
                                            alt="Adminmage"
                                            className='rounded-full'

                                        />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                    )
                                )
                            }
                            <input
                                type="file"
                                name="adminimg"
                                className='hidden'
                                onChange={handleImgUpload}
                            />
                        </label>
                    </div>

                    <label className="label">Full Name</label>
                    <input type="text" name='name' className="input" placeholder="Full Name" required />

                    <label className="label">Email</label>
                    <input type="email" name='email' className="input" placeholder="Email" required />

                    <label className="label">Phone Number</label>
                    <label className='input'>
                        <h1>+880</h1>
                        <input type="number" name='number' className="" placeholder="Phone Number" required />
                    </label>

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

                    <label className="label">Re-Password</label>
                    <label className='input'>
                        <input type={see.repass ? "text" : "password"} placeholder="Re-Password" name='re_password' required />
                        <button onClick={() => setSee({ ...see, repass: !see.repass })} type='button'>
                            {
                                see.repass ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye-off"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                )
                            }
                        </button>
                    </label>

                    <input type="submit" value="Register" className='btn btn-neutral mt-4' />
                </form >
            </div >
            {
                loading && (
                    <div className='p-10 absolute border bg-white top-1/2 left-1/2'>
                        <Spinner></Spinner>
                    </div>
                )
            }
        </div>
    );
};

export default Register;