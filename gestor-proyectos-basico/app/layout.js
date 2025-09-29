import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Gestor de Proyectos (Básico)",
  description: "Next.js + React + fetch + mocks + auth simple",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <div className="container">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
