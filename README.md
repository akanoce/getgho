# GetGho Monorepo 🌐
<img width="679" alt="projects_0ncgt_images_Screenshot 2024-01-19 alle 15 34 22" src="https://github.com/akanoce/getgho/assets/64158778/ee75a453-d714-46f8-826b-43b08817a08a">


Welcome to the GetGho Monorepo, where we are at the forefront of decentralized finance accessibility. GetGho is designed to redefine your DeFi experience, offering unparalleled ease in onboarding and transaction efficiency.

## 🚀 Innovative Onboarding and Transactional Features
GetGho stands out with its cutting-edge approach:

- **🔐 Wallet-Free Onboarding:** Engage with GetGho without a pre-existing crypto wallet. Utilizing advanced account abstraction and passkeys, we eliminate traditional barriers like mnemonic phrases.
- **💡 Simplified Transactions:** Experience batched account abstraction transactions. Execute multiple transactions in a single step with sponsored gas fees. Say goodbye to gas complexities and hello to a smooth DeFi journey.


## 🛠️ Run the Project

#### Generate the required api keys

Create a new `.env` from template using

```
cp .env.example .env
```

Generate the required api keys for the sepolia network from

https://dashboard.alchemy.com/apps
https://cloud.walletconnect.com/sign-in

and insert them in the new `.env`

```
VITE_ALCHEMY_KEY=
VITE_WALLET_CONNECT_PROJECT_ID=
```

### Setting up Turnkey

The first step is to set up your Turnkey organization and account. By following the [Quickstart](https://docs.turnkey.com/getting-started/quickstart) guide, you should have:

-   A public/private API key pair for Turnkey
-   An organization ID

Once you've gathered these values, add them to a new `.env.local` file. Notice that your API private key should be securely managed and **_never_** be committed to git.

```bash
$ cp .env.local.example .env.local
```

Now open `.env.local` and add the missing environment variables:

-   `VITE_API_PUBLIC_KEY`
-   `VITE_API_PRIVATE_KEY`
-   `VITE_TURNKEY_API_BASE_URL`
-   `VITE_ORGANIZATION_ID`

#### Run the project

```
yarn dev
```
