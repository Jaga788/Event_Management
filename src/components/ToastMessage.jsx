import React from 'react';
import { CheckCircle2 } from 'lucide-react';

function ToastMessage({ message }) {
  return <div className="toast"><CheckCircle2 size={18} />{message}</div>;
}

export default ToastMessage;
