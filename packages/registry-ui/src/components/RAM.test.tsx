import { render, cleanup } from "@testing-library/react";
import React from "react";

import { RAM } from "./RAM";

afterEach(cleanup);

it("renders with the correct styles", () => {
  const { asFragment } = render(<RAM />);
  expect(asFragment()).toMatchSnapshot();
});
