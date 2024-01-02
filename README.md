# Semantic search plugin

This repo is for a mattermost plugin that utilizes semantic search to find topics discussed in the mattermost instance in which it is installed in.

## Installation

1. Clone the repo
```
git clone https://github.com/iCog-Labs-Dev/semantic-search-plugin.git
```
2. Copy environment variable
```
cp .env.example .env
```
3. Fill the environment variables with your credentials
```
MM_ADMIN_USERNAME="mm_username" # e.g. admin
MM_ADMIN_PASSWORD="mm_password" # e.g. 12345678
MM_SERVICESETTINGS_SITEURL="mm_url"  # e.g. http://localhost:8065 - mattermost server url
MM_PLUGIN_API_URL="ss_api_url" # e.g. http://localhost:5555 - backend server url
```
4. Generate plugin zip file
```
set -o allexport
source .env
set +o allexport
make deploy
```
5. Install plugin by uploading the output zip file to plugin section in mattermost system console
