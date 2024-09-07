## Getting Started

First, create a mini app, you can follow the guide at  [Telegram Mini Apps Guide](https://docs.telegram-mini-apps.com/platform/creating-new-app)

Copy `.env.example.` to `.env` and set the values

`DAPP_PRIVATE_KEY` is a random secret key generated using `nacl.box.keyPair()` command

```bash
yarn dev
```

You can use `ngrok` for local testing, and set the URL of ngrok as your mini-app url