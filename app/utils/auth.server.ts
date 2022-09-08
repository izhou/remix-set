import { redirect, json, createCookieSessionStorage } from "@remix-run/node";
import { db } from "./db.server";
import bcrypt from "bcryptjs";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

export type UserForm = {
  username: string
  password: string
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "remix-set-session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function createUser(user: UserForm) {
  const exists = await db.user.count({ where: { username: user.username } });
  if (exists) {
    return json(
      { error: `User already exists with that username` },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(user.password, 10);
  const newUser = await db.user.create({
    data: {
      username: user.username,
      password: passwordHash,
    },
  });

  if (!newUser) {
    return json(
      {
        error: `Something went wrong trying to create a new user.`,
        fields: { username: user.username, password: user.password },
      },
      { status: 400 }
    );
  }

  return createUserSession(newUser.id, "/");
}


// Validate the user on username & password
export async function login({ username, password }: UserForm) {
  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user) return json({ error: `User does not exist` }, { status: 400 });
  if (!(await bcrypt.compare(password, user.password))) return json({ error: `Incorrect login` }, { status: 400 });

  return createUserSession(user.id, "/");
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  try {
    const user = await db.user.findUnique({
      where: { id: userId }
    });

    return user;
  } catch {
    throw logout(request);
  }
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}