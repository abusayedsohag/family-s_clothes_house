import clientPromise from "@/lib/mongoDB";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const client = await clientPromise;
        const db = client.db("familys_clothes_house");
        const collection = db.collection("accounts-user");

        const data = await req.json();
        const { number, email } = data

        const existingNumber = await collection.findOne({ number })
        const existingGmail = await collection.findOne({ email })

        if (existingNumber) {
            return NextResponse.json({ success: false, message: "Number is existing" })
        }

        if (existingGmail) {
            return NextResponse.json({ success: false, message: "Gmail is existing" })
        }
        const res = await collection.insertOne(data)

        return NextResponse.json({ success: true, res })


    } catch (error) {
        console.error("🔥 API ERROR:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    try {
        const client = await clientPromise;
        const db = client.db("familys_clothes_house");
        const collection = db.collection("accounts-user")
        const finddata = await collection.find({}).toArray()

        return NextResponse.json({ success: true, finddata })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something Error" })
    }
}