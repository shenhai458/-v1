export const GET = () => {
  return new Response(JSON.stringify({ hello: "world", time: Date.now() }), {
    headers: { "Content-Type": "application/json" },
  });
};
