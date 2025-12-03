"use client";
import React from "react";

const AddCategory = ({ open, onClose, children }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-md">
            <div className="bg-white p-6 rounded-xl w-11/12 max-w-md relative shadow-xl">

                <button
                    onClick={onClose}
                    className="absolute right-4 top-3 text-2xl font-bold"
                >
                    ✕
                </button>

                {children}
            </div>
        </div>
    );
}

export default AddCategory;
