import AdminNav from '@/Component/Admin/Navbar';
import Sidebar from '@/Component/Admin/Sidebar';
import React from 'react';

const Adminlayout = ({children}) => {
    return (
        <div className=''>
            <AdminNav />
            <div className='flex'>
                <Sidebar />
                {children}
            </div>
        </div>
    );
};

export default Adminlayout;