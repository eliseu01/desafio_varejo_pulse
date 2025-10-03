import React, { useEffect, useState } from 'react';

const InfoIcon = () => (
  <svg
    className='h-6 w-6'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    />
  </svg>
);
const ErrorIcon = () => (
  <svg
    className='h-6 w-6'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
    />
  </svg>
);
const SuccessIcon = () => (
  <svg
    className='h-6 w-6'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    />
  </svg>
);

export type NotificationType = 'info' | 'error' | 'success';

export interface NotificationProps {
  id: number;
  message: string;
  type?: NotificationType;
  onClose: (id: number) => void;
}

const Notification: React.FC<NotificationProps> = ({
  id,
  message,
  type = 'info',
  onClose,
}) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onClose(id), 500);
    }, 4000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => onClose(id), 500);
  };

  const typeStyles = {
    info: 'bg-blue-50 border-blue-400 text-blue-800',
    error: 'bg-red-50 border-red-400',
    success: 'bg-green-50 border-green-400',
  };

  const icons = {
    info: { component: <InfoIcon />, color: 'text-blue-500' },
    error: { component: <ErrorIcon />, color: 'text-red-500' },
    success: { component: <SuccessIcon />, color: 'text-green-500' },
  };

  return (
    <div
      className={`relative mb-4 flex w-full max-w-sm items-start gap-3 rounded-lg border-l-4 p-4 shadow-lg ${typeStyles[type]} ${exiting ? 'animate-fadeOut' : 'animate-slideInUp'}`}
      role='alert'
    >
      <div className={`flex-shrink-0 ${icons[type].color}`}>
        {icons[type].component}
      </div>
      <div className='flex-1'>
        <p className='text-sm font-medium'>{message}</p>
      </div>
      <button
        onClick={handleClose}
        className='absolute top-1 right-1 p-1'
        aria-label='Fechar'
      >
        <svg
          className='h-4 w-4'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M6 18L18 6M6 6l12 12'
          />
        </svg>
      </button>
    </div>
  );
};

export default Notification;