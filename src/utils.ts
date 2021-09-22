import { useReducer } from "react";

export const useRerender = () => useReducer(_ => Object.create(null), undefined)[1];