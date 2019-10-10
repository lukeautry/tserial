export const optionalRenderer = () => {
  throw new Error(
    "Optional type properties can only be used as composite properties."
  );
};
