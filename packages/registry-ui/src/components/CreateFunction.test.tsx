import { render, cleanup } from "@testing-library/react";
import React from "react";

import { CreateFunction } from "./CreateFunction";

afterEach(cleanup);

it("renders with the correct styles", () => {
  const { asFragment } = render(<CreateFunction reload={() => {}} />);
  expect(asFragment()).toMatchSnapshot();
});
