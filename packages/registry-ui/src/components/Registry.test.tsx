import { render, cleanup } from "@testing-library/react";
import React from "react";

import { Registry } from "./Registry";

afterEach(cleanup);

it("renders with the correct styles", () => {
  const { asFragment } = render(<Registry dispatch={() => {}} />);
  expect(asFragment()).toMatchSnapshot();
});
