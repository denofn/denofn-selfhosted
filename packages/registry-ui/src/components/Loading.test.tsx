import { render, cleanup } from "@testing-library/react";
import React from "react";

import { Loading } from "./Loading";

afterEach(cleanup);

it("renders with the correct styles", () => {
  const { asFragment } = render(<Loading />);
  expect(asFragment()).toMatchSnapshot();
});
