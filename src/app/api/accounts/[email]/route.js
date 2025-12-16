import clientPromise from "@/lib/mongoDB";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
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

export async function PUT(req, { params }) {
    try {
        const client = await clientPromise;
        const db = client.db("familys_clothes_house")
        const collection = db.collection("accounts-user")

        const { email } = await params;
        const body = await req.json();
        const { gender } = body

        if (!email || !gender) {
            return NextResponse.json({ error: "Email or gender data missing in request body" }, { status: 400 });
        }

        const result = await collection.updateOne(
            { email: email },
            {
                $set: { gender: gender }
            }
        )

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: result,
            updatedCount: result.modifiedCount,
        });

    } catch (error) {
        console.error("Database Update Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}