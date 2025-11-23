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
      personal_id,
      monto, // nuevo campo
    } = await req.json();

    if (!usuario_id || !direccion || !tipo_limpieza || !fecha || !hora || !personal_id || !monto) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Guarda el monto también
    const result = await pool.query(
      `INSERT INTO solicitudes
        (usuario_id, direccion, tipo_limpieza, fecha, hora, notas, estado, created_at, personal_id, monto)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8, $9)
        RETURNING id, usuario_id, direccion, tipo_limpieza, fecha, hora, estado, personal_id, monto;`,
      [
        usuario_id,
        direccion,
        tipo_limpieza,
        fecha,
        hora,
        notas || "",
        "pendiente",
        personal_id,
        monto,
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
