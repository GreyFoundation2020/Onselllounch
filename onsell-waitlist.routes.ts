import { Router, Request, Response } from 'express';
import { WaitlistEntry, FeedbackEntry } from './onsell-waitlist.models';
import { sendWaitlistConfirmation, sendFeedbackThanks } from './onsell-email';

const router = Router();

// POST /api/waitlist  — body: { name, contact, city, intent }
router.post('/waitlist', async (req: Request, res: Response) => {
  try {
    const { name, contact, city, intent } = req.body;
    if (!name || !contact || !city || !intent) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    const entry = await WaitlistEntry.create({ name, contact, city, intent });
    // fire-and-forget: a failed email never fails the signup itself
    sendWaitlistConfirmation(contact, name);
    return res.status(201).json({ id: entry._id });
  } catch (err) {
    console.error('Waitlist submission failed:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// POST /api/feedback  — body: { message, contact? }
router.post('/feedback', async (req: Request, res: Response) => {
  try {
    const { message, contact } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }
    const entry = await FeedbackEntry.create({ message, contact });
    sendFeedbackThanks(contact);
    return res.status(201).json({ id: entry._id });
  } catch (err) {
    console.error('Feedback submission failed:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

export default router;

/*
 * Mount this in your existing Express app, e.g. in app.ts / server.ts:
 *
 *   import cors from 'cors';
 *   import waitlistRouter from './onsell-waitlist.routes';
 *
 *   app.use(cors({ origin: 'https://www.onsell.com.ng' })); // your live domain
 *   app.use('/api', waitlistRouter);
 *
 * This gives you POST https://<your-api-host>/api/waitlist and /api/feedback.
 * The waitlist page's fetch calls need that same host — see API_BASE in the
 * page's <script>.
 */
