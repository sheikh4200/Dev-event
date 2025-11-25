import { Schema, model, models, Document, Model, Types } from 'mongoose';
import { Event } from './event.model';

/**
 * Core Booking attributes stored in the database.
 */
export interface BookingAttributes {
  eventId: Types.ObjectId;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Mongoose document type for Booking, including default document fields.
 */
export interface BookingDocument extends BookingAttributes, Document {}

export interface BookingModel extends Model<BookingDocument> {}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookingSchema = new Schema<BookingDocument, BookingModel>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true, // index for faster lookups by event
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string): boolean => emailRegex.test(value),
        message: 'Email must be a valid email address',
      },
    },
  },
  {
    timestamps: true,
    strict: 'throw',
  }
);

// Additional index on eventId to optimize queries that filter by event.
// BookingSchema.index({ eventId: 1 });

/**
 * Pre-save hook to:
 * - Ensure the referenced event exists.
 * - Validate email format defensively.
 */
BookingSchema.pre<BookingDocument>('save', async function preSave(next) {
  try {
    if (!Types.ObjectId.isValid(this.eventId)) {
      return next(new Error('Invalid eventId: must be a valid ObjectId'));
    }

    const eventExists = await Event.exists({ _id: this.eventId });
    if (!eventExists) {
      return next(new Error('Cannot create booking: referenced event does not exist'));
    }

    if (typeof this.email !== 'string' || this.email.trim().length === 0 || !emailRegex.test(this.email)) {
      return next(new Error('Email is required and must be a valid email address'));
    }

    return next();
  } catch (err) {
    return next(err as Error);
  }
});

export const Booking: BookingModel =
  (models.Booking as BookingModel) || model<BookingDocument, BookingModel>('Booking', BookingSchema);
