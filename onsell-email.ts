import { Resend } from 'resend';

// npm install resend
// Set RESEND_API_KEY in your environment, and verify your sending domain
// (onsell.com.ng) in the Resend dashboard before this will deliver.
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_ADDRESS = 'OnSell <hello@onsell.com.ng>';

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// contact on the waitlist form can be a phone number or an email — only
// email addresses get a confirmation; phone numbers are skipped silently.
export async function sendWaitlistConfirmation(contact: string, name: string) {
  if (!isEmail(contact)) return;
  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: contact,
      subject: "You're on the OnSell waitlist",
      html: `
        <p>Hi ${name},</p>
        <p>Thanks for joining the OnSell waitlist. We'll email you the moment
        OnSell opens for buying and selling used items in Calabar and Uyo.</p>
        <p>— The OnSell team</p>
      `,
    });
  } catch (err) {
    console.error('Waitlist confirmation email failed:', err);
  }
}

// contact on the feedback form is optional — only send if one was given
// and it looks like an email address.
export async function sendFeedbackThanks(contact: string | undefined) {
  if (!contact || !isEmail(contact)) return;
  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: contact,
      subject: 'Thanks for your feedback on OnSell',
      html: `
        <p>Hi,</p>
        <p>Thanks for sharing your thoughts on OnSell — we read every
        message, and it's helping shape what we build.</p>
        <p>— The OnSell team</p>
      `,
    });
  } catch (err) {
    console.error('Feedback thank-you email failed:', err);
  }
}
