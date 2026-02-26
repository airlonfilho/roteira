import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import ClientLayout from "./components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Roteira - Seus roteiros de viagem em segundos",
  description: "Crie roteiros detalhados, otimizados e personalizados em segundos com Inteligência Artificial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-[#121212] text-white`} suppressHydrationWarning>
        {/* O Wrapper cuida da Sidebar e do scroll lateral */}
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
