import s from "./state";
import c from "./events";
import { useRerender as u } from "./utils";

export const createState = s;
export const createEvent = c;
export const useRerender = u;