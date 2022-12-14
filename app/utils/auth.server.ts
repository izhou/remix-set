import { redirect, json, createCookieSessionStorage } from "@remix-run/node";
import { getSession, commitSession, destroySession } from "~/sessions";
import { db } from "./db.server";
import bcrypt from "bcryptjs";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

export type UserForm = {
  username: string;
  password: string;
  request: Request;
};

async function createUserSession(
  userId: string,
  redirectTo: string,
  request: Request
) {
  const session = await getSession(request.headers.get("Cookie"));
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

function getUserSession(request: Request) {
  return getSession(request.headers.get("Cookie"));
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

  return createUserSession(newUser.id, "/", user.request);
}

// Validate the user on username & password
export async function login({ username, password, request }: UserForm) {
  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user) return json({ error: `User does not exist` }, { status: 400 });
  if (!(await bcrypt.compare(password, user.password)))
    return json({ error: `Incorrect login` }, { status: 400 });

  return createUserSession(user.id, "/", request);
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
      where: { id: userId },
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
      "Set-Cookie": await destroySession(session),
    },
  });
}
