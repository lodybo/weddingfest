# Remix Blues Stack

![The Remix Blues Stack](https://repository-images.githubusercontent.com/461012689/37d5bd8b-fa9c-4ab0-893c-f0a199d5012d)

Learn more about [Remix Stacks](https://remix.run/stacks).

```
npx create-remix --template remix-run/blues-stack
```

## What's in the stack

- [Multi-region Fly app deployment](https://fly.io/docs/reference/scaling/) with [Docker](https://www.docker.com/)
- [Multi-region Fly PostgreSQL Cluster](https://fly.io/docs/getting-started/multi-region-databases/)
- Healthcheck endpoint for [Fly backups region fallbacks](https://fly.io/docs/reference/configuration/#services-http_checks)
- [GitHub Actions](https://github.com/features/actions) for deploy on merge to production and staging environments
- Email/Password Authentication with [cookie-based sessions](https://remix.run/docs/en/v1/api/remix#createcookiesessionstorage)
- Database ORM with [Prisma](https://prisma.io)
- Styling with [Tailwind](https://tailwindcss.com/)
- End-to-end testing with [Cypress](https://cypress.io)
- Local third party request mocking with [MSW](https://mswjs.io)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

Not a fan of bits of the stack? Fork it, change it, and use `npx create-remix --template your/repo`! Make it your own.

## Quickstart

Click this button to create a [Gitpod](https://gitpod.io) workspace with the project set up, Postgres started, and Fly pre-installed

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/from-referrer/)

## Development

- This step only applies if you've opted out of having the CLI install dependencies for you:

  ```sh
  npx remix init
  ```

- Start the Postgres Database in [Docker](https://www.docker.com/get-started):

  ```sh
  npm run docker
  ```

  > **Note:** The npm script will complete while Docker sets up the container in the background. Ensure that Docker has finished and your container is running before proceeding.

- Initial setup:

  ```sh
  npm run setup
  ```

- Run the first build:

  ```sh
  npm run build
  ```

- Start dev server:

  ```sh
  npm run dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

The database seed script creates a new user with some data you can use to get started:

- Email: `rachel@remix.run`
- Password: `racheliscool`

If you'd prefer not to use Docker, you can also use Fly's Wireguard VPN to connect to a development database (or even your production database). You can find the instructions to set up Wireguard [here](https://fly.io/docs/reference/private-networking/#install-your-wireguard-app), and the instructions for creating a development database [here](https://fly.io/docs/reference/postgres/).

### Relevant code:

This is a pretty simple note-taking app, but it's a good example of how you can build a full stack app with Prisma and Remix. The main functionality is creating users, logging in and out, and creating and deleting notes.

- creating users, and logging in and out [./app/models/user.server.ts](./app/models/user.server.ts)
- user sessions, and verifying them [./app/session.server.ts](./app/session.server.ts)
- creating, and deleting notes [./app/models/note.server.ts](./app/models/note.server.ts)

## Deployment

This application is designed to be deployed on a VPS (Virtual Private Server) with Nginx as a reverse proxy and caching layer.

### Prerequisites

- A VPS with Ubuntu 20.04+ or similar Linux distribution
- Node.js 18+ installed
- PostgreSQL database
- Nginx installed
- Domain name pointing to your VPS

### Step 1: Server Setup

1. **Install dependencies on your VPS:**

   ```sh
   # Install Node.js (if not already installed)
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PostgreSQL (if not already installed)
   sudo apt-get install postgresql postgresql-contrib

   # Install Nginx
   sudo apt-get install nginx
   ```

2. **Clone your repository:**

   ```sh
   cd /var/www
   git clone <your-repo-url> weddingfest
   cd weddingfest
   ```

3. **Install project dependencies:**

   ```sh
   npm install
   ```

### Step 2: Database Setup

1. **Create PostgreSQL database:**

   ```sh
   sudo -u postgres psql
   CREATE DATABASE weddingfest;
   CREATE USER weddingfest_user WITH ENCRYPTED PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE weddingfest TO weddingfest_user;
   \q
   ```

2. **Set up environment variables:**

   Create a `.env` file in your project root:

   ```sh
   NODE_ENV=production
   PORT=3000
   DATABASE_URL="postgresql://weddingfest_user:your_secure_password@localhost:5432/weddingfest"
   SESSION_SECRET="$(openssl rand -hex 32)"
   STRIPE_SECRET_KEY="your_stripe_secret_key"
   STRIPE_PUBLISHABLE_KEY="your_stripe_publishable_key"
   STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"
   SENDGRID_API_KEY="your_sendgrid_api_key"
   ```

3. **Run database migrations:**

   ```sh
   npm run setup
   ```

### Step 3: Build the Application

```sh
npm run build
```

### Step 4: Configure Process Manager (PM2)

1. **Install PM2 globally:**

   ```sh
   sudo npm install -g pm2
   ```

2. **Start your application:**

   ```sh
   pm2 start npm --name "weddingfest" -- start
   ```

3. **Configure PM2 to start on boot:**

   ```sh
   pm2 save
   pm2 startup
   ```

   Follow the instructions PM2 provides to enable startup on boot.

**Alternative: Using Systemd**

If you prefer systemd over PM2, create a service file:

```sh
sudo nano /etc/systemd/system/weddingfest.service
```

Add the following content:

```ini
[Unit]
Description=Weddingfest Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/weddingfest
Environment=NODE_ENV=production
Environment=PORT=3000
EnvironmentFile=/var/www/weddingfest/.env
ExecStart=/usr/bin/node /var/www/weddingfest/build/server.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Then enable and start the service:

```sh
sudo systemctl enable weddingfest
sudo systemctl start weddingfest
sudo systemctl status weddingfest
```

### Step 5: Configure Nginx

1. **Create Nginx configuration:**

   ```sh
   sudo nano /etc/nginx/sites-available/weddingfest
   ```

2. **Add the following configuration:**

   ```nginx
   # Proxy cache for optimized images
   proxy_cache_path /var/cache/nginx/images levels=1:2 keys_zone=images:10m max_size=1g inactive=7d;

   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       # Proxy cache for dynamically resized images
       # This prevents your Node.js app from processing the same image multiple times
       location /image/ {
           proxy_pass http://localhost:3000;
           proxy_cache images;
           proxy_cache_valid 200 7d;
           proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
           proxy_cache_lock on;
           add_header X-Cache-Status $upstream_cache_status;
       }

       # Main application proxy
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Enable the site:**

   ```sh
   sudo ln -s /etc/nginx/sites-available/weddingfest /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Step 6: Set up SSL with Let's Encrypt

1. **Install Certbot:**

   ```sh
   sudo apt-get install certbot python3-certbot-nginx
   ```

2. **Obtain SSL certificate:**

   ```sh
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

3. **Certbot will automatically configure Nginx to use SSL and set up auto-renewal.**

### Image Processing and Caching

This application uses a streaming-based image resizing approach that keeps memory usage constant regardless of traffic:

- **Dynamic Resizing:** Images are resized on-the-fly using Sharp (libvips)
- **True Streaming:** Images are streamed directly from disk → Sharp → response without buffering in memory
- **Nginx Caching:** Nginx caches processed images for 7 days, so repeat requests never hit your Node.js app
- **Browser Caching:** Images are cached in browsers for 1 year via Cache-Control headers

**Memory Usage:** ~10-20MB per concurrent image request (Sharp's internal buffers only)

### Monitoring and Maintenance

**View application logs:**

With PM2:
```sh
pm2 logs weddingfest
```

With Systemd:
```sh
sudo journalctl -u weddingfest -f
```

**Restart application:**

With PM2:
```sh
pm2 restart weddingfest
```

With Systemd:
```sh
sudo systemctl restart weddingfest
```

**Deploy updates:**

```sh
cd /var/www/weddingfest
git pull
npm install
npm run build
pm2 restart weddingfest  # or: sudo systemctl restart weddingfest
```

### Troubleshooting

**Check if the app is running:**
```sh
curl http://localhost:3000/healthcheck
```

**Check Nginx error logs:**
```sh
sudo tail -f /var/log/nginx/error.log
```

**Check disk space (for image cache):**
```sh
df -h
du -sh /var/cache/nginx/images
```

**Clear Nginx image cache if needed:**
```sh
sudo rm -rf /var/cache/nginx/images/*
sudo systemctl reload nginx
```

## GitHub Actions

We use GitHub Actions for continuous integration and deployment. Anything that gets into the `main` branch will be deployed to production after running tests/build/etc. Anything in the `dev` branch will be deployed to staging.

## Testing

### Cypress

We use Cypress for our End-to-End tests in this project. You'll find those in the `cypress` directory. As you make changes, add to an existing file or create a new file in the `cypress/e2e` directory to test your changes.

We use [`@testing-library/cypress`](https://testing-library.com/cypress) for selecting elements on the page semantically.

To run these tests in development, run `npm run test:e2e:dev` which will start the dev server for the app as well as the Cypress client. Make sure the database is running in docker as described above.

We have a utility for testing authenticated features without having to go through the login flow:

```ts
cy.login();
// you are now logged in as a new user
```

We also have a utility to auto-delete the user at the end of your test. Just make sure to add this in each test file:

```ts
afterEach(() => {
  cy.cleanupUser();
});
```

That way, we can keep your local db clean and keep your tests isolated from one another.

### Vitest

For lower level tests of utilities and individual components, we use `vitest`. We have DOM-specific assertion helpers via [`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.
