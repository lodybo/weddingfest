import type { ReactNode } from 'react';
import { Image } from '~/components/Image';
import Button from '~/components/Button';
import Footer from '~/components/Footer';

export default function Index() {
  return (
    <>
      <div className="relative h-screen">
        <Image
          className="h-full w-full object-cover object-[50%_center] md:object-center"
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

        <div className="absolute left-1/2 right-2.5 top-10 w-[90vw] -translate-x-1/2 space-y-8 bg-black/50 px-2 py-2.5 text-white md:w-96 lg:left-10 lg:w-[75vw] lg:-translate-x-0 xl:w-[40vw]">
          <Title>Bedankt dat je er was!</Title>

          <Subtitle>
            We hebben er een ongelooflijke dag van gemaakt met z'n allen en daar
            zijn we jullie ontzettend dankbaar voor.
          </Subtitle>

          <Subtitle>
            Natuurlijk hebben we flink wat beeldmateriaal verzameld en dat
            willen we jullie niet onthouden.
          </Subtitle>
        </div>

        <div className="sticky bottom-5 left-auto mx-auto w-[75vw] -translate-x-0 sm:w-96 md:absolute md:bottom-20 md:left-1/2 md:mx-auto md:w-80 md:-translate-x-1/2 lg:bottom-5">
          <Button to="/gallerij">Ik wil alles zien!</Button>
        </div>
      </div>
      <Footer />
    </>
  );
}

const Title = ({ children }: { children: ReactNode }) => (
  <h1 className="mb-grow-x text-center font-handwriting text-hero leading-10 sm:leading-[0.8]">
    {children}
  </h1>
);

const Subtitle = ({ children }: { children: ReactNode }) => (
  <p className="text-center text-resp leading-tight">{children}</p>
);
