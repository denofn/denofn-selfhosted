import { render, cleanup } from "@testing-library/react";
import React from "react";

import { HeaderButton } from "./HeaderButton";

afterEach(cleanup);

it("renders with the correct styles", () => {
  const { asFragment } = render(<HeaderButton title="title" onClick={() => {}} />);
  expect(asFragment()).toMatchSnapshot();
});
