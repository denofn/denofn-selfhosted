import { render, cleanup } from "@testing-library/react";
import React from "react";

import { CenterAlign } from "./CenterAlign";

afterEach(cleanup);

it("renders with the correct styles", () => {
  const { asFragment } = render(<CenterAlign />);
  expect(asFragment()).toMatchSnapshot();
});
