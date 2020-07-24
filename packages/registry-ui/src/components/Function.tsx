import { css } from "otion";
import React from "react";
import { useFetch } from "use-http";

import { RegistryJSON } from "../types";
import { ExternalLink } from "../icons/ExternalLink";
import { diffChanges } from "../utils/diffChanges";
import { Button } from "./Button";
import { Code } from "./Code";
import { Pancake } from "./Pancake";
import { Registry } from "./Registry";
import { StatusBadge } from "./StatusBadge";
import { getOrigin } from "../utils/getOrigin";
import { API_V1 } from "../utils/prefixes";
import { useAuth0 } from "@auth0/auth0-react";

export type State = {
  index: string;
  registry: RegistryJSON;
};

export type Action = {
  type: "warmupOnStart" | "index" | "whitelist";
  value: boolean | string | string[];
};

function functionReducer(state: State, action: Action): State {
  switch (action.type) {
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

export function Function({
  scriptName,
  isWarmedUp,
  reload,
  ...data
}: {
  scriptName: string;
  index: string;
  registry: RegistryJSON;
  isWarmedUp: boolean;
  reload: () => void;
}) {
  const { user } = useAuth0();
  const [state, dispatch] = React.useReducer(functionReducer, {
    index: data.index,
    registry: data.registry,
  });
  const { post, loading, response } = useFetch(API_V1(`/functions`), {
    headers: {
      "x-denofn-user": user?.sub,
    },
  });

  const isEqual = diffChanges(
    {
      index: data.index,
      registry: data.registry,
    },
    state
  );

  async function saveChanges() {
    await post(`/${scriptName}`, state);
    if (response.ok) reload();
  }

  return (
    <Pancake
      padding="1.5rem"
      flex={false}
      className={css({
        minHeight: "calc(75vh - 7.5rem)",
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
        <div
          className={css({
            display: "flex",
            alignItems: "center",
          })}
        >
          <h2
            className={css({
              margin: "0",
              lineHeight: "1.5rem",
              fontSize: "1.5rem",
            })}
          >
            {scriptName}
          </h2>
          <a
            href={`${getOrigin()}/${scriptName}`}
            target="_blank"
            rel="noopener noreferrer"
            className={css({ height: "1.5rem", width: "1.5rem" })}
          >
            <ExternalLink
              className={css({
                marginLeft: ".25rem",
                fill: "rgba(26, 32, 44, 0.5)",
                alignSelf: "flex-start",
              })}
            />
          </a>
          <StatusBadge
            className={css({ marginLeft: ".75rem" })}
            status={isWarmedUp ?? false}
            statusText={["WARM", "COLD"]}
          />
        </div>
        <Button disabled={isEqual} title="Save Changes" onClick={saveChanges} loading={loading} />
      </div>
      <hr color="#e2e8f0" />
      <Registry registry={state!.registry} dispatch={dispatch} />
      <Code index={state!.index} dispatch={dispatch} />
    </Pancake>
  );
}
