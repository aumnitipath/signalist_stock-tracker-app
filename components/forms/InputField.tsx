import React from "react";
import { Label } from "../ui/label";

const InputField = ({
  name,
  label,
  placeholder,
  type = "text",
  register,
  error,
  validation,
  disabled,
  value,
}: FormInputProps) => {
  return (
    <div className="space-y-2">
      <Label>Label</Label>
    </div>
  );
};

export default InputField;
