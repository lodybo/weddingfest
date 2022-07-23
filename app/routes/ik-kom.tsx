import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import {
  VALIDATIONS,
  nameIsValid,
  attendanceIsValid,
  potluckIsValid,
} from '~/validations';
import invariant from 'tiny-invariant';
import Countdown from 'react-countdown';

import Navigation from '~/components/Navigation';
import NameField from '~/components/NameField';
import AttendanceField from '~/components/AttendanceField';
import PotluckField from '~/components/PotluckField';
import ErrorMessage from '~/components/ErrorMessage';
import CountdownTimer from '~/components/CountdownTimer';

import type {
  RSVP,
  AttendanceResponse,
  FailedAttendanceResponse,
} from '~/types/RSVP';

import weddingCouple from '~/images/wedding-couple.jpg';

export async function action({ request }: ActionArgs) {
  const body = await request.formData();
  const errors: Omit<FailedAttendanceResponse, 'success'> = {};

  const name = body.get('name');
  if (!nameIsValid(name)) {
    errors.name = VALIDATIONS.MISSING_NAME;
  }

  const attendance = body.get('attendance');
  if (!attendanceIsValid(attendance)) {
    errors.attendance = VALIDATIONS.MISSING_ATTENDANCE;
  }

  const potluck = body.get('potluck');
  if (!potluckIsValid(potluck)) {
    errors.potluck = VALIDATIONS.MISSING_POTLUCK;
  }

  if (Object.keys(errors).length) {
    return json<AttendanceResponse>(
      {
        success: false,
        ...errors,
      },
      { status: 422 }
    );
  }

  invariant(nameIsValid(name), VALIDATIONS.MISSING_NAME);
  invariant(attendanceIsValid(attendance), VALIDATIONS.MISSING_ATTENDANCE);
  invariant(potluckIsValid(potluck), VALIDATIONS.MISSING_POTLUCK);

  const entry: RSVP = {
    name,
    attendance: attendance === 'true',
    potluck: potluck.split(','),
  };

  return json<AttendanceResponse>({ success: true, ...entry }, { status: 200 });
}

export default function AttendancePage() {
  let data = useActionData<typeof action>();

  if (!data) {
    data = { success: true, name: '', attendance: true, potluck: [] };
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <Navigation />

      <img
        className="mb-10 h-[50vh] w-full object-cover object-center"
        src={weddingCouple}
        alt="wedding couple"
      />

      {data?.success ? (
        <div className="prose mb-10 max-w-none md:prose-lg">
          <h2>Dank je wel voor het opgeven van je aanwezigheid</h2>

          {data.attendance ? (
            <>
              <p>
                We hebben het genoteerd en kijken ernaar uit om met jou/jullie
                onze bruiloft te vieren. <br />
                Vergeet niet regelmatig op deze website terug te kijken voor
                belangrijke informatie.
              </p>

              <p className="text-center">
                We zien je graag op <strong>27 augustus</strong>!<br />
                Locatie: <strong>Krijgertje 42, Best</strong>
                <br />
                Tijd: <strong>14:00</strong>, de ceremonie begint om 16:00
              </p>

              <h3>
                Kan je niet wachten? Het zijn nog maar een paar nachtjes slapen!
              </h3>

              <Countdown
                date={new Date(2022, 7, 27, 16)}
                renderer={CountdownTimer}
              />
            </>
          ) : (
            <>
              <p>
                We vinden het jammer dat je er niet bij kan zijn, maar dat kan
                gebeuren.
              </p>

              <h3>
                <strong>Hé, psst...</strong>
              </h3>

              <p>
                Dit jaar vieren we de bruiloft op klein vanwege het nageslacht
                dat staat te popelen om geboren te worden. Maar wist je dat we
                volgend jaar de bruiloft groots willen vieren? Dat gaat gebeuren
                op <strong>19 augustus 2023</strong>.
              </p>

              <p>
                We hebben grootse plannen voor die dag, maar die houden we nog
                even geheim. Zet de datum maar alvast in je agenda want dit wil
                je niet missen!
              </p>
            </>
          )}
        </div>
      ) : (
        <>
          <p className="prose md:prose-lg">
            Wij gaan trouwen en willen graag weten of je erbij bent! <br />
            We vragen je daarom onderstaand formulier in te vullen voor ons.
          </p>

          <Form
            method="post"
            className="my-10 flex w-1/4 flex-1 flex-col items-center justify-center gap-5"
          >
            <div className="w-full">
              <NameField />
              {data?.name ? <ErrorMessage message={data.name} /> : null}
            </div>

            <AttendanceField />
            {data?.attendance ? (
              <ErrorMessage message={data.attendance} />
            ) : null}

            <PotluckField />
            {data?.potluck ? <ErrorMessage message={data.potluck} /> : null}

            <button className="bg-cyan-200 px-8 py-4 text-slate-800 transition hover:bg-cyan-400 hover:text-slate-50 focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset-2">
              Verzenden
            </button>
          </Form>
        </>
      )}
    </div>
  );
}
