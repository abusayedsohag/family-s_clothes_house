export const runtime = "nodejs";

import clientPromise from "@/lib/mongoDB";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const client = await clientPromise;
        const db = client.db("familys_clothes_house");
        const collection = db.collection("category");

        const body = await req.json();

        const formattedCate = body.newCate.trim();
        const titleCaseCate = formattedCate.charAt(0).toUpperCase() + formattedCate.slice(1).toLowerCase();

        const existing = await collection.findOne({
            newCate: { $regex: `^${formattedCate}$`, $options: "i" }
        });


        if (existing) {
            return NextResponse.json({
                success: false,
                message: "Duplicate Category found!",
            });
        }

        const result = await collection.insertOne(
            {
                newCate: titleCaseCate
            }
        );

        return NextResponse.json({
            success: true,
            insertedId: result.insertedId
        });

    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("familys_clothes_house");
        const collection = db.collection("category");

        const data = await collection.find({}).toArray();

        return NextResponse.json({ success: true, category: data });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

