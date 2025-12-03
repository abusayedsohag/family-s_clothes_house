import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import clientPromise from "@/lib/mongoDB";

export async function POST() {
    try {
        const client = await clientPromise;
        const db = client.db("familys_clothes_house");
        const collection = db.collection("shopping-carts");

        const guestId = "guest_" + uuidv4();

        if (!guestId) {
            return NextResponse.json(
                { success: false, message: "Guest ID generate failed!" },
                { status: 400 }
            );
        }

        const result = await collection.insertOne({
            guestId,
            items: [],
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return NextResponse.json({ success: true, guestId, data: result });
    } catch (error) {
        console.log("ERROR creating guest:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
