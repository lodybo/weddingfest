import React from 'react';
import PageLayout from '../components/PageLayout';
import Header from '../components/Header';
import { graphql } from 'gatsby';
import { Household } from '../models';
import RSVPForm from '../components/RSVPForm';

type RSVPPageProps = {
  data: {
    household: Household
  }
};

const RSVPPage = ({ data }: RSVPPageProps) => {
  const { household } = data;
  const multipleMembers = household.members.length === 1;
  const subject = multipleMembers ? 'je' : 'jullie';

  return (
    <PageLayout>
      <Header />

      <div className="
        p-10
        lg:p-20
      ">
        { multipleMembers ? (
          <h2 className="text-4xl pb-5">Ben je erbij?</h2>
        ) : (
          <h2 className="text-4xl pb-5">Zijn jullie erbij?</h2>
        )}

        <p>Om {subject} op de hoogte te houden over wat we van plan zijn, vragen we {subject} contactgegevens op te geven.</p>
        {multipleMembers ? (
          <p>Het is helemaal prima om de gegevens van meer dan 1 persoon in te vullen, mocht dat handig uitkomen voor jullie.</p>
        ) : null}

        <RSVPForm
          subject={subject}
          household={household}
        />
      </div>
    </PageLayout>
  );
};

export default RSVPPage;

export const query = graphql`
  query($householdID: String!) {
    household: sanityRsvp(_id: { eq: $householdID } ) {
      id
      sanityID: _id
      household
      address
      email
      telephone
      members {
        id
        sanityID: _id
        name
        attendance
        remarks
      }
    }
  }
`;