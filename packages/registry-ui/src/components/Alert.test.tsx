import { render, cleanup } from "@testing-library/react";
import React from "react";

import { Alert } from "./Alert";

afterEach(cleanup);

it("renders with the correct styles", () => {
  const { asFragment } = render(<Alert title="title" message="message" />);
  expect(asFragment()).toMatchSnapshot();
});
