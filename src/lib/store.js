import {
	configureStore,
	createSlice,
	createAsyncThunk,
} from '@reduxjs/toolkit';

const TaskBoxData = {
	tasks: [],
	status: 'idle',
	error: null,
};

// create async thunk to get tasks from remote endpoint
export const fetchTasks = createAsyncThunk('todos/fetchTodos', async () => {
	const response = await fetch(
		'https://jsonplaceholder.typicode.com/todos?userId=1'
	);

	const data = await response.json();
	const result = data.map((task) => ({
		id: `${task.id}`,
		title: task.title,
		state: task.completed ? 'TASK_ARCHIVED' : 'TASK_INBOX',
	}));

	return result;
});

const TasksSlice = createSlice({
	name: 'taskbox',
	initialState: TaskBoxData,
	reducers: {
		updateTaskState: (state, action) => {
			const { id, newTaskState } = action.payload;
			const task = state.tasks.findIndex((task) => task.id === id);
			if (task >= 0) {
				state.tasks[task].state = newTaskState;
			}
		},
	},
	// extends the fetchTasks reducer to handle asynchronous responses
	extraReducers(builder) {
		builder
			.addCase(fetchTasks.pending, (state) => {
				state.status = 'loading';
				state.error = null;
				state.tasks = [];
			})
			.addCase(fetchTasks.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.error = null;
				state.tasks = action.payload;
			})
			.addCase(fetchTasks.rejected, (state) => {
				state.status = 'failed';
				state.error = 'Something went wrong';
				state.tasks = [];
			});
	},
});

// The actions contained in the slice are exported for usage in our components
export const { updateTaskState } = TasksSlice.actions;

const store = configureStore({
	reducer: {
		taskbox: TasksSlice.reducer,
	},
});

export default store;
