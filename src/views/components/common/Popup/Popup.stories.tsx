import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Popup from './Popup';

const meta = {
    component: Popup,
} satisfies Meta<typeof Popup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <Popup {...args}>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada, odio molestie aliquam aliquam, nunc diam condimentum leo, quis bibendum erat metus nec tortor. Donec dignissim feugiat neque, a bibendum est varius eu. Nullam leo dolor, vestibulum vitae maximus ac, elementum sed eros. Vivamus justo arcu, gravida in nulla nec, congue elementum tellus. Aliquam facilisis interdum arcu et luctus. Maecenas ac ligula erat. In sagittis lacus at mauris iaculis placerat. Phasellus rhoncus varius magna vel pulvinar. Etiam fermentum vulputate nisi quis consectetur. Morbi quis leo vel odio aliquam porta. In vulputate rhoncus orci, at interdum sem pharetra quis. Praesent euismod sed mauris in rhoncus. Aliquam mauris est, pretium non ex lobortis, porta dapibus nunc. Donec non risus lacus.</p>
        </Popup>
    ),
    args: {
        overlay: false,
    },
};
