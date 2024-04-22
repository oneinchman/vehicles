import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Term } from "./Term";

test(`${Term.name}`, () => {
  render(<Term label="My label" value={123} />);

  expect(screen.getByText("My label")).toBeDefined();
  expect(screen.getByText(123)).toBeDefined();
});
