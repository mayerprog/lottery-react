import React from "react";
import axios from "axios";
import styles from "./MainPage.module.scss";
import MockAdapter from "axios-mock-adapter";
import { RxMagicWand } from "react-icons/rx";
import Field from "../../components/Field/Field";
import Button from "../../components/Button/Button";

const mock = new MockAdapter(axios);

mock.onPost("https://example.com/api/lottery").reply(200);

const MainPage = ({
  firstField,
  secondField,
  handleFirstFieldClick,
  handleSecondFieldClick,
  chooseRandomNumbers,
  handleShowResult,
  error,
}) => {
  return (
    <>
      <div className={styles.wand} onClick={chooseRandomNumbers}>
        <RxMagicWand size={30} />
      </div>
      <Field
        numbers={firstField}
        onClick={handleFirstFieldClick}
        text="Отметьте 8 чисел"
        isFirst={true}
      />
      <Field
        numbers={secondField}
        onClick={handleSecondFieldClick}
        text="Отметьте 1 число"
        isFirst={false}
      />
      <Button onClick={handleShowResult} text="Показать результат" />
      <p className={styles.error}>{error}</p>
    </>
  );
};

export default MainPage;
