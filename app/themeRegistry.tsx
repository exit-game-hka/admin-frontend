"use client";
import {PropsWithChildren, useState} from "react";
import createCache, {Options} from "@emotion/cache";
import {useServerInsertedHTML} from "next/navigation";
import {CacheProvider} from "@emotion/react";
import {CssVarsProvider} from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import {extendTheme} from "@mui/joy";

type PropsThemeRegistry = PropsWithChildren & {
    options: Options;
};
export default function ThemeRegistry(props: PropsThemeRegistry) {
    const { options, children } = props;

    const [{ cache, flush }] = useState(() => {
        const cache = createCache(options);
        cache.compat = true;
        const prevInsert = cache.insert;
        let inserted: string[] = [];
        cache.insert = (...args) => {
            const serialized = args[1];
            if (cache.inserted[serialized.name] === undefined) {
                inserted.push(serialized.name);
            }
            return prevInsert(...args);
        };
        const flush = () => {
            const prevInserted = inserted;
            inserted = [];
            return prevInserted;
        };
        return { cache, flush };
    });

    useServerInsertedHTML(() => {
        const names = flush();
        if (names.length === 0) {
            return null;
        }
        let styles = "";
        for (const name of names) {
            styles += cache.inserted[name];
        }
        return (
            <style
                key={cache.key}
                data-emotion={`${cache.key} ${names.join(" ")}`}
                dangerouslySetInnerHTML={{
                    __html: styles,
                }}
            />
        );
    });

    return (
        <CacheProvider value={cache}>
            {/*<CssVarsProvider theme={theme}>*/}
            <CssVarsProvider
                defaultMode="system"
                theme={deepPurpleTheme}
            >
                {/* the custom theme is optional */}
                <CssBaseline />
                {children}
            </CssVarsProvider>
        </CacheProvider>
    );
};

const deepPurpleTheme = extendTheme({
    "colorSchemes": {
        "light": {
            "palette": {
                "primary": {
                    50: '#ece7f1',
                    100: '#d1c3dd',
                    200: '#b29bc6',
                    300: '#9373af',
                    400: '#7b559d',
                    500: '#64378c',
                    600: '#5c3184',
                    700: '#522a79',
                    800: '#48236f',
                    900: '#36165c',
                }
            }
        },
        "dark": {
            "palette": {
                "primary": {
                    "50": "#f8fafc",
                    "100": "#f1f5f9",
                    "200": "#e2e8f0",
                    "300": "#cbd5e1",
                    "400": "#94a3b8",
                    "500": "#673ab7",
                    "600": "#5e35b1",
                    "700": "#334155",
                    "800": "#1e293b",
                    "900": "#492d78"
                }
            }
        }
    }
});