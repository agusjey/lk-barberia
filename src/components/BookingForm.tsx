"use client";

import { useState } from "react";
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

const holidays = [
  new Date(2026, 4, 1), 
  new Date(2026, 4, 25), 
  new Date(2026, 6, 9), 
];

export default function BookingForm() {
  const [selectedServiceObj, setSelectedServiceObj] = useState(servicesList[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const isHoliday = (currentDate: Date) => {
    return holidays.some(holiday => 
      holiday.getDate() === currentDate.getDate() &&
      holiday.getMonth() === currentDate.getMonth() &&
      holiday.getFullYear() === currentDate.getFullYear()
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !date || !time) {
      alert("Por favor completá todos los campos.");
      return;
    }

    setLoading(true);
    const formattedDateString = date.toISOString().split("T")[0];

    // Validación de horarios ocupados en Supabase
    const { data: existing, error: checkError } = await supabase
      .from("bookings")
      .select("id")
      .eq("date", formattedDateString)
      .eq("time", time);

    if (checkError) {
      alert("Error al verificar disponibilidad. Intentá de nuevo.");
      setLoading(false);
      return;
    }

    if (existing && existing.length > 0) {
      alert("⚠️ Este horario ya está ocupado. Por favor elegí otro.");
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

    setLoading(false);
    setSubmitted(true);

    const businessPhoneNumber = "5493445123456"; 
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
              }}
              className="mt-4 inline-block bg-yellow-500 text-black font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-yellow-400 transition cursor-pointer"
            >
              Reservar otro turno
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl backdrop-blur-sm">
            
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <p className="text-xs text-gray-500 mt-1">Los domingos y feriados no están disponibles.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Horario
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-500 transition [color-scheme:dark]"
                  required
                />
              </div>
            </div>

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