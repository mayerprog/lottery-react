import React from "react";
import Button from "../../components/Button/Button";
import styles from "./ResultPage.module.scss";

const ResultPage = ({ result, tryAgain }) => {
  return (
    <div className={styles.container}>
      <p>{result}</p>
      <Button onClick={tryAgain} text="Попробовать снова" />
    </div>
  );
};

export default ResultPage;
