type Props = {
  stylizeWeddingfest?: boolean;
};

export default function CopyrighText({ stylizeWeddingfest }: Props) {
  const year = new Date().getFullYear();

  return (
    <span>
      © 2022 - {year}{' '}
      <span
        className={`${stylizeWeddingfest ? 'font-handwriting text-xl' : ''}`}
      >
        Weddingfest
      </span>
    </span>
  );
}
