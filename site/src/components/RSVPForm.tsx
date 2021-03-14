import React, { PureComponent, ReactElement } from 'react';
import { Household } from '../models';
import RSVPGuest from './RSVPGuest';
import InputTextArea from './InputTextArea';
import InputText from './InputText';

type RSVPFormProps = {
  subject: string,
  household: Household,
};

class RSVPForm extends PureComponent<RSVPFormProps> {

  render(): ReactElement {
    const {
      subject,
      household,
    } = this.props;

    return (
      <form className="text-lg pt-5">
        <label className="block py-2.5">
          <p>Wat is { subject } adres?</p>
          <InputTextArea name="name" value={household.address || ''} />
        </label>

        <label className="block py-2.5">
          <p>En { subject } telefoonnummer?</p>
          <InputText name="telephone" value={household.telephone || ''} />
        </label>

        <label className="block py-2.5">
          <p>En als laatste { subject } e-mailadres?</p>
          <InputText name="emailaddress" value={household.email || ''} />
        </label>

        <ul className="p-10">
          {household.members.map(({
            id,
            name,
            attendance,
            remarks,
            camping,
          }) => (
            <li>
              <RSVPGuest
                key={id}
                id={id}
                name={name}
                attendance={attendance}
                remarks={remarks}
                camping={camping}
              />
            </li>
          ))}
        </ul>
      </form>
    );
  }

}

export default RSVPForm;