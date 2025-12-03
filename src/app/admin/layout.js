"use client"
import AdminNav from '@/app/admin/Components/Navbar';
import Sidebar from '@/app/admin/Components/Sidebar';
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AdminPrivate from '@/app/admin/Components/AdminPrivate';
import { usePathname } from 'next/navigation';

const Adminlayout = ({ children }) => {

    const path = usePathname()

    if (path === "/admin/login" || path === "/admin/register") {
        return <>{children}</>;
    }

    return (
        <AdminPrivate>
            <AdminNav />
            <div className='flex'>
                <Sidebar children={children} />
            </div>
        </AdminPrivate>
    );
};

export default function AdminMainLayout({ children }) {
    return (
        <AuthProvider>
            <Adminlayout>
                {children}
            </Adminlayout>
        </AuthProvider>
    )
}