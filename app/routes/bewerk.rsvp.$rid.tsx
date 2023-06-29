import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Link, useActionData, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';

import RSVPForm from '~/components/RSVPForm';

import PageLayout from '~/layouts/Page';

import { editRSVP, getRSVP } from '~/models/rsvp.server';
import Button from '~/components/Button';
import type { AttendanceResponse, RSVP } from '~/types/RSVP';
import {
  attendanceIsValid,
  attendeeIDIsValid,
  campingIsValid,
  nameIsValid,
  validateRSVP,
  VALIDATIONS,
} from '~/validations/validations';
import Anchor from '~/components/Anchor';
import type { RSVPValidationErrors } from '~/types/RSVP';
import { getSession, sessionStorage } from '~/session.server';
import { verifyAuthenticityToken } from 'remix-utils';

export const loader = async ({ params }: LoaderArgs) => {
  const id = params.rid;
  invariant(id !== undefined, 'ID needs to be set');

  const rsvp = await getRSVP(id);
  invariant(rsvp !== null, 'No RSVP found.');

  return json({ rsvp });
};

export async function action({ request }: ActionArgs) {
  const session = await getSession(request);
  await verifyAuthenticityToken(request, session);

  const body = await request.formData();
  const errors: RSVPValidationErrors = {};

  if (body.get('emailfield') !== '') {
    const entry: RSVP = {
      name: '',
      attendance: 'NONE',
      diet: '',
      camping: false,
      remarks: '',
    };
    return json<AttendanceResponse>(
      { success: true, ...entry },
      { status: 200 }
    );
  }

  const { name, attendee, attendance, camping, diet, remarks } =
    Object.fromEntries(body);

  const hasErrors = validateRSVP(
    name,
    attendance,
    camping,
    diet,
    remarks,
    attendee
  );
  console.log(hasErrors, Object.fromEntries(body));
  if (!hasErrors) {
    invariant(attendee !== undefined, 'Attendee needs to be set');
    invariant(typeof attendee === 'string', 'Attendee is of wrong type');
    invariant(nameIsValid(name), VALIDATIONS.MISSING_NAME);
    invariant(attendanceIsValid(attendance), VALIDATIONS.MISSING_ATTENDANCE);
    invariant(campingIsValid(camping), VALIDATIONS.MISSING_CAMPING);
    invariant(
      typeof diet === 'string' && typeof remarks === 'string',
      'Diet and remarks should be strings'
    );
    invariant(attendeeIDIsValid(attendee), VALIDATIONS.MISSING_ATTENDEE_ID);

    const entry: RSVP = {
      name,
      attendance,
      camping: camping === 'true',
      diet,
      remarks,
    };

    const rsvpPreEdit = await getRSVP(attendee);
    invariant(rsvpPreEdit !== null, 'No RSVP found to compare with.');

    const rsvp = await editRSVP(attendee, entry);

    if (!rsvpPreEdit.camping && entry.camping) {
      const session = await getSession(request);
      session.set('rsvpID', rsvp.id);
      return redirect('/tickets', {
        headers: {
          'Set-Cookie': await sessionStorage.commitSession(session),
        },
      });
    }

    return redirect('/account');
  } else {
    return json<AttendanceResponse>(
      {
        success: false,
        errors,
      },
      { status: 422 }
    );
  }
}

export default function EditRSVP() {
  const { rsvp } = useLoaderData<typeof loader>();
  let data = useActionData<typeof action>();

  return (
    <PageLayout>
      <div className="w-full px-8">
        {data?.success ? (
          <div className="flex flex-col items-center justify-center gap-5">
            <h1 className="mt-10 text-4xl">
              RSVP van <strong>{data.name}</strong> is bijgewerkt!
            </h1>

            <Link to="/admin">
              <Button variant="primary">Terug</Button>
            </Link>
          </div>
        ) : (
          <>
            <Anchor to="/account">Terug</Anchor>
            <RSVPForm response={data} rsvp={rsvp} mode="edit" />
          </>
        )}
      </div>
    </PageLayout>
  );
}