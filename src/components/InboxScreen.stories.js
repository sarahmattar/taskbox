import React from 'react';
import InboxScreen from './InboxScreen';
import store from '../lib/store';
import { rest } from 'msw';
import { MockedState } from './TaskList.stories';

import { Provider } from 'react-redux';

import {
	fireEvent,
	within,
	waitFor,
	waitForElementToBeRemoved,
} from '@storybook/testing-library';

export default {
	component: InboxScreen,
	title: 'InboxScreen',
	decorators: [(story) => <Provider store={store}>{story()}</Provider>],
};

const Template = () => <InboxScreen />;

export const Default = Template.bind({});

Default.parameters = {
	msw: {
		handlers: [
			rest.get(
				'https://jsonplaceholder.typicode.com/todos?userId=1',
				(req, res, ctx) => {
					//this fills the tasks array?
					return res(ctx.json(MockedState.tasks));
				}
			),
		],
	},
};

Default.play = async ({ canvasElement }) => {
	const canvas = within(canvasElement);
	await waitForElementToBeRemoved(await canvas.findByTestId('loading'));
	await waitFor(async () => {
		// simulate pinning the first task via aria-label attribute?
		await fireEvent.click(canvas.getByLabelText('pinTask-1'));
		//simulate pinning the third task
		await fireEvent.click(canvas.getByLabelText('pinTask-3'));
	});
};

export const Error = Template.bind({});

Error.parameters = {
	msw: {
		handlers: [
			rest.get(
				'https://jsonplaceholder.typicode.com/todos?userId=1',
				(req, res, ctx) => {
					console.log(ctx);
					//this handles errors accessin|g the typicode api
					return res(ctx.status(403));
				}
			),
		],
	},
};
