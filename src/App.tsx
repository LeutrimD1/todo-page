import './App.css'
import SearchBar from './components/SearchBar'
import { styled } from "@mui/material"
import { store } from "./store";
import { Provider } from "react-redux";
import TodoList from './components/List';
import { useState, useEffect } from 'react';

const Container = styled("div")({
  display: 'flex',
  flexDirection: 'column'
})

export default function App() {

    const [hasCookie, setHasCookie] = useState<boolean>(false);

  useEffect(() => {
    const cookieName = "myAppCookie";
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith(cookieName + "="));

    if (cookieValue) {
      setHasCookie(true);
    } else {
      // Prompt user to create cookie
      const value = window.prompt("Enter a value for your cookie:");
      if (value) {
        document.cookie = `${cookieName}=${value}; path=/; max-age=${60*60*24*365}`; // 1 year
        setHasCookie(true);
      } else {
        alert("Cookie is required to use the app.");
      }
    }
  }, []);

  if (!hasCookie) return null; // render nothing until cookie exists

  return (
    <>
    <Provider store={store}>
      <Container>
        <SearchBar/>
        <TodoList/>
      </Container>
    </Provider>
    </>
  );
} 