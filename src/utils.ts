import { useReducer } from "react";

// https://stackoverflow.com/a/58606536
export const useRerender = () => useReducer(_ => ({}), 0)[1];