# QS.AI Platform

## Deployment

See [deployment document](./documentation/deployment.md)

## Contributing to QS.AI

### Set up environment

- **Install dependencies**

Ensure you have [pnpm](https://pnpm.io/installation) installed and run:

```bash
pnpm install
```

- **Set up `Supabase` locally**

First, you will need to install [Docker](https://www.docker.com/get-started/), then you can start supabase with:

```bash
pnpm supabase:start
```

The terminal output will provide URLs to access the different services within the Supabase stack. The Supabase Studio is where you can create new users or make changes to your local database instance

Rename `.env.local.example` to `.env.local` and update it with the values from the terminal output. You can print out these values at any time with the following command:

```bash
pnpm supabase:status
```

### Configure Auth

Follow [this guide](https://supabase.com/docs/guides/auth/social-login/auth-github) to set up an OAuth app with GitHub and save the client id and secret key.

Rename `.env.example` to `.env` and update `SUPABASE_AUTH_EXTERNAL_GITHUB_CLIENT_ID` and `SUPABASE_AUTH_EXTERNAL_GITHUB_SECRET` with the saved data from the previous step.

Restart Supabase with

```bash
pnpm supabase:restart
```

### Configure Storage

Go to [Supabase Studio](http://127.0.0.1:54323/project/default/storage/buckets) and create a new bucket named `qsai`. Since with the local instance, `Supabase` does not support role-based access for S3 storage, we don't need to apply access policies.

### Run the Next.js client

Go to `qsai-jupyterlite` project and start serving the JupyterLite appllication with

```bash
# In qsai-jupyterlite repo
npm run serve
```

In a separate terminal, run the following command in the current project to start the development server:

```bash
pnpm dev
```

Then you should be able to log in with username and password created from the [Supabase Studio](http://127.0.0.1:54323/project/default/auth/users) interface.
