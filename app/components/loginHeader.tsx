import { Link } from "@remix-run/react";

type LoginHeaderProps = {
  username?: string;
};

export function LoginHeader(props: LoginHeaderProps) {
  return (
    <div className="grid-header-right login">
      {props.username ? (
        <>
          <div>
            Hello <strong>{props.username}</strong>
          </div>
          <form action="/logout" method="post">
            <button type="submit">Sign Out</button>
          </form>
        </>
      ) : (
        <Link to="/login">Sign in</Link>
      )}
    </div>
  );
}
