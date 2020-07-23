import { css } from "otion";
import React from "react";
import CreatableSelect from "react-select/creatable";

import { Action } from "./Function";
import { RegistryJSON } from "../types";

type Option = {
  label: string;
  value: string;
};

function createOption(label: string): Option {
  return { label, value: label };
}

function extractValues(options: Option[]): string[] {
  return (options ?? []).map(({ value }) => value);
}

export const Registry = React.memo(function Registry({
  dispatch,
  registry,
}: {
  registry?: RegistryJSON;
  dispatch: (a: Action) => void;
}) {
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState(registry?.whitelist.map(createOption));

  function onClickCheckbox(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({ type: "warmupOnStart", value: !registry?.warmupOnStart });
  }

  function handleChange(options: any) {
    setOptions(options);
    dispatch({ type: "whitelist", value: extractValues(options) });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (!inputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        handleChange([...(options ?? []), createOption(inputValue)]);
        setInputValue("");
        event.preventDefault();
    }
  }

  function handleInputChange(v: string) {
    setInputValue(v);
  }

  return (
    <div
      className={css({
        margin: "1.5rem 0",
      })}
    >
      <div className={css({ fontWeight: "bold", marginBottom: "0.75rem" })}>URL Whitelist</div>
      <CreatableSelect
        components={{ DropdownIndicator: null }}
        inputValue={inputValue}
        isClearable
        isMulti
        menuIsOpen={false}
        placeholder="Enter the domains you want to send requests to here..."
        value={options}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onInputChange={handleInputChange}
      />
      <div className={css({ marginTop: "1.5rem", display: "flex", alignItems: "center" })}>
        <label htmlFor="warmupOnStart" className={css({ marginRight: ".5rem", fontWeight: "bold" })}>
          Post-registration warmup
        </label>
        <input
          type="checkbox"
          checked={registry?.warmupOnStart ?? false}
          id="warmupOnStart"
          onChange={onClickCheckbox}
        />
      </div>
    </div>
  );
});
