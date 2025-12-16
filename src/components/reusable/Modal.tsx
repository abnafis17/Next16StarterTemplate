import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseIcon?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const maxWidthClasses: Record<string, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
};

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  showCloseIcon = true,
  maxWidth = 'lg',
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={`w-full ${maxWidthClasses[maxWidth]} max-h-[90vh] overflow-y-auto [&>button]:cursor-pointer`}
      >
        {title && (
          <DialogHeader>
            <DialogTitle className='flex justify-between items-center'>
              <span>{title}</span>
            </DialogTitle>
             <DialogDescription className="sr-only">
              Modal content
            </DialogDescription>
          </DialogHeader>
        )}
        <div className='mt-2'>{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
