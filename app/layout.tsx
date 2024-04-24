import type {Metadata} from "next";
import "./globals.css";
import React, {PropsWithChildren} from "react";
import "@fontsource/inter";
import {ApplicationContainer} from "@/components/ApplicationContainer";

export const metadata: Metadata = {
  title: "Admin Dashboard - Exit Game HKA",
  description: "Admin Dashboard - Exit Game HKA",
  icons: "./favicon.ico",
};

type Props = Readonly<PropsWithChildren>;

const RootLayout: React.FC<Props> = (props: Props) => {
  const { children } = props;

  return (
      <html lang="de">
      <body>
      <ApplicationContainer>{children}</ApplicationContainer>
      </body>
      </html>
  );
}

export default RootLayout;
