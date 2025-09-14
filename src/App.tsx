import './App.css'
import SearchBar from './components/SearchBar'
import { styled } from "@mui/material"
import { store, setServerIP } from "./store";
import { Provider } from "react-redux";
import TodoList from './components/List';
import { useState, useEffect, useRef } from 'react';

const Container = styled("div")({
  display: 'flex',
  flexDirection: 'column'
})

const ENCRYPTED_SERVER_CONFIG = "Yyj6XEkiyFsisJh+oAxFMybkjBIZ/b4bJiWkUImCml0="; 

async function decryptServerConfig(passphrase: string): Promise<string | null> {
  try {
    const encoder = new TextEncoder();
    const passphraseBuffer = encoder.encode(passphrase);
    const keyMaterial = await crypto.subtle.digest('SHA-256', passphraseBuffer);
    
    const key = await crypto.subtle.importKey(
      'raw',
      keyMaterial,
      { name: 'AES-CBC' },
      false,
      ['decrypt']
    );
    
    const combined = Uint8Array.from(atob(ENCRYPTED_SERVER_CONFIG), c => c.charCodeAt(0));
    
    const iv = combined.slice(0, 16);
    const encryptedData = combined.slice(16);
    
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-CBC',
        iv: iv
      },
      key,
      encryptedData
    );
    
    const decoder = new TextDecoder();
    const decrypted = decoder.decode(decryptedBuffer);
    
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
}

function addServerIPToStore(serverIP: string): void {
  store.dispatch(setServerIP(serverIP));
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const hasInitialized = useRef<boolean>(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const checkAuth = async () => {
      const cookieName = "app_passphrase";
      const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith(cookieName + "="));

      if (cookieValue) {
        const passphrase = cookieValue.split("=")[1];
        
        const serverIP = await decryptServerConfig(passphrase);
        
        if (serverIP) {
          addServerIPToStore(serverIP);
          setIsAuthenticated(true);
        } else {
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
          await promptForPassphrase();
        }
      } else {
        await promptForPassphrase();
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const promptForPassphrase = async (): Promise<void> => {
    while (true) {
      const passphrase = window.prompt("Enter your access passphrase:");
      
      if (!passphrase) {
        alert("Passphrase is required to use the app.");
        continue;
      }
      
      const serverIP = await decryptServerConfig(passphrase);
      
      if (serverIP) {
        document.cookie = `app_passphrase=${passphrase}; path=/; max-age=${60*60*24*365}`;
        addServerIPToStore(serverIP);
        setIsAuthenticated(true);
        break;
      } else {
        alert("Invalid passphrase. Please try again.");
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
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