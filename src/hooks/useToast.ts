// useToast.ts
import { addToast } from '@heroui/toast';

type Toast = {
  title: string;
  description: string;
  type?: 'success' | 'secondary' | 'default' | 'danger';
  lazy?: boolean;
};

const useToast = () => {
  const showToast = ({
    title,
    description,
    type = 'default',
    lazy = false,
  }: Toast) => {
    addToast({
      title,
      description,
      timeout: lazy ? 1000 : 0,
      shouldShowTimeoutProgress: lazy,
      color: type,
    });
  };

  return { showToast };
};

export default useToast;
