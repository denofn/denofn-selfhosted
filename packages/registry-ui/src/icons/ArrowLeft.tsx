import React from "react";

type ArrowLeftProps = {
  className: string;
  onClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
};

export function ArrowLeft(props: ArrowLeftProps) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} {...props}>
      <path
        className="prefix__heroicon-ui"
        d="M5.41 11H21a1 1 0 010 2H5.41l5.3 5.3a1 1 0 01-1.42 1.4l-7-7a1 1 0 010-1.4l7-7a1 1 0 011.42 1.4L5.4 11z"
      />
    </svg>
  );
}
