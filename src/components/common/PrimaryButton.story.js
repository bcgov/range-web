import React from 'react';

import { storiesOf } from '@storybook/react';
import PrimaryButton from './PrimaryButton';

storiesOf('Priamry Button', module)
  .add('Default', () => <PrimaryButton />)

  .add('Inverted', () => <PrimaryButton inverted={true} />)

  .add('Inverted with children', () => (
    <PrimaryButton inverted={true}>Button</PrimaryButton>
  ))

  .add('With children', () => <PrimaryButton>Button</PrimaryButton>)
  .add('With long children', () => (
    <PrimaryButton>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vel
      venenatis purus, vitae viverra ex. Nulla ac nisl aliquam, eleifend neque
      vitae, feugiat magna. Nunc venenatis dui et odio pulvinar tincidunt. Nunc
      in maximus est, at faucibus elit. Fusce auctor aliquet orci eu viverra.
      Orci varius natoque penatibus et magnis dis parturient montes, nascetur
      ridiculus mus. Aenean cursus condimentum viverra. Nullam tempus sapien
      vulputate faucibus malesuada. Fusce aliquet purus nulla, a hendrerit arcu
      tristique a. Donec massa erat, commodo quis leo non, blandit egestas
      turpis. Proin tempor rhoncus orci, ac euismod lectus vulputate et.
      Suspendisse nisi nibh, tincidunt aliquam aliquet at, pellentesque et enim.
      Maecenas laoreet est eu urna volutpat, vitae cursus justo dignissim.
      Maecenas venenatis condimentum nunc a cursus.
    </PrimaryButton>
  ));
