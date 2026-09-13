import { Jost, Poppins } from "next/font/google";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata = {
  title: "Scepter | Premium Furniture in Malawi",
  description: "Malawian furniture and interior design company.",
  icons: {
    icon: "/brand/mark.png",
    apple: "/brand/mark.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${jost.variable} ${poppins.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
