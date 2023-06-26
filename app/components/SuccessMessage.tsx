type Props = {
  message: string;
};

export default function SuccessMessage({ message }: Props) {
  return (
    <p className="mt-2.5 border-2 border-emerald-200 bg-emerald-100 px-4 py-2 text-emerald-500 xl:px-8 xl:py-4">
      {message}
    </p>
  );
}
