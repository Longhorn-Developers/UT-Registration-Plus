/* eslint-disable jsdoc/require-jsdoc */
import React from 'react';
import ScheduleListItem from 'src/views/components/common/ScheduleListItem/ScheduleListItem';

export default {
    title: 'Components/Common/ScheduleListItem',
    component: ScheduleListItem,
    parameters: {
        layout: 'centered',
        tags: ['autodocs'],
    },
    argTypes: {
        active: { control: 'boolean' },
        name: { control: 'text' },
    },
};

export const Default = args => <ScheduleListItem {...args} />;

Default.args = {
    name: 'My Schedule',
    active: true,
};

export const Active = args => <ScheduleListItem {...args} />;

Active.args = {
    name: 'My Schedule',
    active: true,
};

export const Inactive = args => <ScheduleListItem {...args} />;

Inactive.args = {
    name: 'My Schedule',
    active: false,
};
