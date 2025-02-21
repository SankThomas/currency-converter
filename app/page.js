import CurrencyConverter from "@/components/currencyconverter";
import { ModeToggle } from "@/components/modetoggle";
import React from "react";

export default function Home() {
  return (
    <div>
      <ModeToggle />
      <CurrencyConverter />
    </div>
  );
}
