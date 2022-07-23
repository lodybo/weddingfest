import weddingCouple from '~/images/wedding-couple.jpg';

export default function Hero() {
  return (
    <img
      className="mb-10 h-[50vh] w-full object-cover object-center"
      src={weddingCouple}
      alt="wedding couple"
    />
  );
}
