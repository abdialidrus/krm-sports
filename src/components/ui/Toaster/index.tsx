import { useEffect, useRef, useState } from 'react';
import styles from './Toaster.module.scss';

type PropTypes = {
  variant: string;
  message?: string;
  onClose: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toastVariants: any = {
  success: {
    title: 'Success',
    icon: 'bx-check-circle',
    color: '#a3d9a5',
    barColor: '#3f9242',
  },
  danger: {
    title: 'Error',
    icon: 'bxs-hot',
    color: '#f39b9a',
    barColor: '#bb2525',
  },
  warning: {
    title: 'Warning',
    icon: 'bx-check-circle',
    color: '#f8e3a2',
    barColor: '#e9b949',
  },
};

const Toaster = (props: PropTypes) => {
  const { variant, message, onClose } = props;
  const [barLength, setBarLength] = useState(100);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeRef = useRef<any>(null);

  const timerStart = () => {
    timeRef.current = setInterval(() => {
      setBarLength((prevLength) => prevLength - 0.14);
    }, 1);
  };

  useEffect(() => {
    timerStart();
    return () => clearInterval(timeRef.current);
  }, []);

  return (
    <div className={`${styles.toaster} ${styles[`toaster--${variant}`]}`}>
      <div className={styles.toaster__main}>
        <div className={styles.toaster__main__icon}>
          <i className={`bx ${toastVariants[variant].icon}`} style={{ color: toastVariants[variant].barColor }} />
        </div>
        <div className={styles.toaster__main__text}>
          <div className={styles.toaster__main__text__title}>{toastVariants[variant].title}</div>
          <div className={styles.toaster__main__text__message}>{message}</div>
        </div>
        <i className={`bx bx-x ${styles.toaster__main__close}`} onClick={() => onClose()} />
      </div>
      <div className={`${styles.toaster__timer}`} style={{ backgroundColor: toastVariants[variant].color }}>
        <div style={{ width: `${barLength}%`, height: '100%', backgroundColor: toastVariants[variant].barColor }} />
      </div>
    </div>
  );
};

export default Toaster;
