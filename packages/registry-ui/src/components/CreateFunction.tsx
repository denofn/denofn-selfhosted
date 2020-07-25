import { useAuth0 } from "@auth0/auth0-react";
import { css } from "otion";
import React from "react";
import { useFetch } from "use-http";

import { RegistryJSON } from "../types";
import { API_V1 } from "../utils/prefixes";
import { Button } from "./Button";
import { CenterAlign } from "./CenterAlign";
import { Code } from "./Code";
import { Error } from "./Error";
import { Pancake } from "./Pancake";
import { Registry } from "./Registry";

export type State = {
  scriptName: string;
  index: string;
  registry: RegistryJSON;
};

export type Action = {
  type: "warmupOnStart" | "index" | "whitelist" | "scriptName";
  value: boolean | string | string[];
};

function functionReducer(state: State, action: Action): State {
  switch (action.type) {
    case "scriptName":
      return { ...state, scriptName: action.value as string };
    case "index":
      return { ...state, index: action.value as string };
    case "warmupOnStart":
      return {
        ...state,
        registry: {
          ...state.registry,
          warmupOnStart: action.value as boolean,
        },
      };
    case "whitelist":
      return {
        ...state,
        registry: {
          ...state.registry,
          whitelist: action.value as string[],
        },
      };
    default:
      return state;
  }
}

export function CreateFunction({ reload }: { reload: () => void }) {
  const { user } = useAuth0();
  const [state, dispatch] = React.useReducer(functionReducer, {
    scriptName: "",
    index: `import {
  createHandler,
  createResponse,
} from "https://cdn.jsdelivr.net/gh/jeroenptrs/denofn@1.0.0/packages/micro/functions/mod.ts";

export default createHandler(async (req, res) => {
  return createResponse({
    body: "Hello, World",
  });
});
`,
    registry: {
      whitelist: [],
      warmupOnStart: false,
    },
  });
  const { post, loading, response, error, data } = useFetch(API_V1(`/functions`), {
    headers: {
      "x-denofn-user": user?.sub,
    },
  });

  async function saveChanges() {
    await post(state);
    if (response.ok) reload();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    dispatch({ value: e.target.value, type: "scriptName" });
  }

  return (
    <>
      {error && (
        <CenterAlign>
          <Error title="Something went wrong while creating your new function" message={data} />
        </CenterAlign>
      )}
      <Pancake
        padding="1.5rem"
        flex={false}
        className={css({
          minHeight: "calc(75vh - 7.5rem)",
          marginTop: error ? "1.5rem" : "0",
        })}
      >
        <div
          className={css({
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "0",
            marginBottom: "1.5rem",
          })}
        >
          <input
            className={css({
              width: "100%",
              padding: ".25rem .5rem",
              lineHeight: "1.5rem",
              borderStyle: "none",
              backgroundColor: "transparent",
              appearance: "none",
              fontSize: "1.5rem",
              fontFamily: "'Rubik', sans-serif",
              fontWeight: "bold",
              "::placeholder": {
                fontFamily: "'Karla', sans-serif",
                fontWeight: "initial",
              },
            })}
            value={state.scriptName}
            onChange={handleChange}
            placeholder="Enter your scriptname here"
            autoFocus
          />
          <Button
            disabled={state.scriptName === ""}
            title="Create"
            onClick={saveChanges}
            loading={loading}
            className={css({ marginLeft: "1.5rem" })}
          />
        </div>
        <hr color="#e2e8f0" />
        <Registry registry={state!.registry} dispatch={dispatch} />
        <Code index={state!.index} dispatch={dispatch} />
      </Pancake>
    </>
  );
}
