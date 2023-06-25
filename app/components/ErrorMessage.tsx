type Props = {
  message: string;
};

export default function ErrorMessage({ message }: Props) {
  return (
    <p className="mt-2.5 border-2 border-red-200 bg-red-100 px-4 py-2 text-red-500 xl:px-8 xl:py-4">
      {message}
    </p>
  );
}
