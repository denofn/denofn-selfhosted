import React from "react";
import { css } from "otion";

import { ArrowLeft } from "../icons/ArrowLeft";
import { ViewsContext } from "./Views";

export type HeaderProps = {
  title?: string;
};

export function Header({ title = "denoFn" }: HeaderProps) {
  const [{ current, manage }, dispatch] = React.useContext(ViewsContext);
  return (
    <header
      className={css({
        display: "flex",
        backgroundColor: "rgb(26, 32, 44)",
        color: "white",
        borderColor: "rgb(237,242,247)",
        borderBottomStyle: "solid",
        borderBottomWidth: "1px",
        height: "4rem",
      })}
    >
      <div
        className={css({
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginLeft: "auto",
          marginRight: "auto",
          width: "100%",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        })}
      >
        <div
          className={css({
            display: "flex",
          })}
        >
          {(current === "manage" || current === "create") && (
            <ArrowLeft
              onClick={() => dispatch({ current: "view-all" })}
              className={css({
                display: "inline-block",
                lineHeight: "1.5rem",
                marginTop: "1.25rem",
                marginBottom: "1.25rem",
                marginRight: "0.5rem",
                cursor: "pointer",
                fill: "white",
              })}
            />
          )}
          <h4
            className={css({
              display: "inline-block",
              lineHeight: "1.5rem",
              marginTop: "1.25rem",
              marginBottom: "1.25rem",
            })}
          >
            {current === "manage" ? manage : current === "create" ? "create fn" : title}
          </h4>
        </div>
      </div>
    </header>
  );
}
