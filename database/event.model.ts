import { Schema, model, models, Document, Model } from 'mongoose';

/**
 * Core Event attributes stored in the database.
 */
export interface EventAttributes {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // normalized to YYYY-MM-DD (ISO calendar date)
  time: string; // normalized to HH:mm (24h clock)
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Mongoose document type for Event, including default document fields.
 */
export interface EventDocument extends EventAttributes, Document {}

export interface EventModel extends Model<EventDocument> {}

/**
 * Helper to generate a URL-safe slug from a title.
 */
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove non-alphanumeric chars
    .replace(/\s+/g, '-') // collapse whitespace into dashes
    .replace(/-+/g, '-') // collapse multiple dashes
    .replace(/^-|-$/g, ''); // trim leading/trailing dashes
};

/**
 * Normalize date to ISO calendar date (YYYY-MM-DD).
 */
const normalizeDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date format for event');
  }
  return date.toISOString().split('T')[0];
};

/**
 * Normalize time to HH:mm (24-hour) format.
 */
const normalizeTime = (value: string): string => {
  const match = value.trim().match(/^(\d{1,2}):(\d{1,2})$/);
  if (!match) {
    throw new Error('Invalid time format for event (expected HH:mm)');
  }

  let hours = Number(match[1]);
  let minutes = Number(match[2]);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error('Time must be a valid 24-hour time');
  }

  const h = hours.toString().padStart(2, '0');
  const m = minutes.toString().padStart(2, '0');
  return `${h}:${m}`;
};

const EventSchema = new Schema<EventDocument, EventModel>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    overview: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    mode: {
      type: String,
      required: true,
      trim: true,
    },
    audience: {
      type: String,
      required: true,
      trim: true,
    },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]): boolean => value.length > 0,
        message: 'Agenda must contain at least one item',
      },
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]): boolean => value.length > 0,
        message: 'Tags must contain at least one value',
      },
    },
  },
  {
    timestamps: true, // automatically manage createdAt/updatedAt
    strict: 'throw', // reject fields that are not in the schema
  }
);

// Explicit unique index on slug to enforce uniqueness at the database level.

// EventSchema.index({ slug: 1 }, { unique: true });

/**
 * Pre-save hook to:
 * - Validate required string fields are non-empty.
 * - Normalize date and time.
 * - Generate or update the slug when the title changes.
 */
EventSchema.pre<EventDocument>('save', function preSave(next) {
  try {
    const requiredStringFields: (keyof EventAttributes)[] = [
      'title',
      'description',
      'overview',
      'image',
      'venue',
      'location',
      'date',
      'time',
      'mode',
      'audience',
      'organizer',
    ];

    for (const field of requiredStringFields) {
      const value = this[field];
      if (typeof value !== 'string' || value.trim().length === 0) {
        return next(new Error(`Field "${field}" is required and must be a non-empty string`));
      }
    }

    // Normalize date/time to consistent formats.
    this.date = normalizeDate(this.date);
    this.time = normalizeTime(this.time);

    // Only regenerate slug if the title has changed or slug is missing.
    if (this.isModified('title') || !this.slug) {
      this.slug = generateSlug(this.title);
    }

    return next();
  } catch (err) {
    return next(err as Error);
  }
});

export const Event: EventModel = (models.Event as EventModel) || model<EventDocument, EventModel>('Event', EventSchema);
