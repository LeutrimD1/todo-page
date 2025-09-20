import { createServer } from "http";
import { parse } from "url";

let todos = [];

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function sanitizeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

const server = createServer((req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, headers);
    return res.end();
  }

  const url = parse(req.url, true);

  if (url.pathname === "/todos" && req.method === "GET") {
    res.writeHead(200, headers);
    res.end(JSON.stringify(todos));
  } else if (url.pathname === "/todos" && req.method === "POST") {
    let body = "";
    let bodySize = 0;
    
    req.on("data", (chunk) => {
      bodySize += chunk.length;
      if (bodySize > 10000) {
        res.writeHead(413, headers);
        res.end(JSON.stringify({ error: "Payload too large" }));
        return;
      }
      body += chunk;
    });
    
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        if (!data.todo || typeof data.todo !== "string" || data.todo.length > 1000) {
          throw new Error();
        }
        const sanitizedTodo = sanitizeHtml(data.todo.trim());
        todos.push(sanitizedTodo);
        res.writeHead(201, headers);
        res.end(JSON.stringify({ success: true, todos }));
      } catch {
        res.writeHead(400, headers);
        res.end(JSON.stringify({ error: "Invalid todo" }));
      }
    });
  } else if (url.pathname?.startsWith("/todos/") && req.method === "DELETE") {
    const index = parseInt(url.pathname.split("/")[2], 10);
    if (isNaN(index) || index < 0 || index >= todos.length) {
      res.writeHead(400, headers);
      return res.end(JSON.stringify({ error: "Invalid index" }));
    }
    const removed = todos.splice(index, 1);
    res.writeHead(200, headers);
    res.end(JSON.stringify({ success: true, removed: removed[0], todos }));
  } else {
    res.writeHead(404, headers);
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(3000, () => {
  console.log("Todo server running at http://localhost:3000");
});