import React, { useState } from "react";
import axios from "axios";
import styles from "./App.module.scss";
import MockAdapter from "axios-mock-adapter";
import { checkResult } from "./services/checkResult";
import { getRandomNumbers } from "./services/getRandomNumbers";
import MainPage from "./Pages/MainPage/MainPage";
import ResultPage from "./Pages/ResultPage/ResultPage";

const mock = new MockAdapter(axios);

mock.onPost("https://example.com/api/lottery").reply(200);

const App = () => {
  const [firstField, setFirstField] = useState(new Array(19).fill(false));
  const [secondField, setSecondField] = useState([false, false]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFirstFieldClick = (index) => {
    const newField = [...firstField];
    const selectedCount = newField.filter((selected) => selected).length;
    if (newField[index] || selectedCount < 8) {
      newField[index] = !newField[index];
      setFirstField(newField);
    }
  };

  const handleSecondFieldClick = (index) => {
    const newField = [false, false];
    newField[index] = true;
    setSecondField(newField);
  };

  const chooseRandomNumbers = () => {
    const randomNumbers = getRandomNumbers();
    const newFirstField = firstField.map((field, index) =>
      randomNumbers.firstSet.includes(index + 1)
    );
    const newSecondField = [false, false];
    newSecondField[randomNumbers.secondSet - 1] = true;
    setFirstField(newFirstField);
    setSecondField(newSecondField);
  };

  const handleShowResult = async () => {
    const selectedNumbers = {
      firstField: firstField
        .map((selected, index) => (selected ? index + 1 : null))
        .filter((num) => num !== null),
      secondField: secondField.findIndex((selected) => selected) + 1,
    };
    if (
      selectedNumbers.firstField.length < 8 ||
      selectedNumbers.secondField < 1
    ) {
      alert(
        "Please select 8 numbers in the first field and 1 number in the second field."
      );
      return;
    }

    const generatedNumbers = getRandomNumbers();

    const isTicketWon = checkResult(generatedNumbers, selectedNumbers);

    try {
      let attempts = 0;
      let response;
      while (attempts < 3) {
        try {
          response = await axios.post("https://example.com/api/lottery", {
            selectedNumber: selectedNumbers,
            isTicketWon,
          });
          break;
        } catch (err) {
          attempts++;
          if (attempts < 3) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }
      }
      if (response && response.status === 200) {
        setResult(isTicketWon ? "Еее, вы выиграли!" : "Вы проиграли :(");
        setError(null);
      } else {
        setError("Не удалось получить корректный ответ от сервера.");
      }
    } catch (err) {
      setError("Не удалось отправить данные на сервер.");
    }
  };

  const tryAgain = () => {
    setResult(null);
    setFirstField(new Array(19).fill(false));
    setSecondField([false, false]);
  };

  return (
    <div className={styles.app}>
      {result ? (
        <ResultPage result={result} tryAgain={tryAgain} />
      ) : (
        <MainPage
          firstField={firstField}
          secondField={secondField}
          handleFirstFieldClick={handleFirstFieldClick}
          handleSecondFieldClick={handleSecondFieldClick}
          chooseRandomNumbers={chooseRandomNumbers}
          handleShowResult={handleShowResult}
          error={error}
        />
      )}
    </div>
  );
};

export default App;
