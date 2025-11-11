"use client";

import { Button } from "@pkg/ui-web";
import { ThemeToggle } from "../components/ThemeToggle";

export default function TestButtonPage() {
  return (
    <main className="min-h-screen bg-background text-foreground p-8">
      <ThemeToggle />
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Primitive Button Test</h1>
        
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Variants</h2>
          <div className="flex gap-3 flex-wrap">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="outline">Outline</Button>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Sizes</h2>
          <div className="flex gap-3 items-center flex-wrap">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">States</h2>
          <div className="flex gap-3 flex-wrap">
            <Button>Normal</Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">With Click Handler</h2>
          <Button onClick={() => alert("Button clicked!")}>
            Click Me
          </Button>
        </section>
      </div>
    </main>
  );
}

