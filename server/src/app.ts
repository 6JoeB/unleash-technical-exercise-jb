import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import pino from "pino";
import { AddressSearch } from "./search";

const logger = pino();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 1000 * 60,
  max: 200
});
app.use(limiter);

const searcher = new AddressSearch();
searcher.loadSync();

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.get("/search/:q", (req, res) => {
  try {
    const raw = req.params.q || "";
    const q = raw.trim();
    if (q.length < 3) {
      return res.status(400).json({ error: "query must be at least 3 characters" });
    }

    const decoded = decodeURIComponent(q);
    const results = searcher.search(decoded, 20);
    return res.json(results);
  } catch (err) {
    logger.error(err, "search error");
    return res.status(500).json({ error: "internal error" });
  }
});

export default app;
