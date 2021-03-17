import React, { ChangeEvent, FormEvent, PureComponent, ReactElement } from 'react';
import { Household } from '../models';
import RSVPGuest, { RSVPGuestChangeEvent } from './RSVPGuest';
import InputTextArea from './InputTextArea';
import InputText from './InputText';

type RSVPFormProps = {
  subject: string,
  household: Household,
};

type RSVPFormState = Omit<Household, 'id' | 'sanityID' | 'household'>;

class RSVPForm extends PureComponent<RSVPFormProps, RSVPFormState> {

  constructor(props) {
    super(props);

    const { household } = this.props;

    this.state = {
      address: household.address || '',
      telephone: household.telephone || '',
      email: household.email || '',
      members: household.members,
    };

    this.handleInputChanged = this.handleInputChanged.bind(this);
    this.handleMemberChanged = this.handleMemberChanged.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChanged(event: ChangeEvent<HTMLInputElement>) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    // @ts-ignore
    this.setState({
      [name]: value
    });
  }

  handleMemberChanged(event: RSVPGuestChangeEvent) {
    const updatedMembers = this.state.members.map(member => {
      if (member.id === event.id) {
        member = {
          ...member,
          [event.key]: event.value,
        };
      }

      return member;
    })

    this.setState({
      members: updatedMembers,
    });
  }

  handleSubmit(e: FormEvent) {
    e.preventDefault();

    const {
      household: { sanityID }
    } = this.props;

    console.log('=== Saving RSVP details...');
    fetch('/.netlify/functions/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: sanityID,
        ...this.state,
      }),
    })
      .then((response) => {
        const body = response.json();

        if (response.ok) {
          console.log('Data saved');
        } else {
          console.error('Saving data failed..');
          console.error(body);
        }
      })
      .catch(err => {
        console.error('Sending request failed..');
        console.error(err);
      })
  }

  render(): ReactElement {
    const {
      subject,
    } = this.props;

    return (
      <form className="text-lg pt-5" onSubmit={this.handleSubmit}>
        <label className="block py-2.5">
          <p>Wat is { subject } adres?</p>
          <InputTextArea
            name="address"
            value={this.state.address}
            changeHandler={this.handleInputChanged}
          />
        </label>

        <label className="block py-2.5">
          <p>En { subject } telefoonnummer?</p>
          <InputText
            name="telephone"
            value={this.state.telephone}
            changeHandler={this.handleInputChanged}
          />
        </label>

        <label className="block py-2.5">
          <p>En als laatste { subject } e-mailadres?</p>
          <InputText
            name="email"
            value={this.state.email}
            changeHandler={this.handleInputChanged}
          />
        </label>

        <ul className="p-10">
          {this.state.members.map(({
            id,
            name,
            attendance,
            remarks,
            camping,
          }) => (
            <li key={id}>
              <RSVPGuest
                id={id}
                name={name}
                attendance={attendance}
                remarks={remarks}
                camping={camping}
                changeHandler={this.handleMemberChanged}
              />
            </li>
          ))}
        </ul>

        <div className="flex justify-end">
          <button className="
            border
            border-primary-dark
            transition
            px-5
            py-2.5
            cursor-pointer
            bg-primary
            hover:bg-primary-dark
          ">Insturen!</button>
        </div>
      </form>
    );
  }

}

export default RSVPForm;