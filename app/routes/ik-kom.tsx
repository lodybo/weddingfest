import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import {
  VALIDATIONS,
  nameIsValid,
  attendanceIsValid,
  guestsAreValid,
  guestTotalIsValid,
  campingIsValid,
  validateRSVP,
} from '~/validations/validations';
import invariant from 'tiny-invariant';

import SmallWeddingTimer from '~/components/SmallWeddingTimer';
import AttendanceForm from '~/components/AttendanceForm';

import PageLayout from '~/layouts/Page';

import { createRSVP } from '~/models/rsvp.server';

import type {
  RSVP,
  AttendanceResponse,
  RSVPValidationErrors,
} from '~/types/RSVP';

export async function action({ request }: ActionArgs) {
  const body = await request.formData();
  const errors: RSVPValidationErrors = {};

  if (body.get('emailfield') !== '') {
    const entry: RSVP = {
      name: '',
      attendance: false,
      diet: '',
      guests: 1,
      camping: false,
      remarks: '',
    };
    return json<AttendanceResponse>(
      { success: true, ...entry },
      { status: 200 }
    );
  }

  const { name, attendance, guests, camping, diet, remarks } =
    Object.fromEntries(body);

  const hasErrors = validateRSVP(
    name,
    attendance,
    guests,
    camping,
    diet,
    remarks
  );

  console.log(hasErrors);
  if (!hasErrors) {
    invariant(nameIsValid(name), VALIDATIONS.MISSING_NAME);
    invariant(attendanceIsValid(attendance), VALIDATIONS.MISSING_ATTENDANCE);
    invariant(guestsAreValid(guests), VALIDATIONS.MISSING_GUESTS);
    invariant(guestTotalIsValid(guests), VALIDATIONS.INCORRECT_GUEST_TOTAL);
    invariant(campingIsValid(camping), VALIDATIONS.MISSING_CAMPING);
    invariant(
      typeof diet === 'string' && typeof remarks === 'string',
      'Diet and remarks should be strings'
    );

    const entry: RSVP = {
      name,
      attendance: attendance === 'true',
      guests: parseInt(guests as string, 10),
      camping: camping === 'true',
      diet,
      remarks,
    };

    await createRSVP(entry);

    return json<AttendanceResponse>(
      { success: true, ...entry },
      { status: 200 }
    );
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
  let data = useActionData<typeof action>();

  return (
    <PageLayout>
      {data?.success ? (
        <div className="prose mb-10 w-3/4 max-w-none md:prose-lg md:w-1/2">
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

              <SmallWeddingTimer />
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
        <div className="w-full px-8">
          <p className="prose mx-auto md:prose-lg">
            Wij gaan trouwen en zouden het leuk vinden als je er bij bent! We
            vragen je daarom dit formulier in te vullen zodat wij weten of je
            komt en waar we rekening mee moeten houden.
          </p>

          <AttendanceForm response={data} />
        </div>
      )}
    </PageLayout>
  );
}
