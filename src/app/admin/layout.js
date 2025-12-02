"use client"
import AdminNav from '@/Component/Admin/Navbar';
import Sidebar from '@/Component/Admin/Sidebar';
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AdminPrivate from '@/Component/Admin/AdminPrivate';

const Adminlayout = ({ children }) => {


    return (
        <div>
            <AuthProvider>
                <AdminPrivate>
                    <AdminNav />
                    <div className='flex'>
                        <Sidebar children={children} />
                    </div>
                </AdminPrivate>
            </AuthProvider>
        </div>
    );
};

export default Adminlayout;