import React from "react";
import styles from "./Button.module.scss";

const Button = ({ onClick, text }) => {
  return (
    <button onClick={onClick} className={styles.resultButton}>
      {text}
    </button>
  );
};

export default Button;
