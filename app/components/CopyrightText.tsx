type Props = {
  stylizeWeddingfest?: boolean;
};

export default function CopyrighText({ stylizeWeddingfest }: Props) {
  const year = new Date().getFullYear();

  return (
    <span className="flex flex-row items-center justify-center gap-1">
      <span className="whitespace-nowrap">© 2022 - {year} </span>
      <span
        className={`${stylizeWeddingfest ? 'font-handwriting text-xl' : ''}`}
      >
        Weddingfest
      </span>
    </span>
  );
}
