import { Schema, model, Document } from 'mongoose';

// -- Waitlist signups (from the "Join the waitlist" form) --

export interface IWaitlistEntry extends Document {
  name: string;
  contact: string;
  city: 'Calabar' | 'Uyo';
  intent: 'Buy' | 'Sell' | 'Both';
  createdAt: Date;
}

const WaitlistSchema = new Schema<IWaitlistEntry>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    contact: { type: String, required: true, trim: true, maxlength: 150 },
    city: { type: String, required: true, enum: ['Calabar', 'Uyo'] },
    intent: { type: String, required: true, enum: ['Buy', 'Sell', 'Both'] },
  },
  { timestamps: true }
);

export const WaitlistEntry = model<IWaitlistEntry>('WaitlistEntry', WaitlistSchema);

// -- Feedback messages (from the "Send feedback" form) --

export interface IFeedbackEntry extends Document {
  message: string;
  contact?: string;
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedbackEntry>(
  {
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    contact: { type: String, trim: true, maxlength: 150 },
  },
  { timestamps: true }
);

export const FeedbackEntry = model<IFeedbackEntry>('FeedbackEntry', FeedbackSchema);
