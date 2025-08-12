import React, { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";

const MonacoEditor = ({ language, code, setCode }) => {
  const editorRef = useRef(null);
  const editorInstance = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Dispose of previous instance before creating a new one
    if (editorInstance.current) {
      editorInstance.current.dispose();
    }

    // Create Monaco Editor instance
    editorInstance.current = monaco.editor.create(editorRef.current, {
      value: code,
      language: language === "py" ? "python" : language, // Ensure correct language mapping
      theme: "vs-light",
      automaticLayout: true,
      fontSize: 16,
      minimap: { enabled: false },
    });

    editorInstance.current.onDidChangeModelContent(() => {
      setCode(editorInstance.current.getValue());
    });

    return () => {
      if (editorInstance.current) {
        try {
          editorInstance.current.dispose();
          editorInstance.current = null;
        } catch (error) {
          console.warn("Monaco Editor disposal warning:", error.message);
        }
      }
    };
  }, [language]);

  useEffect(() => {
    if (editorInstance.current) {
      const model = editorInstance.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(
          model,
          language === "py" ? "python" : language
        );
      }
      if (code !== editorInstance.current.getValue()) {
        editorInstance.current.setValue(code);
      }
    }
  }, [code]);

  return <div ref={editorRef} style={{ width: "100%", height: "400px" }} />;
};

export default MonacoEditor;
