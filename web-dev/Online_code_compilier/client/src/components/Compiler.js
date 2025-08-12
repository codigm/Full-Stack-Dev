import React from "react";
import "./Compiler.css";
import MonacoEditor from "./MonacoEditor";
import stubs from "../defaultStubs";

const Compiler = ({
  language,
  setLanguage,
  code,
  setCode,
  handleSubmit,
  status,
  jobId,
  renderTimeDetails,
  output,
  setDefaultLanguage,
}) => {
  const handleLanguageChange = (e) => {
    let response = window.confirm(
      "WARNING: Switching the language will remove your current code. Do you wish to proceed?"
    );
    if (response) {
      const newLang = e.target.value;
      setLanguage(newLang);
      setCode(stubs[newLang] || ""); // Ensure no error if stub missing
    }
  };

  return (
    <div className="container">
      <h1 className="heading">Online Code Compiler</h1>

      <div className="compiler">
        {/* Left Side - Code Editor */}
        <div className="editor">
          <div className="language-selection">
            <label>Language:</label>
            <select value={language} onChange={handleLanguageChange}>
              <option value="cpp">C++</option>
              <option value="py">Python</option>
            </select>
          </div>

          <button onClick={setDefaultLanguage}>Set Default</button>

          {/* Ensure Monaco Editor Updates Syntax Mode Correctly */}
          <MonacoEditor language={language} code={code} setCode={setCode} />

          <button onClick={handleSubmit}>Submit</button>
        </div>

        {/* Right Side - Output */}
        <div className="output">
          <h3>Output:</h3>
          <textarea
            readOnly
            value={
              status === "error"
                ? "Can't Get the output"
                : output || "Output will appear here..."
            }
          ></textarea>
          <p>{jobId && `JobID: ${jobId}`}</p>
          <p>{renderTimeDetails().split("\n")[0]}</p>
          <p>{renderTimeDetails().split("\n")[1]}</p>
        </div>
      </div>
    </div>
  );
};

export default Compiler;
