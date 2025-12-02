"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/app/admin/context/AuthContext";
import Spinner from "./Spinner";

const AdminPrivate = ({ children }) => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) router.push("/admin/login");
    }, [user, router]);

    // if (!user) return <Spinner></Spinner>;

    return children;
}

export default AdminPrivate;
