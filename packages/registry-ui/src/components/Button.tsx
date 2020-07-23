import React from "react";
import { css } from "otion";
import { Spinner } from "./Spinner";

export type ButtonProps = {
  className?: string;
  loading?: boolean;
  title: string;
  disabled?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export const Button = React.memo(function Button({ className, loading, disabled, title, onClick }: ButtonProps) {
  return (
    <button
      className={`${css({
        backgroundColor: "transparent",
        fontWeight: "bold",
        padding: ".5rem 1rem",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "rgb(26, 32, 44)",
        borderRadius: ".25rem",
        lineHeight: "1rem",
        fontSize: "1rem",
        cursor: "pointer",
        ":hover": {
          backgroundColor: "rgb(26, 32, 44) !important",
          color: "white",
          borderColor: "transparent",
        },
        ":disabled": {
          color: loading ? "rgb(26, 32, 44)" : "rgba(26,32,44,.5)",
          borderColor: loading ? "rgb(26, 32, 44)" : "rgba(26,32,44,.5)",
          cursor: "not-allowed",
        },
        selectors: {
          "&:disabled:hover": {
            backgroundColor: "transparent !important",
            borderColor: loading ? "rgb(26, 32, 44)" : "rgba(26,32,44,.5)",
          },
        },
      })}${className ? ` ${className}` : ""}`}
      disabled={disabled ?? false}
      onClick={onClick}
    >
      <div
        className={css({
          display: "flex",
          alignItems: "center",
        })}
      >
        {loading && (
          <span className={css({ marginRight: ".33rem" })}>
            <Spinner dim=".66rem" thickness=".125rem" />
          </span>
        )}
        {title}
      </div>
    </button>
  );
});
