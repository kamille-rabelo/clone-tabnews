import React from "react";

export const metadata = {
  title: "Tabnews",
  description: "Clone of Tabnews",
};

function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

export default RootLayout;
