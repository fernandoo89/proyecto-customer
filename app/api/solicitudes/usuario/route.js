import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

// GET /api/solicitudes/usuario?usuario_id=3
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const usuario_id = searchParams.get("usuario_id");

  if (!usuario_id) {
    return new Response(JSON.stringify({ error: "Falta usuario_id" }), { status: 400 });
  }
  try {
    const result = await pool.query(
      `SELECT id, direccion, tipo_limpieza, fecha, hora, notas, estado, created_at
       FROM solicitudes
       WHERE usuario_id = $1
       ORDER BY created_at DESC`,
      [usuario_id]
    );
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Error al listar solicitudes" }), { status: 500 });
  }
}
