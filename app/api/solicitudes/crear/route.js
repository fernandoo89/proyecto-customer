import { Pool } from "pg";
import { NextResponse } from "next/server";

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "limpieza-db",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export async function POST(req) {
  try {
    const {
      usuario_id,
      direccion,
      tipo_limpieza,
      fecha,
      hora,
      notas,
    } = await req.json();

    // Validar campos requeridos
    if (!usuario_id || !direccion || !tipo_limpieza || !fecha || !hora) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Insertar solicitud
    const result = await pool.query(
      `INSERT INTO solicitudes
        (usuario_id, direccion, tipo_limpieza, fecha, hora, notas, estado, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING id, usuario_id, direccion, tipo_limpieza, fecha, hora, estado;`,
      [
        usuario_id,
        direccion,
        tipo_limpieza,
        fecha,
        hora,
        notas || "",
        "pendiente",
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error("Error en crear solicitud:", err);
    return NextResponse.json(
      { error: "Error al crear solicitud: " + err.message },
      { status: 500 }
    );
  }
}
