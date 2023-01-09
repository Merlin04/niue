import { createEvent } from "./events";
import { useRerender } from "./utils";

export const createState = <T extends object>(initialValue: T): [
    // Consumer hook
    (keys?: (keyof T)[] | null) => T,
    // Patcher
    (patch?: Partial<T> | (keyof T)[], changed?: (keyof T)[]) => void,
    // Get state (not hook)
    () => T
] => {
    let db = initialValue;
    let trackStore = {...initialValue};

    const [useReceiver, emitter] = createEvent<(keyof T)[]>();

    return [
        (keys) => {
            if(keys !== null) {
                const rerender = useRerender();
                useReceiver((changed) => {
                    if(!keys || changed.some(k => keys.includes(k))) {
                        rerender();
                    }
                }, []);    
            }
            return db;
        },
        (patch, changed) => {
            if(Array.isArray(patch)) {
                changed = patch;
                patch = undefined;
            }

            if(patch) {
                // apply patch to db
                for(const prop in patch) {
                    db[prop] = patch[prop]!;
                }
            }

            changed ??= (
                Object.entries(db)
                    .filter(([key, val]) => val !== trackStore[key as keyof T])
                    .map(([key]) => key)
            ) as (keyof T)[];

            // update the trackStore so we can track future changes
            // (notably, this won't add any imperative changes that weren't in user-provided
            //  `changed` to the trackStore, so they can still be dispatched later)
            for(const prop of changed) {
                trackStore[prop] = db[prop];
            }

            emitter(changed);
        },
        () => db
    ];
};
