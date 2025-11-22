import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

export async function POST(request) {
  try {
    const {
      nombre,
      apellido,
      tipo_documento,
      numero_documento,
      email,
      telefono,
      password,
      fecha_nacimiento,
      foto_url // Nuevo campo
    } = await request.json();

    const existe = await pool.query("SELECT id FROM usuarios WHERE email = $1", [email]);
    if (existe.rows.length > 0) {
      return new Response(JSON.stringify({ error: "El correo ya está registrado" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO usuarios (
        nombre, apellido, tipo_documento, numero_documento, email, telefono, password, rol, verificado, fecha_nacimiento, foto_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id, nombre, apellido, email, rol, verificado, foto_url;`,
      [
        nombre,
        apellido,
        tipo_documento,
        numero_documento,
        email,
        telefono,
        hashedPassword,
        "personal",
        true,
        fecha_nacimiento,
        foto_url || null
      ]
    );

    return new Response(JSON.stringify(result.rows[0]), { status: 201 });
  } catch (err) {
    console.error("Error al registrar personal:", err);
    return new Response(JSON.stringify({ error: "Error al registrar personal" }), { status: 500 });
  }
}
