import { render, cleanup } from "@testing-library/react";
import React from "react";

import { StatusBadge } from "./StatusBadge";

afterEach(cleanup);

it("renders with the correct styles", () => {
  const { asFragment } = render(<StatusBadge status statusText={["a", "b"]} />);
  expect(asFragment()).toMatchSnapshot();
});

it("renders with the correct styles for falsy status", () => {
  const { asFragment } = render(<StatusBadge status={false} statusText={["a", "b"]} />);
  expect(asFragment()).toMatchSnapshot();
});
