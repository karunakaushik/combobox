import "./App.scss";
import { ComboBox } from "./combo-box";

const App = () => {
  const autoincompletes = [
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4",
    "Option 5",
    "Option 6",
    "Option 7",
  ];

  const handleSelect = (selectedValue: string) => {
    console.log("Selected value:", selectedValue);
  };
  return (
    <div className="center">
      <div className="card">
        <ComboBox options={autoincompletes} onSelect={handleSelect} />
      </div>
    </div>
  );
};

export default App;
