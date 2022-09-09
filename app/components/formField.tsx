interface FormFieldProps {
  htmlFor: string;
  label: string;
  type?: string;
  value: any;
  onChange?: (...args: any) => any;
  error?: string;
}

export function FormField(props: FormFieldProps) {
  return (
    <>
      <label htmlFor={props.htmlFor}>{props.label} </label>
      <input
        className={"form-field" + (props.error ? " form-field--error" : "")}
        onChange={props.onChange}
        type={props.type}
        id={props.htmlFor}
        name={props.htmlFor}
        value={props.value}
      />
      <div className="form-error">&nbsp;{props.error || ""}</div>
    </>
  );
}
