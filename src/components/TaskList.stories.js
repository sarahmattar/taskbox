import React from 'react';

import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';

import TaskList from './TaskList';
import * as TaskStories from './Task.stories';

// create a mock of the state of the redux store
export const MockedState = {
	tasks: [
		{ ...TaskStories.Default.args.task, id: '1', title: 'Task 1' },
		{ ...TaskStories.Default.args.task, id: '2', title: 'Task 2' },
		{ ...TaskStories.Default.args.task, id: '3', title: 'Task 3' },
		{ ...TaskStories.Default.args.task, id: '4', title: 'Task 4' },
		{ ...TaskStories.Default.args.task, id: '5', title: 'Task 5' },
		{ ...TaskStories.Default.args.task, id: '6', title: 'Task 6' },
	],
	status: 'idle',
	error: null,
};

// create a mocked store for the story to use, with a slice
const MockStore = ({ taskboxState, children }) => (
	<Provider
		store={configureStore({
			reducer: {
				taskbox: createSlice({
					name: 'taskbox',
					initialState: taskboxState,
					reducers: {
						updateTaskState: (state, action) => {
							const { id, newTaskState } = action.payload;
							const task = state.tasks.findIndex(
								(task) => task.id === id
							);
							if (task >= 0) {
								state.tasks[task].state = newTaskState;
							}
						},
					},
				}).reducer,
			},
		})}
	>
		{children}
	</Provider>
);

export default {
	component: TaskList,
	title: 'TaskList',
	decorators: [(story) => <div style={{ padding: '3rem' }}>{story()}</div>],
	excludeStories: /.*MockedState$/, // this tells Storybook not to treat MockedState as a story.
};

const Template = (args) => <TaskList {...args} />;

export const Default = Template.bind({});
Default.decorators = [
	(story) => <MockStore taskboxState={MockedState}>{story()}</MockStore>,
];

export const WithPinnedTasks = Template.bind({});
WithPinnedTasks.decorators = [
	(story) => {
		// updating the state
		const pinnedTasks = [
			...MockedState.tasks.slice(0, 5),
			{ id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
		];
		return (
			<MockStore taskboxState={{ ...MockedState, tasks: pinnedTasks }}>
				{story()}
			</MockStore>
		);
	},
];

export const Loading = Template.bind({});
Loading.decorators = [
	(story) => (
		<MockStore taskboxState={{ ...MockedState, status: 'loading' }}>
			{story()}
		</MockStore>
	),
];

export const Empty = Template.bind({});
Empty.decorators = [
	(story) => (
		<MockStore taskboxState={{ ...MockedState, tasks: [] }}>
			{story()}
		</MockStore>
	),
];
