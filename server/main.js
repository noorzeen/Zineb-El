import express from "express";
import { readFile, writeFile } from "node:fs/promises";
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";

const app = express();
const PORT = process.env.PORT || 3000;
const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const tasksFile = path.join(currentDirectory, "data", "tasks.json");
const usersFile = path.join(currentDirectory, "data", "users.json");
const allowedPriorities = ["low", "medium", "high"];

// Sessions are stored in memory for this small university demonstration.
// A production application would use secure cookies and a persistent session store.
const sessions = new Map();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

async function writeJson(file, value) {
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

// Passwords are never stored as plain text. Each password has its own random salt.
function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

function passwordMatches(password, user) {
  const supplied = Buffer.from(hashPassword(password, user.passwordSalt).hash, "hex");
  const saved = Buffer.from(user.passwordHash, "hex");
  return supplied.length === saved.length && timingSafeEqual(supplied, saved);
}

// This middleware protects private routes and identifies the current student.
function requireUser(request, response, next) {
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  const userId = token ? sessions.get(token) : null;
  if (!userId) return response.status(401).json({ message: "Please log in to continue." });
  request.userId = userId;
  request.sessionToken = token;
  next();
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, course: user.course };
}

app.get("/api/health", (request, response) => {
  response.json({ status: "ok", message: "StudyBuddy server is running." });
});

// Register a new private student account.
app.post("/api/auth/register", async (request, response, next) => {
  try {
    const name = cleanText(request.body.name);
    const email = cleanText(request.body.email).toLowerCase();
    const password = cleanText(request.body.password);
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
      return response.status(400).json({ message: "Enter your name, a valid email and a password of at least 8 characters." });
    }

    const users = await readJson(usersFile);
    if (users.some((user) => user.email === email)) {
      return response.status(409).json({ message: "An account already exists for this email." });
    }

    const passwordData = hashPassword(password);
    const newUser = {
      id: randomUUID(), name, email, course: "Computing student",
      passwordSalt: passwordData.salt, passwordHash: passwordData.hash,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    await writeJson(usersFile, users);

    const token = randomBytes(32).toString("hex");
    sessions.set(token, newUser.id);
    response.status(201).json({ token, user: publicUser(newUser) });
  } catch (error) { next(error); }
});

// Check credentials and create a session token for later API requests.
app.post("/api/auth/login", async (request, response, next) => {
  try {
    const email = cleanText(request.body.email).toLowerCase();
    const password = cleanText(request.body.password);
    const users = await readJson(usersFile);
    const user = users.find((item) => item.email === email);
    if (!user || !passwordMatches(password, user)) {
      return response.status(401).json({ message: "The email or password is incorrect." });
    }

    const token = randomBytes(32).toString("hex");
    sessions.set(token, user.id);
    response.json({ token, user: publicUser(user) });
  } catch (error) { next(error); }
});

app.get("/api/auth/me", requireUser, async (request, response, next) => {
  try {
    const users = await readJson(usersFile);
    const user = users.find((item) => item.id === request.userId);
    if (!user) return response.status(401).json({ message: "Account not found." });
    response.json(publicUser(user));
  } catch (error) { next(error); }
});

app.post("/api/auth/logout", requireUser, (request, response) => {
  sessions.delete(request.sessionToken);
  response.status(204).send();
});

// Every task route is protected and returns only the logged-in student's data.
app.get("/api/tasks", requireUser, async (request, response, next) => {
  try {
    const tasks = await readJson(tasksFile);
    response.json(tasks.filter((task) => task.ownerId === request.userId));
  } catch (error) { next(error); }
});

app.post("/api/tasks", requireUser, async (request, response, next) => {
  try {
    const title = cleanText(request.body.title);
    const subject = cleanText(request.body.subject);
    const deadline = cleanText(request.body.deadline);
    const priority = cleanText(request.body.priority).toLowerCase();
    const notes = cleanText(request.body.notes);
    if (!title || !subject || !deadline || !allowedPriorities.includes(priority)) {
      return response.status(400).json({ message: "Please enter a title, subject, deadline and valid priority." });
    }
    if (Number.isNaN(new Date(`${deadline}T00:00:00`).getTime())) {
      return response.status(400).json({ message: "Please enter a valid deadline." });
    }

    const tasks = await readJson(tasksFile);
    const newTask = {
      id: randomUUID(), ownerId: request.userId, title, subject, deadline,
      priority, notes, completed: false, createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    await writeJson(tasksFile, tasks);
    response.status(201).json(newTask);
  } catch (error) { next(error); }
});

app.patch("/api/tasks/:id", requireUser, async (request, response, next) => {
  try {
    const tasks = await readJson(tasksFile);
    const task = tasks.find((item) => item.id === request.params.id && item.ownerId === request.userId);
    if (!task) return response.status(404).json({ message: "Task not found." });
    if (typeof request.body.completed !== "boolean") {
      return response.status(400).json({ message: "Completed must be true or false." });
    }
    task.completed = request.body.completed;
    await writeJson(tasksFile, tasks);
    response.json(task);
  } catch (error) { next(error); }
});

app.delete("/api/tasks/:id", requireUser, async (request, response, next) => {
  try {
    const tasks = await readJson(tasksFile);
    const task = tasks.find((item) => item.id === request.params.id && item.ownerId === request.userId);
    if (!task) return response.status(404).json({ message: "Task not found." });
    await writeJson(tasksFile, tasks.filter((item) => item.id !== task.id));
    response.status(204).send();
  } catch (error) { next(error); }
});

app.use((error, request, response, next) => {
  console.error(error);
  response.status(500).json({ message: "The server could not complete the request." });
});

app.listen(PORT, () => console.log(`StudyBuddy server is running on http://localhost:${PORT}`));
