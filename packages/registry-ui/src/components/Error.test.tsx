import { render, cleanup } from "@testing-library/react";
import React from "react";

import { Error } from "./Error";

afterEach(cleanup);

it("renders with the correct styles", () => {
  const { asFragment } = render(<Error title="title" message="message" />);
  expect(asFragment()).toMatchSnapshot();
});
