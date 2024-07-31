"use client";
import React, {PropsWithChildren} from 'react'

import {SessionProvider} from 'next-auth/react';
import {getServerSession} from "next-auth";

const SessionProviderWrapper: React.FC<PropsWithChildren> = (props) => {
    const { children } = props;

    return (
        <SessionProvider
            // Re-fetch session every 30 minutes
            refetchInterval={30 * 60}
            basePath={`${process.env.NEXT_PUBLIC_BASE_PATH}/api/auth`}
            refetchOnWindowFocus={true}
        >
            {children}
        </SessionProvider>
    );
};

export default SessionProviderWrapper;