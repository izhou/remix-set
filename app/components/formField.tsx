interface FormFieldProps {
  htmlFor: string
  label: string
  type?: string
  value: any
  onChange?: (...args: any) => any
}

export function FormField(props: FormFieldProps) {
  return (
    <>
      <label htmlFor={props.htmlFor}>
        {props.label}
      </label>
      <input
        onChange={props.onChange}
        type={props.type}
        id={props.htmlFor}
        name={props.htmlFor}
        value={props.value}
      />
    </>
  )
}