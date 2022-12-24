import "./styling/code-editor.css";
import "./styling/syntax.css";
import { useRef } from "react";
import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import codeShift from "jscodeshift";
import Highlighter from "monaco-jsx-highlighter";

interface CodeEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

const CodeEditor = ({ initialValue, onChange }: CodeEditorProps) => {
  const editorRef = useRef<any>();

  const onEditorDidMount: EditorDidMount = (
    getEditorValue: () => string,
    editor
  ) => {
    editorRef.current = editor;
    editor.onDidChangeModelContent(() => {
      onChange(getEditorValue());
    });

    editor.getModel()?.updateOptions({ tabSize: 2 });

    const highlighter = new Highlighter(
      //@ts-ignore
      window.monaco,
      codeShift,
      editor
    );
    // disable console loggins with empty callbacks
    highlighter.highLightOnDidChangeModelContent(
      () => {},
      () => {},
      undefined,
      () => {}
    );
  };

  const onFormatClick = () => {
    const unformatted = editorRef.current.getModel().getValue();
    const formatted = prettier
      .format(unformatted, {
        parser: "babel",
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, ""); //remove newlines
    editorRef.current.setValue(formatted);
  };

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
      >
        Format
      </button>

      <MonacoEditor
        editorDidMount={onEditorDidMount}
        value={initialValue}
        language="javascript"
        theme="dark"
        height="100%"
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
