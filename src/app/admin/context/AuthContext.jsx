"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from "firebase/auth";
import { adminAuth } from "../firebase/firebaseConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const signUp = async ({ image, name, email, password }) => {
        const createUser = await createUserWithEmailAndPassword(adminAuth, email, password)

        await updateProfile(createUser.user, {
            displayName: name,
            photoURL: image,
        })

        await signOut(adminAuth)

        return createUser.user
    }

    const signIn = (email, password) => {
        return signInWithEmailAndPassword(adminAuth, email, password)
    }


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(adminAuth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(adminAuth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, signUp, signIn }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
