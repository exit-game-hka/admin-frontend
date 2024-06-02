"use client";
import React, {PropsWithChildren} from 'react'

import {SessionProvider} from 'next-auth/react';

const SessionProviderWrapper: React.FC<PropsWithChildren> = (props) => {
    const { children } = props;

    return (
        <SessionProvider
            basePath="/exit-game-admin-dashboard/api/auth"
        >
            {children}
        </SessionProvider>
    );
};

export default SessionProviderWrapper;