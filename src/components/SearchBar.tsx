import { useState } from "react";
import { TextField, Button, styled } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addTodo } from "../store";
import type { AppDispatch, RootState } from "../store";

const Container = styled("div")({
  display: "flex",
  gap: "1%",
});

export default function SearchBar() {
  const [value, setValue] = useState("");
  const serverIP = useSelector((state: RootState) => state.server.ip);
  const dispatch = useDispatch<AppDispatch>();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Container>
        <TextField
          label="Todo Item"
          variant="outlined"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          onClick={() => {
            if (!value.trim()) return; 
            if (!serverIP) {
              console.error("Server IP not configured");
              return;
            }

            fetch(`https://${serverIP}/todos`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ todo: value }),
            })
              .then((res) => {
                if (!res.ok) throw new Error("Failed to add todo");
                return res.json();
              })
              .then((data) => {  
                dispatch(addTodo({ id: data.id, todo: value }));
                setValue(""); 
              })
              .catch((err) => console.error(err));
          }}
        >
          Save
        </Button>
      </Container>
    </form>
  );
}