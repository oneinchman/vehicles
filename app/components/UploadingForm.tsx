"use client";

import { useFormState } from "react-dom";

type UploadingFormProps = {
  name: string;
  label: string;
  serverAction: (
    prevState: any,
    formData: FormData
  ) => Promise<{
    error?: string;
    message?: string;
  }>;
};

const initialState = {
  message: "",
};

export const UploadingForm = (props: UploadingFormProps) => {
  const [state, action] = useFormState(props.serverAction, initialState);

  return (
    <form action={action} className="mb-4">
      <div className="flex flex-col">
        <label htmlFor={props.name}>{props.label}</label>

        <div className="flex gap-2 items-center">
          <input type="file" name="file" id={props.name} />

          <button type="submit">Submit</button>
        </div>
      </div>

      {state?.error && <p className="text-red-700 my-3">{state.error}</p>}

      {state?.message && <p className="text-green-700 my-3">{state.message}</p>}
    </form>
  );
};
