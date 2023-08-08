import logo from './logo.svg';
import './App.css';
import React, { useState } from "react";

import FormContext from "./modules/FormContext"
import Form from "./pages/form"
import Watch from "./pages/watch"

function App() {
  const [grade, setGrade] = useState("");
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [formFilled, setFormFilled] = useState(false);
  const [startTime, setStartTime] = useState(0);

  const renderPage = () => {
    if (formFilled) return (<Watch />);
    else return (<Form />)
  }

  return (
    <div className="App">
      <FormContext.Provider value={{grade, setGrade, name, setName, school, setSchool, setFormFilled, startTime, setStartTime}}>
        {renderPage()}
      </FormContext.Provider>
    </div>
  );
}

export default App;
