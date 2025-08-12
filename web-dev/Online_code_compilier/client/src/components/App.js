import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import stubs from "../defaultStubs";
import moment from "moment";
import Compiler from "./Compiler";

function App() {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(stubs["cpp"] || "");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");
  const [jobId, setJobId] = useState("");
  const [jobDetails, setJobDetails] = useState(null);

  useEffect(() => {
    const savedLang = localStorage.getItem("default-language") || "cpp";
    setLanguage(savedLang);
    setCode(stubs[savedLang] || "");
  }, []);

  useEffect(() => {
    if (stubs[language]) {
      setCode(stubs[language]);
    } else {
      setCode("");
    }
  }, [language]);

  const setDefaultLanguage = () => {
    localStorage.setItem("default-language", language);
  };

  const renderTimeDetails = () => {
    if (!jobDetails) return "";
    let result = "";
    let { submittedAt, completedAt, startedAt } = jobDetails;
    submittedAt = moment(submittedAt).toString();
    result += `Submitted At: ${submittedAt}`;
    if (!completedAt || !startedAt) return result;

    const executionTime = moment(completedAt).diff(
      moment(startedAt),
      "seconds",
      true
    );
    result += `\n Execution Time: ${executionTime}s`;
    return result;
  };

  const handleSubmit = async () => {
    const payload = { language, code };
    try {
      setJobId("");
      setStatus("");
      setOutput("");
      setJobDetails(null);
      const { data } = await axios.post("http://localhost:5000/run", payload);
      setJobId(data.jobId);
      let intervalId = setInterval(async () => {
        const { data: dataRes } = await axios.get(
          "http://localhost:5000/status",
          { params: { id: data.jobId } }
        );
        if (dataRes.success) {
          setStatus(dataRes.job.status);
          setJobDetails(dataRes.job);
          if (dataRes.job.status === "pending") return;
          setOutput(dataRes.job.output);
          clearInterval(intervalId);
        } else {
          setStatus("Error: Please retry");
          setOutput(dataRes.error);
          clearInterval(intervalId);
        }
      }, 1000);
    } catch ({ response }) {
      setOutput(
        response ? response.data.err.stderr : "Error connecting to server!"
      );
    }
  };

  return (
    <Compiler
      language={language}
      setLanguage={setLanguage}
      code={code}
      setCode={setCode}
      handleSubmit={handleSubmit}
      status={status}
      jobId={jobId}
      renderTimeDetails={renderTimeDetails}
      output={output}
      setDefaultLanguage={setDefaultLanguage}
    />
  );
}

export default App;
