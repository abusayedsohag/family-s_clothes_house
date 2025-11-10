"use client";

// import Swal from 'sweetalert2';
import Link from 'next/link';
import Image from 'next/image';
// import { useAuth } from '@/context/AuthContext';
// import { useEffect, useRef, useState } from 'react';

const Navbar = () => {

    // const { user, logout }

    const links =
        <>
            <li><Link href={'/'}>Home</Link></li>
            {/* {
                user &&
                <li>
                    <Link href={'/admin'} >
                        Dashboard
                    </Link>
                </li>
            } */}
            <li><Link href={'/booklist'}>Booklist</Link></li>
            <li><Link href={'/result/institutes'}>Institute</Link></li>
        </>


    // const handleSignOut = () => {
    //     logout()
    //         .then(res => {
    //             Swal.fire({
    //                 position: "center",
    //                 icon: "success",
    //                 title: "Successfully Sign Out",
    //                 showConfirmButton: false,
    //                 timer: 1500
    //             });
    //         })
    //         .catch(error => {
    //             alert('Something Error')
    //         })
    // }

    return (
        <div className=''>
            <div className="navbar bg-base-100 shadow-sm">
                <div className="navbar-start">
                    <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                    <div className="flex flex-col">
                        <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-6 w-6 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                ></path>
                            </svg>
                        </label>
                    </div>
                    <div className="drawer-side">
                        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                        <div className="menu bg-base-200 min-h-full p-3">
                            {/* Sidebar content here */}
                            <h1 className='border-b text-center text-lg font-semibold'>Categories</h1>
                            <li><a>Sidebar Item 1</a></li>
                            <li><a>Sidebar Item 2</a></li>
                        </div>
                    </div>
                </div>
                <div className="navbar-center flex">
                    <Image
                        src="/logo.png"
                        alt="Family's Group Logo"
                        width={1072}
                        height={1012}
                        style={{ width: '38px', height: 'auto' }}
                    />
                    <a className="btn hidden  md:flex btn-ghost text-xl">Family's Clothes House</a>
                </div>
                <div className="navbar-end">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                            <div className="indicator">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /> </svg>
                                <span className="badge badge-xs indicator-item">8</span>
                            </div>
                        </div>
                        <div
                            tabIndex={0}
                            className="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow">
                            <div className="card-body">
                                <span className="text-lg font-bold">8 Items</span>
                                <span className="text-info">Subtotal: $999</span>
                                <div className="card-actions">
                                    <button className="btn btn-primary btn-block">View cart</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 flex justify-center items-center rounded-full">
                                <i className="fa-solid fa-circle-user fa-2x"></i>
                            </div>
                        </div>
                        <ul
                            tabIndex="-1"
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li>
                                <a className="justify-between">
                                    Profile
                                    <span className="badge">New</span>
                                </a>
                            </li>
                            <li><a>Settings</a></li>
                            <li><a>Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;