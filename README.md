## Preview
![currency-converter]("./currency-converter.png")

## About

This currency converter app uses:
  1. The Exchange Rate API to get currencies.
  2. FlagCDN to get country flags and display them against their currencies.
  3. IpAPI to get the geographical location of the user in order to display their local currency on load.
  (NOTE: Should probably add an alert to inform the users about this).
  4. ShadCN UI to craft the UI.
  5. Next-themes for the dark/light/system mode toggle.

## How to run
1. Clone or download the repository
2. Go to [https://exchangerate-api.com](Exchange Rate API) to sign up for an API key.
3. In your workspace, create a `.env.local` file and add your API key in the following way:

```
NEXT_PUBLIC_EXCHANGE_RATE_API_KEY=your_api_key
```

Substitute `your_api_key` with your actual API key.

4. Run `pnpm install` (depending on your package manager) to install all dependencies.
5. Run `pnpm dev` to start the development server on `http://localhost:3000`
