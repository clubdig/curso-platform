import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
}

export default function Alert({ type, title, children, closable, onClose }: AlertProps) {
  const styles = {
    success: {
      container: 'bg-green-50 border-green-200',
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      title: 'text-green-800',
      text: 'text-green-700',
    },
    error: {
      container: 'bg-red-50 border-red-200',
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      title: 'text-red-800',
      text: 'text-red-700',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200',
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      title: 'text-yellow-800',
      text: 'text-yellow-700',
    },
    info: {
      container: 'bg-blue-50 border-blue-200',
      icon: <Info className="h-5 w-5 text-blue-500" />,
      title: 'text-blue-800',
      text: 'text-blue-700',
    },
  };

  return (
    <div className={cn('rounded-lg border p-4', styles[type].container)}>
      <div className="flex items-start gap-3">
        {styles[type].icon}
        <div className="flex-1">
          {title && (
            <h4 className={cn('font-medium mb-1', styles[type].title)}>{title}</h4>
          )}
          <p className={cn('text-sm', styles[type].text)}>{children}</p>
        </div>
        {closable && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
