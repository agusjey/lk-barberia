"use client";

import { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale/es";
import { supabase } from "@/lib/supabaseClient";

registerLocale("es", es);

const servicesList = [
  { id: "corte", name: "Corte Tradicional / Urbano", price: 17000, formattedPrice: "$17.000" },
  { id: "barba", name: "Barba & Perfilado", price: 7000, formattedPrice: "$7.000" },
  { id: "combo", name: "Combo Completo (Corte + Barba)", price: 22000, formattedPrice: "$22.000" },
];

// Feriados fijos de ejemplo
const holidays = [
  new Date(2026, 0, 1),   // 1 de Enero
  new Date(2026, 4, 1),   // 1 de Mayo
  new Date(2026, 4, 25),  // 25 de Mayo
  new Date(2026, 6, 9),   // 9 de Julio
  new Date(2026, 11, 25), // 25 de Diciembre
];

// Generador de horarios de 30 en 30 minutos
const generateTimeSlots = (startHour: number, startMinute: number, endHour: number, endMinute: number) => {
  const slots = [];
  let current = new Date();
  current.setHours(startHour, startMinute, 0, 0);

  const end = new Date();
  end.setHours(endHour, endMinute, 0, 0);

  while (current <= end) {
    const hours = current.getHours().toString().padStart(2, '0');
    const minutes = current.getMinutes().toString().padStart(2, '0');
    slots.push(`${hours}:${minutes}`);
    current.setMinutes(current.getMinutes() + 30);
  }
  return slots;
};

const morningSlots = generateTimeSlots(8, 0, 12, 0);   // 08:00 a 12:00
const afternoonSlots = generateTimeSlots(16, 0, 20, 30); // 16:00 a 20:30

export default function BookingForm({ selectedService }: { selectedService?: string }) {
  const [selectedServiceObj, setSelectedServiceObj] = useState(servicesList[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState("");
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const isHoliday = (currentDate: Date) => {
    return holidays.some(holiday => 
      holiday.getDate() === currentDate.getDate() &&
      holiday.getMonth() === currentDate.getMonth() &&
      holiday.getFullYear() === currentDate.getFullYear()
    );
  };

  // Cada vez que cambia la fecha, consultamos a Supabase los turnos ya ocupados de forma segura
  useEffect(() => {
    async function fetchBookedTimes() {
      if (!date) {
        setBookedTimes([]);
        return;
      }

      setLoadingSlots(true);
      const formattedDateString = date.toISOString().split("T")[0];

      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("time, status")
          .eq("date", formattedDateString);

        if (error) {
          console.warn("No se pudieron cargar los turnos ocupados (es posible que la tabla 'bookings' no exista aún en Supabase):", error.message);
          setBookedTimes([]);
        } else if (data) {
          const occupied = data
            .filter((item: any) => item.status !== "Cancelado")
            .map((item: any) => item.time);
          setBookedTimes(occupied);
        }
      } catch (err) {
        console.warn("Error de red al conectar con Supabase:", err);
        setBookedTimes([]);
      } finally {
        setLoadingSlots(false);
      }
    }

    fetchBookedTimes();
    setTime(""); 
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date || !time) {
      alert("Por favor completá todos los campos.");
      return;
    }

    setLoading(true);
    const formattedDateString = date.toISOString().split("T")[0];

    try {
      // Validación doble de seguridad en Supabase antes de insertar
      const { data: existing, error: checkError } = await supabase
        .from("bookings")
        .select("id, status")
        .eq("date", formattedDateString)
        .eq("time", time);

      if (checkError) {
        alert("Error al verificar disponibilidad con la base de datos.");
        setLoading(false);
        return;
      }

      const activeBookings = existing?.filter((item: any) => item.status !== "Cancelado");
      if (activeBookings && activeBookings.length > 0) {
        alert("⚠️ Este horario acaba de ser ocupado por otro cliente. Por favor elegí otro.");
        setLoading(false);
        return;
      }

      // Insertar en Supabase
      const { error } = await supabase.from("bookings").insert([
        { 
          name, 
          phone, 
          service: selectedServiceObj.name, 
          price: selectedServiceObj.price, 
          date: formattedDateString, 
          time, 
          status: "Pendiente" 
        }
      ]);

      if (error) {
        alert("Error al guardar el turno: " + error.message);
        setLoading(false);
        return;
      }
    } catch (err) {
      alert("Ocurrió un error inesperado al conectar con el servidor.");
      setLoading(false);
      return;
    }

    setLoading(false);
    setSubmitted(true);

    const businessPhoneNumber = "5493445123456"; // Reemplazá con tu número real
    const prettyDate = date.toLocaleDateString("es-AR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const message = `¡Hola! 👋 Quiero confirmar mi turno en *LK Barbería*.\n\n` +
      `👤 *Cliente:* ${name}\n` +
      `📱 *Teléfono:* ${phone}\n` +
      `✂ *Servicio:* ${selectedServiceObj.name} (${selectedServiceObj.formattedPrice})\n` +
      `📅 *Fecha:* ${prettyDate}\n` +
      `⏰ *Hora:* ${time} hs\n\n` +
      `¡Quedo a la espera de la confirmación!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${businessPhoneNumber}?text=${encodedMessage}`, "_blank");
  };

  return (
    <section id="reservar" className="py-20 bg-neutral-950 text-white px-4 border-t border-neutral-900">
      <div className="max-w-3xl mx-auto space-y-10">
        
        <div className="text-center space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-yellow-500">
            Agenda Online
          </span>
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide">
            Reservá tu Turno
          </h2>
          <p className="text-gray-400 text-sm">
            Elegí tu servicio, fecha y horario de preferencia en pocos segundos.
          </p>
          <div className="w-12 h-1 bg-yellow-500 mx-auto rounded-full" />
        </div>

        {submitted ? (
          <div className="bg-neutral-900 border border-yellow-500/40 rounded-2xl p-8 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 rounded-full flex items-center justify-center text-3xl mx-auto">
              ✓
            </div>
            <h3 className="text-2xl font-bold text-white">¡Turno Solicitado con Éxito!</h3>
            <p className="text-gray-300 text-sm max-w-md mx-auto">
              Gracias <span className="text-yellow-500 font-semibold">{name}</span>. Se guardó en el sistema y se abrió WhatsApp con tus datos.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setName("");
                setPhone("");
                setDate(null);
                setTime("");
                setBookedTimes([]);
              }}
              className="mt-4 inline-block bg-yellow-500 text-black font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-yellow-400 transition cursor-pointer"
            >
              Reservar otro turno
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl backdrop-blur-sm">
            
            {/* SERVICIOS */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">
                Seleccioná el Servicio
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {servicesList.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setSelectedServiceObj(s)}
                    className={`p-4 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                      selectedServiceObj.id === s.id
                        ? "border-yellow-500 bg-yellow-500/10 text-white shadow-lg shadow-yellow-500/5"
                        : "border-neutral-800 bg-neutral-900 text-gray-400 hover:border-neutral-700 hover:text-gray-200"
                    }`}
                  >
                    <span className="font-semibold text-sm">{s.name}</span>
                    <span className="text-xs text-yellow-500 mt-2 font-bold">{s.formattedPrice}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* FECHA */}
            <div className="space-y-2 relative">
              <label className="block text-sm font-medium text-gray-300">
                Fecha
              </label>
              <DatePicker
                selected={date}
                onChange={(d: Date | null) => setDate(d)}
                locale="es"
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/aaaa"
                filterDate={(d: Date) => d.getDay() !== 0 && !isHoliday(d)}
                dayClassName={(d: Date) => (isHoliday(d) ? "holiday-day" : "")}
                calendarClassName="dark-calendar"
                wrapperClassName="w-full"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-500 transition"
                required
              />
            </div>

            {/* GRILLA DE HORARIOS */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">
                Horarios Disponibles {date ? `para el ${date.toLocaleDateString("es-AR")}` : "(Seleccioná una fecha primero)"}
              </label>

              {!date ? (
                <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl text-center text-sm text-gray-500">
                  Por favor elegí una fecha arriba para ver los turnos disponibles.
                </div>
              ) : loadingSlots ? (
                <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl text-center text-sm text-yellow-500 animate-pulse">
                  Cargando horarios...
                </div>
              ) : (
                <div className="space-y-4 bg-neutral-950 border border-neutral-800 rounded-xl p-4">
                  
                  {/* TURNO MAÑANA */}
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Mañana (08:00 a 12:00)</span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {morningSlots.map((slot) => {
                        const isBooked = bookedTimes.includes(slot);
                        const isSelected = time === slot;

                        return (
                          <button
                            type="button"
                            key={slot}
                            disabled={isBooked}
                            onClick={() => setTime(slot)}
                            className={`py-2 px-3 rounded-lg text-xs font-medium border transition ${
                              isBooked
                                ? "bg-red-950/40 border-red-900/60 text-red-400 cursor-not-allowed opacity-60 line-through"
                                : isSelected
                                ? "bg-yellow-500 text-black border-yellow-500 font-bold shadow-md shadow-yellow-500/20"
                                : "bg-neutral-900 border-neutral-800 text-gray-300 hover:border-yellow-500/50 hover:text-white cursor-pointer"
                            }`}
                          >
                            {slot} {isBooked && "(Ocupado)"}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <hr className="border-neutral-800 my-3" />

                  {/* TURNO TARDE */}
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Tarde (16:00 a 20:30)</span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {afternoonSlots.map((slot) => {
                        const isBooked = bookedTimes.includes(slot);
                        const isSelected = time === slot;

                        return (
                          <button
                            type="button"
                            key={slot}
                            disabled={isBooked}
                            onClick={() => setTime(slot)}
                            className={`py-2 px-3 rounded-lg text-xs font-medium border transition ${
                              isBooked
                                ? "bg-red-950/40 border-red-900/60 text-red-400 cursor-not-allowed opacity-60 line-through"
                                : isSelected
                                ? "bg-yellow-500 text-black border-yellow-500 font-bold shadow-md shadow-yellow-500/20"
                                : "bg-neutral-900 border-neutral-800 text-gray-300 hover:border-yellow-500/50 hover:text-white cursor-pointer"
                            }`}
                          >
                            {slot} {isBooked && "(Ocupado)"}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* DATOS DEL CLIENTE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Tu Nombre y Apellido
                </label>
                <input
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-500 transition"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Teléfono / WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="Ej. 3445..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-500 transition"
                  required
                />
              </div>
            </div>

            {/* BOTÓN FINAL */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold text-base py-3.5 rounded-xl transition-all shadow-lg shadow-yellow-500/20 cursor-pointer flex items-center justify-center gap-2 ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:from-yellow-400 hover:to-yellow-300'
                }`}
              >
                <span>{loading ? "Verificando disponibilidad..." : "Confirmar Reserva y Enviar WhatsApp"}</span>
              </button>
            </div>

          </form>
        )}
      </div>
    </section>
  );
}