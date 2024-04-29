import styles from './Input.module.scss';

type Proptypes = {
  label?: string;
  name: string;
  type: string;
  error?: string;
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
};
const Input = (props: Proptypes) => {
  const { label, name, type, error, placeholder, defaultValue, disabled } = props;
  return (
    <div className={styles.container}>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        name={name}
        id={name}
        type={type}
        placeholder={placeholder}
        className={styles.container__input}
        defaultValue={defaultValue}
        disabled={disabled}
      />
      {error && <div className={styles.container__error}>{error}</div>}
    </div>
  );
};

export default Input;
