import React from 'react';
import slugify from '@sindresorhus/slugify';
import InputToggle from './InputToggle';
import InputTextArea from './InputTextArea';
import { Guest } from '../models';

const RSVPGuest = ({
  name,
  attendance,
  remarks,
  camping
}: Guest) => {
  const escapedName = slugify(name);

  return (
    <div>
      <div className="flex justify-between">
        <p>{ name }</p>
        <InputToggle
          name={ `attendance-${ escapedName }` }
          attendance={ attendance }
          captionWhenTrue="Ik ben erbij"
          captionWhenFalse="Ik kom niet"
        />
      </div>

      <label className="text-base pt-5 block">
        <p>
          Heb je allergieën, of zijn er andere dingen waar we rekening mee moeten houden? <br />
          <small>Een goeie mop of anecdote is natuurlijk ook altijd welkom, weet je hoeveel werk het is om dit allemaal bij te houden??</small>
        </p>

        <InputTextArea name={ `remarks-${ escapedName }` } value={ remarks || '' } small />
      </label>

      <label className="pt-5 block">
        <p className="pb-2.5">We gaan niet vertellen wat we gaan doen, maar vind je het leuk om te kamperen?</p>
        <InputToggle
          name={ `camping-${ escapedName }` }
          attendance={ camping }
          captionWhenTrue="Jazeker!"
          captionWhenFalse="Nah, dan sla ik deze over"
        />
      </label>
    </div>
  );

};

export default RSVPGuest;