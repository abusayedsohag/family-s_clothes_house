import clientPromise from "@/lib/mongoDB";
import { NextResponse } from "next/server";

export async function GET(req,{params}) {
    try {
        const client = await clientPromise;
        const db = client.db("familys_clothes_house");
        const collection = db.collection("accounts-user")

        const { email } = await params;

        const finddata = await collection.findOne({ email })

        return NextResponse.json({ success: true, finddata })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something Error" })
    }
}