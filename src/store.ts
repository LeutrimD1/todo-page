import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";

const todosSlice = createSlice({
  name: "todos",
  initialState: [] as string[],
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.push(action.payload);
    },
    removeTodo: (state, action: PayloadAction<number>) => {
      state.splice(action.payload, 1);
    },
    setTodos: (_: unknown, action: PayloadAction<string[]>) => {
      return action.payload; // replace the whole state with the fetched todos
    },
  },
});

export const { addTodo, removeTodo, setTodos } = todosSlice.actions;

export const store = configureStore({
  reducer: {
    todos: todosSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
