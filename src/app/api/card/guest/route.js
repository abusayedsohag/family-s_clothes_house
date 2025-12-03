import clientPromise from "@/lib/mongoDB";
import { randomUUID } from "crypto";


export async function POST() {
    try {
        const client = await clientPromise;
        const db = client.db("familys_clothes_house");
        const collection = db.collection("shopping_card");

        const guestId = randomUUID()

        const body = await req.json();

        const existing = await collection.findOne({
            image: body.image,
        });


        if (existing) {
            return NextResponse.json({
                success: false,
                message: "Duplicate banner found!",
            });
        }

        const result = await collection.insertOne(body);

        return NextResponse.json({
            success: true,
            insertedId: result.insertedId
        });

    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}