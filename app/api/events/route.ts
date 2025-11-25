
import { Event } from "@/database";
import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";


export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await req.formData();


const tagsRaw = formData.get("tags") as string || "";
const agendaRaw = formData.get("agenda") as string || "";

const tags = tagsRaw.split(",").map(tag => tag.trim()).filter(Boolean);
const agenda = agendaRaw.split(",").map(item => item.trim()).filter(Boolean);


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
    const createEvent = await Event.create({
      ...event,
      tags:tags,
      agenda:agenda

    });
    console.log(tags)
    console.log(agenda)

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





// // /app/api/events/route.ts
// import { Event } from "@/database";
// import { connectToDatabase } from "@/lib/mongodb";
// import { NextRequest, NextResponse } from "next/server";
// import { v2 as cloudinary } from "cloudinary";
// import slugify from "slugify";

// export async function POST(req: NextRequest) {
//   try {
//     await connectToDatabase();

//     const formData = await req.formData();

//     // ----- Extract and clean fields -----
//     const title = formData.get("title") as string;
//     const tagsRaw = (formData.get("tags") as string) || "";
//     const agendaRaw = (formData.get("agenda") as string) || "";

//     const tags = tagsRaw.split(",").map(t => t.trim()).filter(Boolean);
//     const agenda = agendaRaw.split(",").map(a => a.trim()).filter(Boolean);

//     if (!title) {
//       return NextResponse.json(
//         { error: "Title is required" },
//         { status: 400 }
//       );
//     }

//     // ----- Create slug -----
//     const slug = slugify(title, {
//       lower: true,
//       strict: true,
//       trim: true,
//     });

//     // ----- Image upload -----
//     let imageUrl = "";
//     const imageFile = formData.get("image") as File | null;

//     if (imageFile) {
//       const arrayBuffer = await imageFile.arrayBuffer();
//       const buffer = Buffer.from(arrayBuffer);

//       const uploadedImage = await new Promise((resolve, reject) => {
//         cloudinary.uploader
//           .upload_stream({ folder: "events" }, (error, result) => {
//             if (error) reject(error);
//             else resolve(result);
//           })
//           .end(buffer);
//       });

//       imageUrl = (uploadedImage as any).secure_url;
//     }

//     // ----- Convert formData to object -----
//     let eventObject: any = Object.fromEntries(formData.entries());

//     // Ensure image + slug overwrite raw formData
//     if (imageUrl) eventObject.image = imageUrl;
//     eventObject.slug = slug;

//     // ----- Save to DB -----
//     const createEvent = await Event.create({
//       ...eventObject,
//       tags,
//       agenda,
//     });

//     return NextResponse.json(
//       { message: "Event created successfully", event: createEvent },
//       { status: 201 }
//     );

//   } catch (error: any) {
//     return NextResponse.json(
//       {
//         message: "Failed to create event",
//         error: error.message || "Unknown error",
//       },
//       { status: 400 }
//     );
//   }
// }

// export async function GET() {
//   try {
//     await connectToDatabase();

//     const events = await Event.find().sort({ createdAt: -1 });

//     return NextResponse.json(
//       {
//         message: "Events fetched successfully",
//         events,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       {
//         message: "Failed to fetch events",
//         error,
//       },
//       { status: 500 }
//     );
//   }
// }
