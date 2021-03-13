import React, { ReactNode } from 'react';

type PageLayoutProps = {
  children: ReactNode,
};

const PageLayout = ({ children }: PageLayoutProps) => (
  <div className="
    box-border
    font-sans
    px-10
    bg-white
    text-black
  ">
    { children }
  </div>
);

export default PageLayout;