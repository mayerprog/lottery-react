import React, { useState } from "react";
import axios from "axios";
import styles from "./App.module.scss";
import MockAdapter from "axios-mock-adapter";
import { RxMagicWand } from "react-icons/rx";
import { checkResult } from "./services/checkResult";
import { getRandomNumbers } from "./services/getRandomNumbers";
import Field from "./components/Field/Field";

const mock = new MockAdapter(axios);

mock.onPost("https://example.com/api/lottery").reply(200);

function App() {
  const [firstField, setFirstField] = useState(new Array(19).fill(false));
  const [secondField, setSecondField] = useState([false, false]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(
    "Failed to get a valid response from the server"
  );

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
    console.log("firstField", selectedNumbers.firstField);
    console.log("secondField", selectedNumbers.secondField);
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

    console.log("isTicketWon", isTicketWon);

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
        setResult(isTicketWon ? "Вы выиграли!" : "Вы проиграли!");
        setError(null);
      } else {
        setError("Не удалось получить корректный ответ от сервера.");
      }
    } catch (err) {
      setError("Не удалось отправить данные на сервер.");
    }
  };

  return (
    <div className={styles.app}>
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
      <button onClick={handleShowResult} className={styles.resultButton}>
        Показать результат
      </button>
      {result && <p>{result}</p>}
      <p className={styles.error}>{error}</p>
    </div>
  );
}

export default App;
