import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';

import Banner from './Banner';

const stories = storiesOf('Banner', module);
stories.addDecorator(withKnobs);
stories.add('Default', () => <Banner />);
stories.add('with props', () => <Banner header="header" content="some content" nonDefaultHeight={true} />);
stories.add('with long content', () => {
  const content =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vel venenatis purus, vitae viverra ex. Nulla ac nisl aliquam, eleifend neque vitae, feugiat magna. Nunc venenatis dui et odio pulvinar tincidunt. Nunc in maximus est, at faucibus elit. Fusce auctor aliquet orci eu viverra. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean cursus condimentum viverra. Nullam tempus sapien vulputate faucibus malesuada. Fusce aliquet purus nulla, a hendrerit arcu tristique a. Donec massa erat, commodo quis leo non, blandit egestas turpis. Proin tempor rhoncus orci, ac euismod lectus vulputate et. Suspendisse nisi nibh, tincidunt aliquam aliquet at, pellentesque et enim. Maecenas laoreet est eu urna volutpat, vitae cursus justo dignissim. Maecenas venenatis condimentum nunc a cursus.';
  return <Banner header="header" content={content} />;
});
stories.add('with knobs', () => <Banner header={text('Header', 'header')} content={text('Content', 'content')} />);
