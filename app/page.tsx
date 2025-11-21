export default function Home() {
  return (
    <main className="min-h-screen bg-hero-pattern">
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/" className="text-3xl font-extrabold text-purple-600">PeruLimpio</a>
        </div>
        <nav className="flex items-center gap-6 text-gray-600">
          <a href="#" className="hover:text-purple-600">Nosotros</a>
          <a href="#" className="hover:text-purple-600">Beneficios</a>
          <div className="flex items-center gap-3 ml-4">
            <a href="/registro" className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 font-semibold">Registrar</a>
            <a href="/login" className="px-4 py-2 border border-purple-300 rounded-full text-purple-600 hover:bg-purple-50">Iniciar sesión</a>
          </div>
        </nav>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-purple-600 leading-tight">
            Conecta con Nosotros independientes en
            limpieza cerca de ti
          </h1>
          <p className="text-gray-600 text-lg max-w-xl">
            Reserva servicio de limpieza en minutos. Profesionales verificadas,
            precios claros y reservas flexibles.
          </p>

          <div className="mt-6">
            <a href="/solicitar" className="inline-block bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 font-semibold">
              Reservar
            </a>
          </div>
          
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="w-full max-w-lg">
            <img
              src="https://www.jover-abogados.com/wp-content/uploads/2023/02/subrogacion-personal-servicio-limpieza.jpg"
              alt="Imagen hero (sustituir por la imagen que vas a dar)"
              className="w-full h-72 sm:h-96 rounded-lg shadow-2xl object-cover object-center"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
