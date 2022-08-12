import { json } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import type { Rsvp } from '~/models/rsvp.server';
import { getRSVP } from '~/models/rsvp.server';

import AttendanceForm from '~/components/AttendanceForm';

import PageLayout from '~/layouts/Page';
import invariant from 'tiny-invariant';
import { useLoaderData } from '@remix-run/react';

type LoaderData = {
  rsvp: Omit<Rsvp, 'createdAt' | 'updatedAt'>;
};

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.rid;
  invariant(id !== undefined, 'ID needs to be set');

  const rsvp = await getRSVP(id);
  invariant(rsvp !== null, 'No RSVP found.');

  return json<LoaderData>({ rsvp });
}

export default function EditRSVP() {
  const { rsvp } = useLoaderData<LoaderData>();

  return (
    <PageLayout>
      <div className="w-full px-8">
        <AttendanceForm rsvp={rsvp} />
      </div>
    </PageLayout>
  );
}
