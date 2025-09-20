import {
  List,
  ListItem,
  IconButton,
  ListItemText,
  Divider,
  styled,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { removeTodo, setTodos } from "../store";
import React, { useEffect } from "react";

const RedDeleteButton = styled(IconButton)({
  color: "red",
  "&:focus": {
    outline: "none", // removes the black border
  },
});

export default function TodoList() {
  const todos = useSelector((state: RootState) => state.todos);
  const serverIP = useSelector((state: RootState) => state.server.ip);
  const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
    fetch(`http://${serverIP}:3000/todos`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch todos");
        return res.json();
      })
      .then((data) => {
        dispatch(setTodos(data));
      })
      .catch((err) => {
        console.error("Error fetching todos:", err);
      });
  }, [dispatch]);

  return (
    <>
      <List>
        {todos.map((todo, index) => (
          <React.Fragment
          key={index}>
            <ListItem
              secondaryAction={
                <RedDeleteButton
                  edge="end"
                  onClick={() =>
                    fetch(`http://${serverIP}:3000/todos/${index}`, {
                      method: "DELETE",
                    })
                      .then((res) => {
                        if (!res.ok) throw new Error("Failed to delete todo");
                        dispatch(removeTodo(index));
                      })
                      .catch((err) =>
                        console.error("Error deleting todo:", err)
                      )
                  }
                >
                  <DeleteIcon />
                </RedDeleteButton>
              }
            >
              <ListItemText primary={todo} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </>
  );
}
