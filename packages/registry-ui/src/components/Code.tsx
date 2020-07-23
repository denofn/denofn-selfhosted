import prettier from "prettier/standalone";
import tsParser from "prettier/parser-typescript";
import { highlight, languages } from "prismjs";
import { css } from "otion";
import React from "react";
import Editor from "react-simple-code-editor";
import "prismjs/components/prism-typescript";
import "prismjs/themes/prism.css";

import { Action } from "./Function";

export const Code = React.memo(function Code({ index, dispatch }: { index?: string; dispatch: (a: Action) => void }) {
  const handleValueChange = (code: string) => {
    dispatch({ type: "index", value: code });
  };

  const handleBlur = () => {
    const formattedCode = prettier.format(`${index}`, {
      semi: true,
      printWidth: 100,
      parser: "typescript",
      plugins: [tsParser],
    });
    dispatch({ type: "index", value: formattedCode });
  };

  return (
    <div
      className={css({
        margin: "1.5rem 0",
      })}
    >
      <div className={css({ margin: "1.5rem 0 0.75rem", fontWeight: "bold" })}>index.ts</div>
      <Editor
        value={`${index}`}
        onValueChange={handleValueChange}
        highlight={(code: string) => highlight(code, languages.ts, "ts")}
        onBlur={handleBlur}
        padding={4}
        className={css({
          fontFamily: "'Fira Code', monospace",
        })}
      />
    </div>
  );
});
