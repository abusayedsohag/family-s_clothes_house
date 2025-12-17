import clientPromise from "@/lib/mongoDB";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const client = await clientPromise;
        const db = client.db("familys_clothes_house");
        const collection = db.collection("promo");

        const body = await req.json()

        const result = await collection.insertOne(body)

        return NextResponse.json({ success: true, result }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 })
    }
}

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("familys_clothes_house");
        const collection = db.collection("promo");

        const result = await collection.find({}).toArray()

        return NextResponse.json({ success: true, result }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}