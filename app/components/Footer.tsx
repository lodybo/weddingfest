export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <div className="mt-auto flex h-20 w-full items-center  justify-center bg-white px-8 shadow-md">
      © 2022 - {year} Weddingfest
    </div>
  );
}
