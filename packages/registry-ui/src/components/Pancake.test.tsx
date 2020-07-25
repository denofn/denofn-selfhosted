import { render, cleanup } from "@testing-library/react";
import { css } from "otion";
import React from "react";

import { Pancake } from "./Pancake";

afterEach(cleanup);

it("renders with the correct styles", () => {
  const { asFragment } = render(<Pancake />);
  expect(asFragment()).toMatchSnapshot();
});

it("renders flex=false with display:block", () => {
  render(<Pancake flex={false} />);
  expect(document.getElementsByClassName(css({ display: "block" })).length).toBe(1);
});
