---
description: Deploying with PostgreSQL on Render
---

1. **Create a PostgreSQL Database on Render**:
   - Go to your Render Dashboard.
   - Click **New +** and select **PostgreSQL**.
   - Give it a name (e.g., `visitors-db`).
   - Select the region (same as your Web Service).
   - Click **Create Database**.

2. **Get the Connection String**:
   - Once created, scroll down to the **Connections** section.
   - Copy the **Internal Database URL**. It looks like `postgres://user:password@hostname:port/database`.

3. **Configure Environment Variables**:
   - Go to your **Web Service** on Render.
   - Click on **Environment**.
   - Add a new Environment Variable:
     - Key: `DATABASE_URL`
     - Value: Paste the **Internal Database URL** you copied.

4. **Redeploy**:
   - Go to the **Events** or **Manual Deploy** section of your Web Service.
   - Trigger a new deployment (Clear build cache and deploy if possible, to ensure fresh dependencies).

5. **Verify**:
   - Visit your site's `/stats.html` page.
   - It should now be loading data from the persistent PostgreSQL database.
