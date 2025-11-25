// import { NextRequest, NextResponse } from 'next/server';
// import { connectToDatabase } from '@/lib/mongodb';
// import { Event, EventDocument } from '@/database';

// interface RouteParams {
//   params: {
//     slug: string;
//   };
// }

// /**
//  * GET /api/events/[slug]
//  * Fetch a single event by its slug.
//  */
// export async function GET(_request: NextRequest, context: RouteParams): Promise<NextResponse> {
//   try {
//     const { slug } = await (context.params);

//     // Basic validation of the dynamic route parameter.
//     if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
//       return NextResponse.json(
//         { error: 'Invalid or missing slug parameter' },
//         { status: 400 }
//       );
//     }

//     await connectToDatabase();

//     // Use lean() for better performance when we only need plain JSON data.
//     const event: EventDocument | null = await Event.findOne({ slug: slug.trim() }).lean<EventDocument | null>();

//     if (!event) {
//       return NextResponse.json(
//         { error: 'Event not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(event, { status: 200 });
//   } catch (error) {
//     // Log server-side only in real app (e.g., to an observability platform).
//     console.error('Error fetching event by slug:', error);

//     return NextResponse.json(
//       { error: 'An unexpected error occurred while fetching the event' },
//       { status: 500 }
//     );
//   }
// }



// /app/api/events/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Event } from "@/database";

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid slug" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const event = await Event.findOne({ slug }).lean();

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error fetching event" },
      { status: 500 }
    );
  }
}
