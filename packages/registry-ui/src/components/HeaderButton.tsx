import { css } from "otion";
import React from "react";

export type ButtonProps = {
  title: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export function HeaderButton({ title, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={css({
        boxSizing: "border-box",
        backgroundColor: "transparent",
        color: "white",
        borderColor: "white",
        fontWeight: "bold",
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: "0.25rem",
        padding: "7px 1rem",
        cursor: "pointer",
        lineHeight: "1rem",
        fontSize: "1rem",
        ":hover": {
          color: "black",
          backgroundColor: "white",
          borderColor: "transparent",
        },
      })}
    >
      {title}
    </button>
  );
}
