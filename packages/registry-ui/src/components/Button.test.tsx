import { render, cleanup } from "@testing-library/react";
import React from "react";

import { Button } from "./Button";

afterEach(cleanup);

it("renders with the correct styles", () => {
  const { asFragment } = render(<Button title="title" onClick={() => {}} />);
  expect(asFragment()).toMatchSnapshot();
});
