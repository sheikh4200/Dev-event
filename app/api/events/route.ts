
import { Event } from "@/database";
import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";


export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await req.formData();

    // ---------- IMAGE UPLOAD ----------
    const imageFile = formData.get("image") as File | null;

    let imageUrl = "";

    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadedImage = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "events" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });

      imageUrl = (uploadedImage as any).secure_url;
    }

    // ---------- CREATE EVENT OBJECT ----------
    let event: any;
    try {
      event = Object.fromEntries(formData.entries());
      if (imageUrl) event.image = imageUrl; // save cloudinary image url
    } catch (error: any) {
      return NextResponse.json(
        {
          message: "invalid formate Json input",
          e: error.message,
        },
        { status: 401 }
      );
    }

    // ---------- SAVE TO DATABASE ----------
    const createEvent = await Event.create(event);

    return NextResponse.json(
      {
        message: "event is created successfully",
        event: createEvent,
      },
      {
        status: 201,
      }
    );
  } catch (e) {
    return NextResponse.json(
      {
        message: "failed to create events",
        error: e instanceof Error ? e.message : "unknown error",
      },
      { status: 400 }
    );
  }
}


export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: "successfully fetched events",
        event: events,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "failed to fetch the events",
        e: error,
      },
      { status: 500 }
    );
  }
}
