import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Todo {
  id: number;
  todo: string;
}

const todosSlice = createSlice({
  name: "todos",
  initialState: [] as Todo[], 
  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => { 
      state.push(action.payload);
    },
    removeTodo: (state, action: PayloadAction<number>) => {  
      return state.filter(todo => todo.id !== action.payload); 
    },
    setTodos: (_: unknown, action: PayloadAction<Todo[]>) => { 
      return action.payload;
    },
  },
});

const serverSlice = createSlice({
  name: "server",
  initialState: {
    ip: null as string | null,
    isConfigured: false
  },
  reducers: {
    setServerIP: (state, action: PayloadAction<string>) => {
      state.ip = action.payload;
      state.isConfigured = true;
    },
    clearServerIP: (state) => {
      state.ip = null;
      state.isConfigured = false;
    }
  },
});

export const { addTodo, removeTodo, setTodos } = todosSlice.actions;
export const { setServerIP, clearServerIP } = serverSlice.actions;

export const store = configureStore({
  reducer: {
    todos: todosSlice.reducer,
    server: serverSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;