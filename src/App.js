import React, { useState } from "react";
import axios from "axios";
import styles from "./App.module.scss";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios);

mock.onPost("https://example.com/api/lottery").reply(200);

function App() {
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

  const getRandomNumbers = () => {
    const firstSet = [];
    while (firstSet.length < 8) {
      const num = Math.floor(Math.random() * 19) + 1;
      if (!firstSet.includes(num)) {
        firstSet.push(num);
      }
    }
    const secondSet = Math.floor(Math.random() * 2) + 1;
    console.log("secondSet", secondSet);
    console.log("firstSet", firstSet);
    return { firstSet, secondSet };
  };

  const checkResult = (generated, selected) => {
    const firstMatchCount = selected.firstField.filter((num) =>
      generated.firstSet.includes(num)
    ).length;
    console.log("firstSelectedCount", selected);
    console.log("secondSelectedCount", selected.secondField);

    const secondMatch = selected.secondField === generated.secondSet;

    console.log("firstMatchCount", firstMatchCount);
    console.log("secondMatch", secondMatch);

    return firstMatchCount >= 4 || (firstMatchCount >= 3 && secondMatch);
  };

  const handleShowResult = async () => {
    const selectedNumbers = {
      firstField: firstField
        .map((selected, index) => (selected ? index + 1 : null))
        .filter((num) => num !== null),
      secondField: secondField[0] ? 1 : 2,
    };
    console.log("secondField", secondField);
    console.log("firstField", firstField);

    if (
      selectedNumbers.firstField.length < 8 ||
      selectedNumbers.secondField.length < 1
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
        setResult(isTicketWon ? "You won!" : "You lost!");
        setError(null);
      } else {
        setError("Failed to get a valid response from the server.");
      }
    } catch (err) {
      setError("Failed to send data to the server.");
    }
  };

  return (
    <div className={styles.app}>
      {/* <h1>Gosloto "8 из 19"</h1> */}
      <div className={styles.field}>
        {firstField.map((selected, index) => (
          <button
            key={index}
            className={selected ? styles.selected : ""}
            onClick={() => handleFirstFieldClick(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className={styles.field}>
        {secondField.map((selected, index) => (
          <button
            key={index}
            className={selected ? styles.selected : ""}
            onClick={() => handleSecondFieldClick(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <button onClick={handleShowResult}>Показать результат</button>
      {result && <p>{result}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default App;
