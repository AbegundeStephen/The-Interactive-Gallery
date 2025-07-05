import React from "react";
import { AlertCircle } from "lucide-react";

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex items-center justify-center p-8 text-red-500">
      <AlertCircle className="w-5 h-5 mr-2" />
      <span>{message}</span>
    </div>
);
  
export default ErrorMessage