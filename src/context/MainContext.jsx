"use client"
import { auth } from "@/firebase/firebaseUser";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { createContext, useEffect, useState } from "react"

export const MainContext = createContext();
export function MainProvider({ children }) {

    const [reload, setReload] = useState(false);
    const [user, setUser] = useState(null);
    const [userdata, setUserData] = useState(null);
    const [loading, setLoading] = useState(false)


    const registerUser = async ({ email, password, name, image }) => {
        setLoading(true)
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);

            await updateProfile(res.user, {
                displayName: name,
                photoURL: image,
            });

            return { success: true, user: res.user, message: "User registered successfully" };
        } catch (error) {
            return { success: false, message: error.message, code: error.code };
        }
    }

    const signIn = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(auth);
    };


    useEffect(() => {
        if (!user) return;
        fetch(`/api/accounts/${user?.email}`)
            .then(res => res.json())
            .then(data => setUserData(data.finddata))
    }, [user, reload])


    const value = {
        reload,
        setReload,
        registerUser,
        user,
        signIn,
        loading,
        logout,
        userdata
    }

    return (
        <MainContext.Provider value={value}>
            {children}
        </MainContext.Provider>
    )
}