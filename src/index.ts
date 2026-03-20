import "dotenv/config";
import app from "./app";

// 本地开发监听端口
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// Vercel Serverless 需要 export default
export default app;
