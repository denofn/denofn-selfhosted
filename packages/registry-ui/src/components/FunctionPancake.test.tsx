import { render, cleanup } from "@testing-library/react";
import React from "react";

import { FunctionPancake } from "./FunctionPancake";

afterEach(cleanup);

it("renders with the correct styles", () => {
  const { asFragment } = render(<FunctionPancake f="testFn" status />);
  expect(asFragment()).toMatchSnapshot();
});

it("renders COLD status", () => {
  const { asFragment } = render(<FunctionPancake f="testFn" status={false} />);
  expect(asFragment()).toMatchSnapshot();
});
