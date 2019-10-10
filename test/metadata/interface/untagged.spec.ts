import { runGetMetadata } from "../run";

export interface ITestInterface {
  stringProp: string;
}

it("[interface] untagged", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(0);
});
