export default function handler(request) {
  return new Response(JSON.stringify({ hello: "world", time: Date.now() }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
