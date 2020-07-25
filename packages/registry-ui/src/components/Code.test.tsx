import { render, cleanup } from "@testing-library/react";
import React from "react";

import { Code } from "./Code";

afterEach(cleanup);

it("renders with the correct styles", () => {
  const { asFragment } = render(<Code dispatch={() => {}} />);
  expect(asFragment()).toMatchSnapshot();
});
