import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';
import {
  VALIDATIONS,
  nameIsValid,
  attendanceIsValid,
  campingIsValid,
  validateRSVP,
} from '~/validations/validations';
import invariant from 'tiny-invariant';

import RSVPForm from '~/components/RSVPForm';

import PageLayout from '~/layouts/Page';

import { createRSVP, editRSVP, getRSVP } from '~/models/rsvp.server';

import type {
  RSVP,
  AttendanceResponse,
  FailedAttendanceResponse,
} from '~/types/RSVP';
import { verifyAuthenticityToken } from 'remix-utils';
import { getSession, sessionStorage } from '~/session.server';
import type { Rsvp } from '@prisma/client';

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request);
  const rsvpID = session.get('rsvpID');

  let rsvp: Rsvp | null = null;
  if (rsvpID) {
    rsvp = await getRSVP(rsvpID);
  }

  return json({ rsvp });
}

export async function action({ request }: ActionArgs) {
  const session = await getSession(request);
  await verifyAuthenticityToken(request, session);

  const body = await request.formData();

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

  const { attendee, name, attendance, camping, diet, remarks } =
    Object.fromEntries(body);

  const hasErrors = validateRSVP(name, attendance, camping, diet, remarks);

  if (!hasErrors) {
    invariant(nameIsValid(name), VALIDATIONS.MISSING_NAME);
    invariant(attendanceIsValid(attendance), VALIDATIONS.MISSING_ATTENDANCE);
    invariant(campingIsValid(camping), VALIDATIONS.MISSING_CAMPING);
    invariant(
      typeof diet === 'string' && typeof remarks === 'string',
      'Diet and remarks should be strings'
    );

    const entry: RSVP = {
      name,
      attendance,
      camping: camping === 'true',
      diet,
      remarks,
    };

    let headers = {};
    if (attendee && typeof attendee === 'string') {
      await editRSVP(attendee, entry);
    } else {
      const { id: rsvpID } = await createRSVP(entry);
      const session = await getSession(request);
      session.set('rsvpID', rsvpID);
      headers = {
        'Set-Cookie': await sessionStorage.commitSession(session),
      };
    }

    return redirect('/tickets', {
      headers,
    });
  } else {
    return json<AttendanceResponse>(
      {
        success: false,
        errors: hasErrors,
      },
      { status: 422 }
    );
  }
}

export default function AttendancePage() {
  const { rsvp } = useLoaderData<typeof loader>();
  let data = useActionData<FailedAttendanceResponse>();

  return (
    <PageLayout>
      <div className="w-full px-8">
        <p className="prose mx-auto md:prose-lg">
          Wij gaan trouwen en zouden het leuk vinden als je er bij bent! We
          vragen je daarom dit formulier in te vullen zodat wij weten of je komt
          en waar we rekening mee moeten houden.
        </p>

        <RSVPForm rsvp={rsvp} response={data} />
      </div>
    </PageLayout>
  );
}
