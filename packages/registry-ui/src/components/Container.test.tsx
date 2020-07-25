import { render, cleanup } from "@testing-library/react";
import React from "react";

import { Container } from "./Container";

afterEach(cleanup);

it("renders with the correct styles", () => {
  const { asFragment } = render(<Container />);
  expect(asFragment()).toMatchSnapshot();
});
