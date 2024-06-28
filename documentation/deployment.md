# Deploy QS.AI with GitHub Action

## Features

- 3 environments: `dev`, `qa` (TODO) and `prod` (TODO). 
- Commit on `main` branch is deployed automatically to the `dev` environment.
- Promotion from `dev` to `qa` and then `prod` needs manual validation. (TODO)
- Database migration and Vercel deployment are done from GitHub actions.
- Preview deployment for PR

## Setting up Supabase
- Create an access token from https://supabase.com/dashboard/account/tokens
- Create a new project with a name in the format `qsai-{dev|qa|prod}-{location-short-code}`, for example, `qsai-dev-eu_central`
- Within this project, get the following secrets:
  - anon key
  - database password
  - supabase URL
  - project ID
  - service role key

## Setting up Vercel
- Create an access token from https://vercel.com/account/tokens
- Get the Vercel organization ID from https://vercel.com/quant-stack/~/settings (the Team ID section)
- Create a new project with a name in the format `qsai-{dev|qa|prod}`, for example, `qsai-dev`
- Connect it to an empty GitHub project then disconnect. (we need this step because Vercel does not support creating an empty project)
- Within this project, get the following secrets:
  - project ID
  - public URL of the project

## Setting up GitHub

- Create new repository secrets:
  - VERCEL_TOKEN: vercel access token
  - SUPABASE_ACCESS_TOKEN: Supabase access token
- Create a new environment `dev` with the following secrets:
  - VERCEL_ORG_ID: Vercel origanization ID
  - VERCEL_PROJECT_ID: Vercel project ID
  - NEXT_PUBLIC_SITE_URL: public URL of the `qsai-dev` project
  - NEXT_PUBLIC_SUPABASE_ANON_KEY: Anon key of `qsai-dev-eu_central` project
  - SUPABASE_SERVICE_ROLE_KEY: Service role key of `qsai-dev-eu_central`
  - NEXT_PUBLIC_SUPABASE_URL: Url to `qsai-dev-eu_central` project
  - SUPABASE_DB_PASSWORD: `qsai-dev-eu_central` database password
  - SUPABASE_PROJECT_ID: Project ID of `qsai-dev-eu_central`

- and following variables:
  - NEXT_PUBLIC_JUPYTERLITE_URL: URL to the JupyterLite deployment on Vercel

## TODO
  - Create `qa` and `prod` enviroments and enable deployment protection rules.
  - Update CI actions to deploy to `qa` and `prod`