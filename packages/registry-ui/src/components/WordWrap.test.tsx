import { render, cleanup } from "@testing-library/react";
import React from "react";

import { WordWrap } from "./WordWrap";

afterEach(cleanup);

it("renders with the correct styles", () => {
  const { asFragment } = render(<WordWrap />);
  expect(asFragment()).toMatchSnapshot();
});
