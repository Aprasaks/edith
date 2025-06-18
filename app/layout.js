import "./globals.css";

export const metadata = {
  title: "DemianDev Docs",
  description: "개발 문서와 가이드를 제공하는 사이트",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}