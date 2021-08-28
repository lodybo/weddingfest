import React from 'react';
import { graphql, PageProps } from 'gatsby';
import BlockContent from '@sanity/block-content-to-react';

const Page: React.FC<PageProps<GatsbyTypes.PageQuery, GatsbyTypes.SitePageContext>> = ({ data, pageContext }) => {
  const {
    pageData,
  } = data;

  let title = data.pageData.title.nl;
  let content = data.pageData.content[0].nl;

  if (pageContext.locale && pageContext.locale === 'en') {
    title = data.pageData.title.en;
    content = data.pageData.content[0].en;
  }

  return (
    <>
      <h1>{ title }</h1>
      <BlockContent blocks={ content } />
    </>
  );
};

export default Page;

export const query = graphql`
    query Page($slug: String!) {
        pageData: sanityPage(slug: { current: { eq: $slug }} ) {
            title: page_title {
                _key
                _type
                nl
                en
            }
            content {
                en: _rawEn
                nl: _rawNl
            }
        }
    }
`;