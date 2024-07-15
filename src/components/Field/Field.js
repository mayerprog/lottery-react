import styles from "./Field.module.scss";

const Field = ({ numbers, onClick, text, isFirst }) => {
  return (
    <div className={styles.field}>
      <div className={styles.titleContainer}>
        <h3>Поле {isFirst ? "1" : "2"}</h3>
        <span>{text}</span>
      </div>
      {numbers.map((selected, index) => (
        <button
          key={index}
          className={selected ? styles.selected : ""}
          onClick={() => onClick(index)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};
export default Field;
