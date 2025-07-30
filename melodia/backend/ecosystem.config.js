module.exports = {
  apps : [{
    name   : "noisely",
    script : "./server.js",
    env: {
      NODE_ENV: "production",
      PORT: 80,
      JWT_SECRET: "rahasia",
      GEMINI_API_KEY: "AIzaSyA_a27EaTFpviamWCULcKAH21cSpiA2rKg",
      EMAIL_SERVICE: "gmail",
      EMAIL_USER: "rizkaayunda1798@gmail.com",
      EMAIL_PASS: "toaynppkhxhgbzyt",
      FRONTEND_URL: "http://localhost:5173/",
      DB_PASSWORD: "78bN04GcYOSIWfK2",
      SUPABASE_DATABASE_URL: "postgresql://postgres.wlikpeiispsmhhjobhna:78bN04GcYOSIWfK2@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
    }   
  }]
}

