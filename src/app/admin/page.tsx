"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminDashboard() {
  // Estados de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  // Cargar turnos de Supabase
  const fetchAppointments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("date", selectedDate)
      .order("time", { ascending: true });

    if (!error && data) {
      setAppointments(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAppointments();
    }
  }, [selectedDate, isAuthenticated]);

  // Cambiar estado en Supabase
  const toggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Pendiente" ? "Completado" : "Pendiente";
    
    const { error } = await supabase
      .from("bookings")
      .update({ status: nextStatus })
      .eq("id", id);

    if (!error) {
      fetchAppointments();
    } else {
      alert("Error al actualizar el turno");
    }
  };

  // 🗑️ NUEVO: Eliminar turno de la base de datos
  const deleteAppointment = async (id: string, clientName: string) => {
    if (confirm(`¿Estás seguro de eliminar el turno de ${clientName}?`)) {
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", id);

      if (!error) {
        fetchAppointments();
      } else {
        alert("Error al eliminar el turno");
      }
    }
  };

  const totalMoney = appointments.reduce((acc, curr) => acc + (curr.price ?? 0), 0);
  const pendingCount = appointments.filter(a => a.status === "Pendiente").length;

  // 🔒 PANTALLA DE LOGIN SI NO ESTÁ AUTENTICADO
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 w-full max-w-sm space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-yellow-500">LK Barbería</span>
            <h2 className="text-xl font-bold">Panel de Administración</h2>
            <p className="text-xs text-gray-400">Ingresá tu contraseña para continuar</p>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (passwordInput === "laurik") {
                setIsAuthenticated(true);
              } else {
                alert("Contraseña incorrecta");
              }
            }}
            className="space-y-4"
          >
            <input
              type="password"
              placeholder="Contraseña"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-500 transition"
              required
            />
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition cursor-pointer text-sm"
            >
              Ingresar al Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 📊 PANEL DE ADMINISTRACIÓN COMPLETO
  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-yellow-500 selection:text-black">
      <header className="border-b border-neutral-900 bg-neutral-900/40 backdrop-blur-md sticky top-0 z-10 px-6 py-4 flex justify-between items-center max-w-6xl mx-auto">
        <h1 className="font-bold tracking-wider uppercase text-sm text-yellow-500">LK Barbería — Panel Admin</h1>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white [color-scheme:dark]"
          />
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-xs bg-neutral-900 border border-neutral-800 hover:border-red-500/50 hover:text-red-400 px-3 py-1.5 rounded-xl transition cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* ESTADÍSTICAS REALES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 shadow-lg">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Total Turnos (Día)</span>
            <p className="text-3xl font-bold mt-2">{appointments.length}</p>
          </div>
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 shadow-lg">
            <span className="text-xs text-yellow-500 uppercase tracking-wide">Pendientes</span>
            <p className="text-3xl font-bold text-yellow-500 mt-2">{pendingCount}</p>
          </div>
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 shadow-lg">
            <span className="text-xs text-green-400 uppercase tracking-wide">Recaudación Estimada</span>
            <p className="text-3xl font-bold text-green-400 mt-2">${totalMoney.toLocaleString("es-AR")}</p>
          </div>
        </div>

        {/* LISTA DINÁMICA */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            Turnos para el día {selectedDate}
          </h2>

          {loading ? (
            <p className="text-center text-gray-500 py-10">Cargando turnos...</p>
          ) : appointments.length > 0 ? (
            appointments.map((app) => (
              <div key={app.id} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-base text-white">{app.name}</h3>
                    <span className="text-xs font-mono bg-neutral-800 px-2.5 py-0.5 rounded text-yellow-400 border border-neutral-700">
                      {app.time} hs
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {app.service} • <span className="text-green-400 font-semibold">${app.price?.toLocaleString("es-AR")}</span> • Tel: {app.phone}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button 
                    onClick={() => toggleStatus(app.id, app.status)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      app.status === "Completado" 
                        ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30" 
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30"
                    }`}
                  >
                    {app.status}
                  </button>

                  <button 
                    onClick={() => deleteAppointment(app.id, app.name)}
                    className="p-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-xl transition cursor-pointer text-xs"
                    title="Eliminar turno"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-10 bg-neutral-900/30 border border-neutral-900 rounded-2xl">
              No hay turnos agendados para esta fecha.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}