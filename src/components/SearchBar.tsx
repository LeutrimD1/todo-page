import { useState } from "react";
import { TextField, Button, styled } from "@mui/material";
import { useDispatch } from "react-redux";
import { addTodo } from "../store";
import type { AppDispatch } from "../store";

const Container = styled("div")({
  display: "flex",
  gap: "1%",
});

export default function SearchBar() {
  const [value, setValue] = useState("");
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
            if (!value.trim()) return; // ignore empty input

            fetch("http://localhost:3000/todos", {
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
              .then(() => {
                dispatch(addTodo(value));
                setValue(""); // clear input
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
