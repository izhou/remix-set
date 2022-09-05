// login.tsx
import { useState } from 'react'
import { FormField } from '~/components/formField'
import { ActionFunction, json, LoaderFunction, redirect } from '@remix-run/node'
// import { login, register, getUser } from '~/utils/auth.server'
import { useActionData } from '@remix-run/react'

type ActionData = {
  formError?: string;
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
}

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

export const action: ActionFunction = async({request}) => {

  const form = await request.formData();
  const action = form.get("action");
  const username = form.get("username");
  const password = form.get("password");

  // Data incomplete
  if (
    typeof action !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string"
  ) return badRequest({ formError: `Form not submitted correctly.`});

  const fields = {action, username, password};
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  }

  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  switch (action) {
    case "register": {
      // TODO: check against existing users, then create 
      return badRequest({
        fields,
        formError: "Not implemented",
      });
    }
    case "login":
    default: {
      // login to get the user
      // if there's no user, return the fields and a formError
      // if there is a user, create their session and redirect to /jokes
      return badRequest({
        fields,
        formError: "Not implemented",
      });
    }
  }
}

export default function Login() {
  const actionData = useActionData()
  const [action, setAction] = useState('login')
  const [formData, setFormData] = useState({
    username: actionData?.fields?.username || '',
    password: actionData?.fields?.password || '',
  })

  // Updates the form data when an input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setFormData(form => ({ ...form, [field]: event.target.value }))
  }

  return (
    <div>
      <div>
        {/* Form Switcher Button */}
        <button
          onClick={() => setAction(action == 'login' ? 'register' : 'login')}
        >{action === 'login' ? 'Sign Up' : 'Sign In'}</button>
        <h2>Remix-Set</h2>
        <p>{action === 'login' ? 'Sign in' : 'Sign up'} to save your progress!</p>
        <form method="POST">
          <FormField
            htmlFor="username"
            label="Username"
            value={formData.username}
            onChange={e => handleInputChange(e, 'username')}
          />
          <FormField
            htmlFor="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={e => handleInputChange(e, 'password')}
          />

            <button type="submit" name="_action" value={action}>
              { action === 'login' ? "Sign In" : "Sign Up" }
            </button>
        </form>
      </div>
    </div>
  )
}