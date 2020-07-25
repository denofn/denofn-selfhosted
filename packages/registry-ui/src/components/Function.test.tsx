import { render, cleanup } from "@testing-library/react";
import React from "react";

import { Function } from "./Function";

afterEach(cleanup);

it("renders with the correct styles", () => {
  const { asFragment } = render(
    <Function scriptName="scriptName" index="" registry={{ whitelist: [] }} isWarmedUp reload={() => {}} />
  );
  expect(asFragment()).toMatchSnapshot();
});
