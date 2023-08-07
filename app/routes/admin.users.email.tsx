import type { LoaderArgs } from '@remix-run/node';
import EmailAddressesField from '~/components/EmailAddressesField';
import SelectEmailAddressesDialog from '~/components/SelectEmailAddressesDialog';
import { requireAdmin } from '~/session.server';
import { getAllUsers } from '~/models/user.server';
import { json } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import TextField from '~/components/TextField';
import Editor from '~/components/Editor';
import Label from '~/components/Label';
import Button from '~/components/Button';
import TestEmailDialog from '~/components/TestEmailDialog';
import { getRecipients, sendMailToRecipients } from '~/models/mail.server';
import { getErrorMessage } from '~/utils/utils';
import { serverError } from 'remix-utils';
import ErrorMessage from '~/components/ErrorMessage';
import SuccessMessage from '~/components/SuccessMessage';

interface BaseActionData {
  success: boolean;
}

interface SuccessActionData extends BaseActionData {
  success: true;
  sendAsTest: boolean;
}

interface ErrorActionData extends BaseActionData {
  success: false;
  error: string;
}

type ActionData = SuccessActionData | ErrorActionData;

export async function loader({ request }: LoaderArgs) {
  await requireAdmin(request);

  const users = await getAllUsers({ includeRsvps: false });

  return json({ users });
}

export async function action({ request }: LoaderArgs) {
  await requireAdmin(request);

  const formData = await request.formData();
  const from = formData.get('from') as string;
  const subject = formData.get('subject') as string;
  const body = formData.get('body') as string;
  const sendMode = formData.get('send-mode') as string;

  const errors: string[] = [];
  if (!from) {
    errors.push('Geen afzender ingevuld');
  }

  if (!subject) {
    errors.push('Geen onderwerp ingevuld');
  }

  if (!body) {
    errors.push('Geen inhoud ingevuld');
  }

  if (errors.length > 0) {
    return json<ActionData>({
      success: false,
      error: `Er zijn ${errors.length} ${
        errors.length === 1 ? 'fout' : 'fouten'
      } gevonden: * ${errors.join(', ').toLowerCase()}. `,
    });
  }

  try {
    const recipients = await getRecipients(from);
    await sendMailToRecipients({
      recipients,
      subject,
      content: body,
      testMode: sendMode === 'test',
    });
  } catch (error) {
    return serverError<ActionData>({
      success: false,
      error: getErrorMessage(error),
    });
  }

  return json<ActionData>({ success: true, sendAsTest: sendMode === 'test' });
}

export default function AdminEmail() {
  const formRef = useRef<HTMLFormElement>(null);
  const fetcher = useFetcher();
  const { users } = useLoaderData<typeof loader>();
  const [recipients, setRecipients] = useState<string[]>([]);

  let actionData: ActionData | undefined;

  useEffect(() => {
    if (fetcher.data) {
      window.scrollTo(0, 0);
    }
  }, [fetcher]);

  if (fetcher.state === 'idle' && fetcher.data) {
    actionData = fetcher.data as ActionData;
  }

  const handleSelectAddresses = (recipients: string[]) => {
    setRecipients(recipients);
  };

  const handleSendTestEmail = (testRecipients: string) => {
    window.tinyMCE.triggerSave();
    const formData = new FormData(formRef.current!);
    formData.set('send-mode', 'test');
    formData.set('from', testRecipients);
    fetcher.submit(formData, { method: 'post' });
  };

  return (
    <div className="space-y-5">
      {actionData && actionData.success ? (
        <SuccessMessage
          message={
            actionData.sendAsTest
              ? 'Alle test e-mails zijn verzonden.'
              : 'Alle e-mails zijn verzonden.'
          }
        />
      ) : null}

      {actionData && !actionData.success ? (
        <ErrorMessage message={actionData.error} />
      ) : null}

      <h1 className="font-handwriting text-5xl">E-mail verzenden</h1>

      <fetcher.Form
        ref={formRef}
        id="email-form"
        className="space-y-10"
        method="post"
      >
        <div className="flex w-2/3 flex-row gap-2">
          <EmailAddressesField label="Aan" recipients={recipients} />
          <SelectEmailAddressesDialog
            users={users}
            selectedRecipientsCallback={handleSelectAddresses}
          />
        </div>

        <div className="w-2/3">
          <TextField name="subject" label="Onderwerp" />
        </div>

        <Label label="Bericht">
          <Editor name="body" />
        </Label>

        <div className="flex flex-row justify-end gap-2">
          <TestEmailDialog onSendHandler={handleSendTestEmail} />

          <Button name="send-mode" value="live" variant="primary" type="submit">
            E-mail versturen
          </Button>
        </div>
      </fetcher.Form>
    </div>
  );
}
