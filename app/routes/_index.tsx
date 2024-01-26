import type { ReactNode } from 'react';
import { Image } from '~/components/Image';

export default function Index() {
  return (
    <div className="relative">
      <Image
        className="h-screen w-full object-cover object-[50%_center] md:object-center"
        alt="Weddingfest '23"
        src="/image/official/2023/Kleine_Selectie/Tag-_@Momenttom.com_001_202308192023_TOM12106.jpg"
        srcSet="
          image/official/2023/Kleine_Selectie/Tag-_@Momenttom.com_001_202308192023_TOM12106.jpg?w=600  400w,
          image/official/2023/Kleine_Selectie/Tag-_@Momenttom.com_001_202308192023_TOM12106.jpg?w=800  800w,
          image/official/2023/Kleine_Selectie/Tag-_@Momenttom.com_001_202308192023_TOM12106.jpg?w=1200 1200w,
          image/official/2023/Kleine_Selectie/Tag-_@Momenttom.com_001_202308192023_TOM12106.jpg?w=1600 1600w,
          "
        sizes="
          (max-width: 400px) 400px,
          (max-width: 800px) 800px,
          (max-width: 1200px) 1200px,
          (max-width: 1600px) 1600px,
          (max-width: 3200px) 3200px,
          4800px"
      />

      <div className="absolute left-1/2 right-2.5 top-10 w-[90vw] -translate-x-1/2 bg-black/30 px-2 py-2.5 text-white md:w-96 lg:left-10 lg:w-[75vw] lg:-translate-x-0 xl:w-[40vw]">
        <Title>Bedankt dat je er was!</Title>
        <Subtitle>
          We hebben er een ongelooflijke dag van gemaakt met z'n allen en daar
          zijn we jullie ontzettend dankbaar voor.
        </Subtitle>
      </div>
    </div>
  );
}

const Title = ({ children }: { children: ReactNode }) => (
  <h1 className="mb-grow-x text-center font-handwriting text-hero">
    {children}
  </h1>
);

const Subtitle = ({ children }: { children: ReactNode }) => (
  <p className="text-center text-resp">{children}</p>
);

const Paragraph = ({ children }: { children: ReactNode }) => (
  <p className="text-center text-xl xl:text-4xl">{children}</p>
);
