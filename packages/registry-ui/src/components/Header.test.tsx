import { render, cleanup } from "@testing-library/react";
import React from "react";

import { Header } from "./Header";

afterEach(cleanup);

it("renders with the correct styles", () => {
  const { asFragment } = render(<Header />);
  expect(asFragment()).toMatchSnapshot();
});
