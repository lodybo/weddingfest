import React, { ReactNode } from 'react';
import { Helmet } from 'react-helmet';

type PageLayoutProps = {
  children: ReactNode,
};

const PageLayout = ({ children }: PageLayoutProps) => (
  <div className="
    box-border
    font-sans
    px-2
    md:px-10
    bg-white
    text-black
  ">
    <Helmet>
      <title>WEDDINGFEST 2022</title>
    </Helmet>

    { children }
  </div>
);

export default PageLayout;