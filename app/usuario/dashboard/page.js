"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UsuarioDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    direccion: "",
    tipo_limpieza: "Profunda",
    fecha: "",
    hora: "",
    notas: "",
  });
  const [solicitudes, setSolicitudes] = useState([]);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(true);

  // Obtener usuario logueado
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  // Cargar solicitudes del usuario
  useEffect(() => {
    if (!user) return;
    setLoadingSolicitudes(true);
    fetch(`/api/solicitudes/usuario?usuario_id=${user.id}`)
      .then(r => r.json())
      .then(setSolicitudes)
      .finally(() => setLoadingSolicitudes(false));
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // NUEVO handle: solo guarda los datos y redirige, NO fetch
  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("solicitudPendiente", JSON.stringify(form));
    router.push("/solicitar/seleccionar-personal");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const cancelarSolicitud = async (id) => {
    alert("Funcionalidad para cancelar solicitud próximamente.");
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-teal-500 text-white p-6 text-center">
        <h1 className="text-4xl font-bold">¡Bienvenido, {user.nombre}! 👋</h1>
        <p className="text-lg mt-2">Solicita tu servicio de limpieza en minutos</p>
      </header>

      <div className="flex justify-end p-6">
        <button
          className="px-6 py-2 bg-red-500 text-white rounded font-semibold hover:bg-red-600"
          onClick={handleLogout}
        >
          Cerrar Sesión
        </button>
      </div>

      <main className="max-w-2xl mx-auto pb-8">
        {/* FORMULARIO */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-teal-500"
        >
          <div className="mb-6">
            <label className="block text-teal-600 font-semibold mb-2">
              Dirección:
            </label>
            <input
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Ej: Calle Principal 123"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-teal-600 font-semibold mb-2">
              Tipo de limpieza:
            </label>
            <select
              name="tipo_limpieza"
              value={form.tipo_limpieza}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="Profunda">Profunda</option>
              <option value="Ligera">Ligera</option>
              <option value="Desinfección">Desinfección</option>
              <option value="Mantenimiento">Mantenimiento</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-teal-600 font-semibold mb-2">
              Fecha:
            </label>
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-teal-600 font-semibold mb-2">
              Hora:
            </label>
            <input
              type="time"
              name="hora"
              value={form.hora}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-teal-600 font-semibold mb-2">
              Notas adicionales:
            </label>
            <textarea
              name="notas"
              value={form.notas}
              onChange={handleChange}
              placeholder="Ej. Tengo mascotas, limpiar cocina a fondo..."
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 h-24 resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-teal-500 text-white font-bold rounded hover:bg-teal-600 transition"
          >
            Solicitar limpieza
          </button>
        </form>

        {/* LISTA DE SOLICITUDES */}
        <h3 className="text-xl mt-12 mb-4 font-semibold border-b pb-2 text-teal-700">
          Mis Solicitudes de Limpieza
        </h3>
        {loadingSolicitudes ? (
          <div>Cargando solicitudes...</div>
        ) : (
          solicitudes.length === 0 ? (
            <div>No tienes solicitudes previas.</div>
          ) : (
            solicitudes.map((s) => (
              <div key={s.id} className="bg-white p-4 mb-4 rounded shadow border-l-4 border-teal-500">
                <div><b>Dirección:</b> {s.direccion}</div>
                <div><b>Tipo:</b> {s.tipo_limpieza}</div>
                <div><b>Fecha:</b> {s.fecha} <b>Hora:</b> {s.hora}</div>
                <div><b>Notas:</b> {s.notas || "—"}</div>
                <div><b>Estado:</b> {s.estado}</div>
                <div className="flex gap-2 mt-2">
                  {["pendiente", "confirmado"].includes(s.estado) && (
                    <button
                      onClick={() => cancelarSolicitud(s.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                    >
                      Cancelar
                    </button>
                  )}
                  {s.estado === "finalizado" && (
                    <button className="px-3 py-1 bg-yellow-500 text-white rounded text-sm" disabled>
                      Calificar
                    </button>
                  )}
                </div>
              </div>
            ))
          )
        )}
      </main>
    </div>
  );
}
