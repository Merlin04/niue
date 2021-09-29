import createEvent from "./events";
import { useRerender } from "./utils";

type DB = {
    [key: number]: any
};

const db: DB = {};
const trackStore: DB = {};
let counter: number = 0;

export default function createState<T>(initialValue: T): [
    // Consumer hook
    (keys?: (keyof T)[] | null) => T,
    // Patcher
    (state?: Partial<T>) => void
] {
    const id = counter;
    counter++;
    db[id] = initialValue;
    trackStore[id] = initialValue;

    const [useReceiver, emitter] = createEvent<{
        changed: (keyof T)[]
    }>();

    return [
        (keys) => {
            if(keys !== null) {
                const rerender = useRerender();
                useReceiver(({changed}) => {
                    if(!keys || changed.some(k => keys.includes(k))) {
                        rerender();
                    }
                }, []);    
            }
            return db[id];
        },
        (state) => {
            const changed = Object.entries(state ?? db[id]).filter(([key, val]) => val !== trackStore[id][key]).map(([key]) => key) as (keyof T)[];
            // Clone so future edits to the object are tracked separately
            if(changed.length > 0) {
                if(state) {
                    if(Object.keys(state).length < Object.keys(db[id]).length) {
                        // Patch instead of replacing the state
                        for(const prop in state) {
                            db[id][prop] = state[prop];
                            trackStore[id][prop] = state[prop];
                        }
                    }
                    else {
                        db[id] = state;
                        trackStore[id] = Object.assign({}, state);    
                    }
                }
                else {
                    trackStore[id] = Object.assign(db[id]);
                }
            }
            emitter({ changed });
        }
    ];
}