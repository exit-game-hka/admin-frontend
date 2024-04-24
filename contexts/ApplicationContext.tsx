"use client";
import React, {createContext, PropsWithChildren} from "react";

type ContextOutput = {}

// @ts-ignore
export const ApplicationContext = createContext<ContextOutput>({});

type Props = Readonly<PropsWithChildren>;

export const ApplicationContextProvider: React.FC<Props> = (props: Props) => {
    const { children } = props;

    return (
        <ApplicationContext.Provider value={{}}>
            {children}
        </ApplicationContext.Provider>
    )
};

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------