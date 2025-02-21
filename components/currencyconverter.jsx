"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

const url = `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY}/latest/USD`;

export default function CurrencyConverter() {
  const [currencies, setCurrencies] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("USD"); // Fallback
  const [amount, setAmount] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCurrencies = async () => {
    try {
      const response = await axios.get(url);

      const currencyList = Object.keys(response.data.conversion_rates);

      setCurrencies(currencyList);
    } catch (error) {
      toast.error("Error getting exchange rates:", {
        description: error.message,
      });
    }
  };

  const detectUserCurrency = async () => {
    try {
      const response = await axios.get("https://ipapi.co/json/");
      setFrom(response.data.currency || "USD");
    } catch (error) {
      toast.error("Error detecting location:", {
        description: error.message,
      });
      setFrom("USD");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
    detectUserCurrency();
  }, []);

  const convertCurrency = async () => {
    if (!amount || amount <= 0) return;

    setLoading(true);

    try {
      const response = await axios.get(url);
      const rate = response.data.conversion_rates[to];
      setConvertedAmount((amount * rate).toFixed(2));
    } catch (error) {
      toast.error("Error converting currency:", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const getFlagUrl = (currency) => {
    const specialFlags = {
      XAF: "https://flagcdn.com/w40/cm.png", // Central African Franc (Cameroon)
      XCD: "https://flagcdn.com/w40/ag.png", // East Caribbean Dollar (Antigua & Barbuda)
      XDR: "https://static.currencyrate.today/f/flags/xdr.svg", // East Caribbean Dollar (Antigua & Barbuda)
      XOF: "https://currency.world/img/flags/tg.png",
      XPF: "https://flagpedia.net/data/flags/w580/pf.webp",
    };

    return (
      specialFlags[currency] ||
      `https://flagcdn.com/w40/${currency.slice(0, 2).toLowerCase()}.png`
    );
  };

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
  };

  useEffect(() => {
    if (from && to && amount > 0) {
      convertCurrency();
    }
  }, [from, to]);

  return (
    <div className="p-6 py-20">
      <Card className="mx-auto max-w-4xl p-6 shadow-none">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold">
            Currency converter
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-3">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1"
            />

            <div className="flex justify-between gap-3">
              <Select value={from} onValueChange={setFrom}>
                <SelectTrigger>
                  <Image
                    src={getFlagUrl(from)}
                    alt={from}
                    width={80}
                    height={80}
                    className="mr-2 inline-block size-6 object-contain"
                  />
                  <SelectValue>{from || "Select currency"}</SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {currencies.length > 0 ? (
                    currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        <Image
                          src={getFlagUrl(currency)}
                          alt={currency}
                          width={80}
                          height={80}
                          className="mr-2 inline-block size-6 object-contain"
                        />
                        {currency}
                      </SelectItem>
                    ))
                  ) : (
                    <CardDescription>Loading...</CardDescription>
                  )}
                </SelectContent>
              </Select>

              <Button onClick={swapCurrencies} variant="outline">
                <ArrowLeft className="size-6" /> Swap
              </Button>

              <Select value={to} onValueChange={setTo}>
                <SelectTrigger>
                  <Image
                    src={getFlagUrl(to)}
                    alt={to}
                    width={80}
                    height={80}
                    className="mr-2 inline-block size-6 object-contain"
                  />
                  <SelectValue>{to || "Select currency"}</SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {currencies.length > 0 ? (
                    currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        <Image
                          src={getFlagUrl(currency)}
                          alt={currency}
                          width={80}
                          height={80}
                          className="mr-2 inline-block size-6 object-contain"
                        />
                        {currency}
                      </SelectItem>
                    ))
                  ) : (
                    <CardDescription>Loading...</CardDescription>
                  )}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={convertCurrency} variant="default">
              {loading ? "Converting..." : "Convert"}
            </Button>

            {convertedAmount && (
              <CardDescription className="mt-12 text-center text-4xl font-normal text-neutral-800 dark:text-white">
                <span className="text-6xl font-bold">{amount}</span> {from} ={" "}
                <span>
                  <span className="text-6xl font-bold">{convertedAmount}</span>{" "}
                  {to}
                </span>
              </CardDescription>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
