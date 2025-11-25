"use server";

import { Event } from "@/database/event.model";
import { connectToDatabase } from "../mongodb";

export const fetchTheSameEvent = async (slug: string) => {
  try {
    await connectToDatabase();

    const event = await Event.findOne({ slug });
    if (!event) return [];

    const tags = event.tags || [];

    const sameEvents = await Event.find({
      _id: { $ne: event._id },
      tags: { $in: tags },
    });

    // Convert documents to plain objects with string _id
    return sameEvents.map(ev => ({
      ...ev.toObject(),
      _id: ev._id.toString(),
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
};
