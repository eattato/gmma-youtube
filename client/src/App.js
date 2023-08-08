import logo from './logo.svg';
import './App.css';
import React, { useState } from "react";

import FormContext from "./modules/FormContext"
import Form from "./pages/form"

function App() {
  const [grade, setGrade] = useState("");
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");

  return (
    <div className="App">
      <FormContext.Provider value={[grade, setGrade, name, setName, school, setSchool]}>
        <Form />
      </FormContext.Provider>
    </div>
  );
}

export default App;
