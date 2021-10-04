import { createContext, useContext, useMemo, createElement } from "react";
import createEvent, { NiueEventResult } from "./events";
import { useRerender } from "./utils";

type DB = {
    // We could add a type parameter here but using any makes TypeScript stuff easier
    [zoneId: number]: any
};

//const db: DB = {};
//const trackStore: DB = {};
//let counter: number = 0;

export default function createState<T>(initialValue: T) {
    const db: DB = {};
    const trackStore: DB = {};

    let zoneCounter: number = 0;
    const ZoneContext = createContext(zoneCounter);

    const events: NiueEventResult<{
        changed: (keyof T)[]
    }>[] = [];

    const ensureStoreExists = (zone: number) => {
        if(db[zone] === undefined) {
            db[zone] = Object.assign({}, initialValue);
            trackStore[zone] = Object.assign({}, initialValue);
            events[zone] = createEvent();
        }
    };

    const useState: (keys?: (keyof T)[] | null) => T = (keys) => {
        const zone = useContext(ZoneContext);
        ensureStoreExists(zone);
        if(keys !== null) {
            const rerender = useRerender();
            events[zone].useReceiver(({changed}) => {
                if(!keys || changed.some(k => keys.includes(k))) {
                    rerender();
                }
            }, []);    
        }
        return db[zone];
    };

    const setState: (state?: Partial<T>, zone?: number) => void = (state, zone = 0) => {
        ensureStoreExists(zone);
        const changed = Object.entries(state ?? db[zone]).filter(([key, val]) => val !== trackStore[zone][key]).map(([key]) => key) as (keyof T)[];
        // Clone so future edits to the object are tracked separately
        if(changed.length > 0) {
            if(state) {
                if(Object.keys(state).length < Object.keys(db[zone]).length) {
                    // Patch instead of replacing the state
                    for(const prop in state) {
                        db[zone][prop] = state[prop];
                        trackStore[zone][prop] = state[prop];
                    }
                }
                else {
                    db[zone] = state;
                    trackStore[zone] = Object.assign({}, state);    
                }
            }
            else {
                trackStore[zone] = Object.assign(db[zone]);
            }
        }
        events[zone].emit({ changed });
    };

    const useSetState: () => (state?: Partial<T>) => void = () => {
        const zone = useContext(ZoneContext);
        return (state) => setState(state, zone);
    };

    const Zone = ({ children }: {
        children: React.ReactNode
    }) => {
        const zoneId = useMemo(() => {
            zoneCounter++;
            return zoneCounter;
        }, []);

        return createElement(ZoneContext.Provider, {
            value: zoneId
        }, children);
    };

    return {
        useState,
        setState,
        useSetState,
        Zone
    };
}