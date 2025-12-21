"use client"
import Image from 'next/image';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ children }) => {

    const [drop, setDrop] = useState(false);

    const { logout } = useAuth();

    return (
        <div className="drawer drawer-open">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content w-full min-h-11/12 ">
                <div className='md:ml-2 md:mt-2 p-2 border-sky-300 border-t border-l rounded-tl-sm md:rounded-tl-lg bg-base-200 h-full '>
                    {children}
                </div>
            </div>

            <div className="drawer-side is-drawer-close:overflow-visible">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="is-drawer-close:w-14 is-drawer-open:w-full bg-base-200 flex flex-col items-start min-h-11/12">
                    <div className="menu w-full grow">
                        <ul>
                            <li>
                                <a href='/admin' data-tip="Homepage" className='border-b'>
                                    <Image
                                        src="/logo.png"
                                        alt='Family Group Logo'
                                        width={16}
                                        height={16}
                                    />
                                    <span className="is-drawer-close:hidden font-semibold">Family's Group</span>
                                </a>
                            </li>

                            <li>
                                <a href="/admin" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Dashboard">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block size-4 my-1.5"><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" /><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" /><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z" /><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z" /><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z" /><path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" /><path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z" /><path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z" /></svg>
                                    <span className="is-drawer-close:hidden">Dashboard</span>
                                </a>
                            </li>

                            <li>
                                <a href="/admin/banner" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Banner">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block size-4 my-1.5"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" /><line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" /><line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="17" x2="22" y2="17" /><line x1="17" y1="7" x2="22" y2="7" /></svg>
                                    <span className="is-drawer-close:hidden">Banner</span>
                                </a>
                            </li>

                            <li>
                                <a onClick={() => setDrop(!drop)} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Products">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block size-4 my-1.5"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
                                    <span className="is-drawer-close:hidden">Products</span>
                                </a>

                                {
                                    drop && (
                                        <ul className='m-0 p-0 is-drawer-open:mx-3'>
                                            <li className=''>
                                                <a href="/admin/products/add" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="+Add">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block size-4 my-1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                                                    <span className="is-drawer-close:hidden">+Add</span>
                                                </a>
                                            </li>
                                            <li className=''>
                                                <a href="/admin/products/list" className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Products List">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block size-4 my-1.5"><path xmlns="http://www.w3.org/2000/svg" d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" /></svg>
                                                    <span className="is-drawer-close:hidden">Products List</span>
                                                </a>
                                            </li>
                                        </ul>
                                    )
                                }
                            </li>

                            <li>
                                <a href='/admin/promo' className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Promo">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                                        <line x1="7" y1="7" x2="7.01" y2="7"></line>
                                    </svg>
                                    <span className="is-drawer-close:hidden">Promo</span>
                                </a>
                            </li>

                            <li>
                                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Settings">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="inline-block size-4 my-1.5"><path d="M20 7h-9"></path><path d="M14 17H5"></path><circle cx="17" cy="17" r="3"></circle><circle cx="7" cy="7" r="3"></circle></svg>
                                    <span className="is-drawer-close:hidden">Settings</span>
                                </button>
                            </li>
                        </ul>
                    </div>


                    <div className="m-2 is-drawer-close:tooltip is-drawer-close:tooltip-right">

                        <label htmlFor="my-drawer-4" className="btn btn-ghost btn-circle drawer-button is-drawer-open:rotate-y-180 hidden md:flex">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="inline-block size-4 my-1.5"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
                        </label>

                        <div className="menu w-full">

                            <a onClick={logout}>
                                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right p-1 flex items-center gap-2" data-tip="Log Out">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="inline-block size-4 my-1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                                    <span className="is-drawer-close:hidden">Logout</span>
                                </button>
                            </a>

                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default Sidebar;