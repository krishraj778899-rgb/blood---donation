# LifeDrop - Render Deployment

## Render settings
- Environment: Node
- Root Directory: leave EMPTY (the repository root)
- Build Command: `npm install`
- Start Command: `npm start`

## Environment Variables
Set:
- `MONGO_URI` = your MongoDB connection string

`PORT` is optional on Render because Render provides it automatically.

The frontend and backend are served by the same Node/Express service. Donor registration uses `/api/donors`, not `localhost:5000`.

## Important
Do not commit your real `.env` file or MongoDB password to GitHub.
