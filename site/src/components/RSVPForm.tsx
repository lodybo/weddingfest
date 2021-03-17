import React, { ChangeEvent, FormEvent, PureComponent, ReactElement } from 'react';
import { Guest, Household } from '../models';
import RSVPGuest, { RSVPGuestChangeEvent } from './RSVPGuest';
import InputTextArea from './InputTextArea';
import InputText from './InputText';
import Alert, { ALERT_STATES } from './Alert';

type RSVPFormProps = {
  subject: string,
  household: Household,
};

enum FORM_STATE {
  NOT_SENT,
  SENDING,
  ERROR,
  SUCCESS,
}

type RSVPFormState = Omit<Household, 'id' | 'sanityID' | 'household'> & {
  formState: FORM_STATE,
};

// TODO: Clean this up please, so many utility types...
type Package = Omit<Household, 'sanityID' | 'household' | 'members'> & {
  members: PackageGuest[];
};
type PackageGuest = Omit<Guest, 'attendance' | 'camping'> & {
  attendance: boolean;
  camping: boolean;
};

class RSVPForm extends PureComponent<RSVPFormProps, RSVPFormState> {

  constructor(props) {
    super(props);

    const { household } = this.props;

    this.state = {
      address: household.address || '',
      telephone: household.telephone || '',
      email: household.email || '',
      members: household.members,
      formState: FORM_STATE.NOT_SENT,
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

    const {
      address,
      telephone,
      email,
      members,
    } = this.state;

    const requestPackage: Package = {
      id: sanityID,
      address,
      telephone,
      email,
      members: members.map(member => ({
        ...member,
        attendance: member.attendance === 'true',
        camping: member.camping === 'true',
      })),
    };

    console.log('=== Saving RSVP details...');
    this.setState({
      formState: FORM_STATE.SENDING,
    });
    fetch('/.netlify/functions/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPackage),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Data saved');
          this.setState({
            formState: FORM_STATE.SUCCESS,
          });
        } else {
          console.error('Saving data failed..');
          console.error(response.text());
          this.setState({
            formState: FORM_STATE.ERROR,
          });
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

    const {
      formState,
    } = this.state;

    let alertStatus : ALERT_STATES = ALERT_STATES.HIDDEN;
    let alertMessage: string = '';

    switch (formState) {
      case FORM_STATE.ERROR:
        alertStatus = ALERT_STATES.ERROR;
        alertMessage = `
          Er is iets fout gegaan met het versturen van je inschrijving.
          Probeer het nog een keer of mail de support afdeling: organisatie [at] weddingfest.nl
        `;
        break;

      case FORM_STATE.SUCCESS:
        alertStatus = ALERT_STATES.SUCCESS;
        alertMessage = `
          Je aanmelding is doorgegeven!
        `;
        break;

      case FORM_STATE.SENDING:
        alertStatus = ALERT_STATES.SUCCESS;
        alertMessage = `
          Je aanmelding wordt verstuurd...
        `;
        break;

      case FORM_STATE.NOT_SENT:
      default:
        alertStatus = ALERT_STATES.HIDDEN;
        alertMessage = '';
    }

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

        <Alert state={alertStatus} message={alertMessage} />
      </form>
    );
  }

}

export default RSVPForm;