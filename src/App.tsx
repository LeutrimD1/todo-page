import './App.css'
import SearchBar from './components/SearchBar'
import { styled } from "@mui/material"
import { store, setServerIP } from "./store";
import { Provider } from "react-redux";
import TodoList from './components/List';
import { useState, useEffect } from 'react';

const Container = styled("div")({
  display: 'flex',
  flexDirection: 'column'
})

// Hardcoded encrypted value that contains the server IP
const ENCRYPTED_SERVER_CONFIG = ""; // Will be populated with encrypted IP address

// Temporary decryption function - accepts "test" passphrase
function decryptServerConfig(passphrase: string): string | null {
  if (passphrase === "test") {
    return "127.0.0.1"; // Temporary IP for testing
  }
  return null;
}

// Function to add server IP to Redux store
function addServerIPToStore(serverIP: string): void {
  store.dispatch(setServerIP(serverIP));
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const cookieName = "app_passphrase";
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith(cookieName + "="));

    if (cookieValue) {
      const passphrase = cookieValue.split("=")[1];
      
      // Attempt to decrypt server configuration
      const serverIP = decryptServerConfig(passphrase);
      
      if (serverIP) {
        addServerIPToStore(serverIP);
        setIsAuthenticated(true);
      } else {
        // Invalid passphrase - remove cookie and prompt again
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        promptForPassphrase();
      }
    } else {
      promptForPassphrase();
    }
  }, []);

  const promptForPassphrase = () => {
    const passphrase = window.prompt("Enter your access passphrase:");
    if (passphrase) {
      const serverIP = decryptServerConfig(passphrase);
      
      if (serverIP) {
        document.cookie = `app_passphrase=${passphrase}; path=/; max-age=${60*60*24*365}`; // 1 year
        addServerIPToStore(serverIP);
        setIsAuthenticated(true);
      } else {
        alert("Invalid passphrase. Please try again.");
        promptForPassphrase(); 
      }
    } else {
      alert("Passphrase is required to use the app.");
    }
  };

  if (!isAuthenticated) return null; 

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