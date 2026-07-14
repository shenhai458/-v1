// Minimal TypeScript catch-all test - no imports
export default function handler(req: any, res: any) {
  res.status(200).json({
    status: "ok",
    url: req.url,
    method: req.method,
  });
}
