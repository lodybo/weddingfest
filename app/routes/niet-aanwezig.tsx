import CenteredContentLayout from '~/layouts/CenteredContent';

export default function NotAttendingRoute() {
  return (
    <CenteredContentLayout>
      <h1 className="font-handwriting text-7xl">Jammer!</h1>

      <p className="text-2xl">
        Jammer dat je er niet bij bent, we zullen je missen! <br />
        Drinken we binnenkort een koffietje/cocktailtje/ander drankje?
      </p>
    </CenteredContentLayout>
  );
}
