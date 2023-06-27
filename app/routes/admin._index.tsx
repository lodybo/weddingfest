import AttendanceList from '~/components/AttendanceList';
import { json } from '@remix-run/node';
import { getRSVPs } from '~/models/rsvp.server';
import { useLoaderData } from '@remix-run/react';

export async function loader() {
  const rsvps = await getRSVPs();

  return json({ rsvps });
}

export default function AdminIndexRoute() {
  const { rsvps } = useLoaderData<typeof loader>();

  if (!rsvps) return null;

  return (
    <>
      <h1 className="mb-5 text-4xl">RSVP lijst</h1>
      <p>In totaal hebben {rsvps.length} mensen hun aanwezigheid opgegeven.</p>

      <AttendanceList rsvps={rsvps} />
    </>
  );
}
