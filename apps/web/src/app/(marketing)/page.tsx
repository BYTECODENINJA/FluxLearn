// STAGED - a token check page. The real marketing home page replaces it later.
import type { ReactElement } from "react";

import { LogoMark } from "@/components/brand/logo_mark";

const swatches = [
  { name: "Primary", className: "bg-primary text-primary-foreground" },
  { name: "Accent", className: "bg-accent text-accent-foreground" },
  { name: "Indigo", className: "bg-indigo text-white" },
  { name: "Muted", className: "bg-muted text-muted-foreground" },
];

export default function HomePage(): ReactElement {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center gap-8 px-4 py-16">
      <LogoMark />
      <h1 className="font-serif text-4xl font-bold sm:text-5xl">
        School operations, beautifully simple.
      </h1>
      <p className="text-muted-foreground text-lg">
        Lexend for the interface, Merriweather for headlines,{" "}
        <span className="font-mono">Ubuntu Mono</span> for IDs.
      </p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {swatches.map((s) => (
          <li
            key={s.name}
            className={`${s.className} rounded-lg p-4 text-sm font-medium`}
          >
            {s.name}
          </li>
        ))}
      </ul>
    </main>
  );
}
