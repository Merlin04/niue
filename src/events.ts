import { DependencyList, useEffect } from "react";

let counter: number = 0;

const PREFIX = "niueevent";

export default function createEvent<T>(): [
    // Receiver
    (callback: (data: T) => void, deps: DependencyList) => void,
    // Emitter
    (data: T) => void
] {
    const eventName = PREFIX + counter;
    counter++;

    return [
        (callback, deps) => {
            useEffect(() => {
                const l = (e: Event) => {
                    callback((e as CustomEvent<T>).detail);
                };
                document.addEventListener(eventName, l);

                return () => {
                    document.removeEventListener(eventName, l);
                }
            }, deps);
        },
        (data) => {
            const e = new CustomEvent(eventName, {
                detail: data
            });
            document.dispatchEvent(e);
        }
    ]
}