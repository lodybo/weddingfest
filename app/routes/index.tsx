import PageLayout from '~/layouts/Page';
import SmallWeddingTimer from '~/components/SmallWeddingTimer';

export default function Index() {
  return (
    <PageLayout>
      <div className="mb-10 w-full px-8 sm:w-3/4">
        <h1 className="mb-grow-x text-center font-handwriting text-hero">
          Wij gaan trouwen!
        </h1>

        <p className="mb-10 text-center text-resp">
          Wij geven elkaar op <strong>27 augustus</strong> het ja-woord.
        </p>

        <SmallWeddingTimer />

        <div className="mt-10 mx-auto prose">
          <h2>Parkeersituatie</h2>

          <p>
            Op de uitnodiging hebben jullie het adres gekregen van de trouwlocatie, en de tijd waarop jullie aanwezig moeten zijn.
            Maar we willen je ook wijzen op de parkeer situatie.
          </p>

          <p>
            <em>
              Uit privacyoverwegingen vertellen we het adres van de trouwlocatie niet, je kan die namelijk op je uitnodiging vinden.
              <strong> We raden je aan de uitnodiging dan ook mee te nemen naar de bruiloft zodat je het adres bij je hebt.</strong>
            </em>
          </p>

          <p>
            Omdat de locatie zich in een woonwijk bevindt en er niet genoeg parkeerplek is, willen we je wijzen op een carpoolplaats.<br/>
            Hier kun je de auto stallen en te voet naar de trouwlocatie begeven.
          </p>

          <p>
            Om bij de carpoolplaats te komen kan je de navigatie instellen op: <strong>Carpoolplaats Oude rijksweg, Best</strong>.
            Je kan dan navigeren naar het adres van de trouwlocatie.
          </p>

          <iframe
            title="Navigatie naar Carpoolplaats Best"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4104.627467713046!2d5.410158877093778!3d51.507953560363376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c6dc45f1ae1cef%3A0xd584bdeb4379c18d!2sCarpoolplaats%20Oude%20rijksweg%20Best!5e0!3m2!1sen!2snl!4v1660337269068!5m2!1sen!2snl"
            width="100%" height="450" style={{ border: 0, }} allowFullScreen loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </PageLayout>
  );
}
