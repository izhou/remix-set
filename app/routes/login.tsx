// login.tsx
import { useEffect, useState } from "react";
import { FormField } from "~/components/formField";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { useActionData, Link } from "@remix-run/react";
import { createUser, login } from "~/utils/auth.server";

type ActionData = {
  error?: string;
  fieldErrors?: {
    username: string | undefined;
    password: string | undefined;
  };
  fields?: {
    action: string;
    username: string;
    password: string;
  };
};

const badRequest = (data: ActionData) => {
  return json(data, { status: 400 });
};

function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("_action");
  const username = form.get("username");
  const password = form.get("password");

  // Data incomplete
  if (
    typeof action !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string"
  )
    return badRequest({ error: `Form not submitted correctly.` });

  const fields = { action, username, password };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  switch (action) {
    case "register": {
      return createUser({ username, password, request });
    }
    case "login":
      return login({ username, password, request });
    default: {
      // login to get the user
      return badRequest({
        fields,
        error: "Not implemented",
      });
    }
  }
};

export default function Login() {
  const actionData = useActionData();
  const [action, setAction] = useState("login");
  const [formData, setFormData] = useState({
    username: actionData?.fields?.username || "",
    password: actionData?.fields?.password || "",
  });

  const [errors, setErrors] = useState({
    username: actionData?.fieldErrors?.username || "",
    password: actionData?.fieldErrors?.password || "",
    form: actionData?.error || "",
  });

  // Updates the form data when an input changes
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
    setErrors((errors) => ({ ...errors, [field]: undefined, form: undefined }));
  };

  const handleActionChange = (action: string) => {
    setAction(action);
    setErrors({ ...errors, form: undefined });
  };

  return (
    <>
      <div className="grid-header-right"></div>
      <div className="grid-main-center">
        {/* Form Switcher Button */}

        <h1>{action === "login" ? "Sign In" : "Sign Up"}</h1>
        <form method="post" className="form">
          <FormField
            htmlFor="username"
            label="Username"
            value={formData.username}
            onChange={(e) => handleInputChange(e, "username")}
            error={errors?.username}
          />
          <FormField
            htmlFor="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={(e) => handleInputChange(e, "password")}
            error={errors?.password}
          />

          <button type="submit" name="_action" value={action}>
            {action === "login" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="form-error">&nbsp;{errors?.form || ""}</div>
        {action === "login" ? (
          <div>
            Don't have an account yet? &nbsp;
            <button onClick={() => handleActionChange("register")}>
              Create one
            </button>
          </div>
        ) : (
          <div>
            Already have an account? &nbsp;
            <button onClick={() => handleActionChange("login")}>Sign in</button>
          </div>
        )}
      </div>
      <div className="grid-footer-left">
        <Link to="/">{`< Home`}</Link>
      </div>
    </>
  );
}
