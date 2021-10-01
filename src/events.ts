import { DependencyList, useEffect } from "react";

let counter: number = 0;

const PREFIX = "niueevent";

export type NiueEventResult<T> = {
    useReceiver: (callback: (data: T) => void, deps: DependencyList) => void,
    emit: (data: T) => void
};

export default function createEvent<T>(): NiueEventResult<T> {
    const eventName = PREFIX + counter;
    counter++;

    return {
        useReceiver(callback, deps) {
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
        emit(data) {
            const e = new CustomEvent(eventName, {
                detail: data
            });
            document.dispatchEvent(e);
        }
    };
}