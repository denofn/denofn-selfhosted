import { render, cleanup } from "@testing-library/react";
import React from "react";

import { CreateFunctionButton } from "./CreateFunctionButton";

afterEach(cleanup);

it("renders with the correct styles", () => {
  const { asFragment } = render(<CreateFunctionButton />);
  expect(asFragment()).toMatchSnapshot();
});
