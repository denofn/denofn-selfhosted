import { render, cleanup } from "@testing-library/react";
import React from "react";

import { Spinner } from "./Spinner";

afterEach(cleanup);

it("renders with the correct styles", () => {
  const { asFragment } = render(<Spinner />);
  expect(asFragment()).toMatchSnapshot();
});
