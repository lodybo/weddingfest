import sgMail from '@sendgrid/mail';
import { getAllUsers } from '~/models/user.server';
import * as Sentry from '@sentry/node';

export type Recipient = {
  name?: string;
  email: string;
};

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const from = {
  name: 'Weddingfest',
  email: 'organisatie@weddingfest.nl',
};

export function sendMail(to: string, subject: string, html: string) {
  return sgMail
    .send({
      to,
      from,
      subject,
      html,
    })
    .then((res) => {
      Sentry.captureMessage(`Mail sent to ${to}`);
      return res;
    })
    .catch((err) => {
      Sentry.captureException(err);
      throw err;
    });
}

export function sendMailToRecipients({
  recipients,
  subject,
  content,
  testMode,
}: {
  recipients: Recipient[];
  subject: string;
  content: string;
  testMode: boolean;
}) {
  let emails: sgMail.MailDataRequired[] = [];
  recipients.forEach((recipient) => {
    let html: string;

    if (testMode) {
      html = `
        ${content}
        <p style="color: orange; margin-top: 16px; border: 1px solid orange">
          Dit is een testmail voor ${recipient.name} (${recipient.email})
        </p>
      `;
    } else {
      html = content;
    }

    emails.push({
      to: {
        name: recipient.name,
        email: recipient.email,
      },
      from,
      subject,
      html,
    });
  });

  return sgMail
    .send(emails)
    .then((res) => {
      console.log(`Mails sent to ${recipients.map((r) => r.email).join(', ')}`);
      Sentry.captureMessage(
        `Mails sent to ${recipients.map((r) => r.email).join(', ')}`
      );
      return res;
    })
    .catch((err) => {
      console.log('err', err);
      Sentry.captureException(err);
      throw err;
    });
}

export function separateRecipients(recipients: string): string[] {
  return recipients.split(/[,;]/).map((recipient) => recipient.trim());
}

export async function getRecipients(from: string): Promise<Recipient[]> {
  const addresses = separateRecipients(from);
  const users = await getAllUsers({ includeRsvps: false });
  const recipients: Recipient[] = [];

  addresses.forEach((address) => {
    const user = users.find((user) => user.email === address);
    if (user) {
      recipients.push({
        name: user.name,
        email: user.email,
      });
    } else {
      recipients.push({
        email: address,
      });
    }
  });

  return recipients;
}
