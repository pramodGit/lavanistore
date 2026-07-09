export default function releaseAll(...connections) {
  for (const conn of connections) {
    try { conn?.release(); } catch (_) {}
  }
}