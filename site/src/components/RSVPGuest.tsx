import React, { PureComponent } from 'react';
import slugify from '@sindresorhus/slugify';
import InputToggle from './InputToggle';
import InputTextArea from './InputTextArea';
import { Guest } from '../models';

type Props = {
  changeHandler: (event: RSVPGuestChangeEvent) => void,
} & Omit<Guest, 'sanityID'>;

type GuestDetails = Omit<Guest, 'id' | 'sanityID'>;
type ValueOf<T> = T[keyof T];

export type RSVPGuestDetailsEvent = {
  key: keyof GuestDetails,
  value: ValueOf<GuestDetails>,
};

export type RSVPGuestChangeEvent = {
  id: string,
} & RSVPGuestDetailsEvent;

class RSVPGuest extends PureComponent<Props> {

  private readonly escapedName = slugify(this.props.name);

  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event: RSVPGuestDetailsEvent) {
    const {
      id,
      changeHandler,
    } = this.props;

    const {
      key,
      value,
    } = event;

    changeHandler({
      id,
      key,
      value,
    });
  }

  render() {
    const {
      name,
      attendance,
      camping,
      remarks,
    } = this.props;

    return (
      <div>
        <div className="flex justify-between">
          <p>{ name }</p>
          <InputToggle
            name={ `attendance-${ this.escapedName }` }
            isChecked={ attendance }
            captionWhenTrue="Ik ben erbij"
            captionWhenFalse="Ik kom niet"
            changeHandler={({ target }) => this.handleInputChange({
              key: 'attendance',
              value: (target as HTMLInputElement).value,
            })}
          />
        </div>

        <label className="text-base pt-5 block">
          <p>
            Heb je allergieën, of zijn er andere dingen waar we rekening mee moeten houden? <br/>
            <small>Een goeie mop of anecdote is natuurlijk ook altijd welkom, weet je hoeveel werk het is om dit
              allemaal bij te houden??</small>
          </p>

          <InputTextArea
            name={ `remarks-${ this.escapedName }` }
            value={ remarks || '' }
            changeHandler={({ target }) => this.handleInputChange({
              key: 'remarks',
              value: (target as HTMLInputElement).value,
            })}
            small
          />
        </label>

        <label className="pt-5 block">
          <p className="pb-2.5">We gaan niet vertellen wat we gaan doen, maar vind je het leuk om te kamperen?</p>
          <InputToggle
            name={ `camping-${ this.escapedName }` }
            isChecked={ camping }
            captionWhenTrue="Jazeker!"
            captionWhenFalse="Nah, dan sla ik deze over"
            changeHandler={({ target }) => this.handleInputChange({
              key: 'camping',
              value: (target as HTMLInputElement).value,
            })}
          />
        </label>
      </div>
    );
  }

};

export default RSVPGuest;