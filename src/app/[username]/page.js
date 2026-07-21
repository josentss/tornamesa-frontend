"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

const HistogramaRatings = ({ data = [] }) => {
  const buckets = Array(10).fill(0);
  data.forEach((log) => {
    const r = Number(log.rating);
    if (r > 0 && r <= 5) {
      const index = Math.min(Math.floor(r * 2) - 1, 9);
      if (index >= 0) buckets[index] += 1;
    }
  });
  const totalRatings = data.filter(log => Number(log.rating) > 0).length;
  const max = Math.max(...buckets, 1);

  return (
    <div className="w-full max-w-[280px] ml-auto">
      <div className="flex justify-between items-center mb-2 border-b border-[#1e293b] pb-1.5">
        <h3 className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">RATINGS</h3>
        <span className="text-stone-400 text-xs font-mono">{totalRatings}</span>
      </div>
      <div className="flex items-end gap-[3px] h-16 pt-2 px-0.5">
        {buckets.map((count, i) => (
          <div
            key={i}
            className="flex-1 bg-[#2c394b] rounded-t-[1px] hover:bg-[#87ceeb] transition-colors relative group"
            style={{ height: `${(count / max) * 100}%`, minHeight: count > 0 ? '3px' : '1px' }}
          >
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#131b26] border border-[#1e293b] text-[9px] text-stone-300 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-xl">
              {count}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-2 text-[11px]">
        <span className="text-[#00e054]">★</span>
        <span className="text-[#00e054] tracking-tight">★★★★★</span>
      </div>
    </div>
  );
};

export default function PerfilPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [tabActiva, setTabActiva] = useState("actividad");
  const [perfil, setPerfil] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);

  const fechaActual = new Date();
  const [mesTop, setMesTop] = useState(`${fechaActual.getFullYear()}-${fechaActual.getMonth()}`);

  useEffect(() => {
    async function cargarDatos() {
      if (!params.username) return;
      try {
        // 1. Buscamos primero los datos del perfil público por el username de la URL
        const datosPerfil = await api.getProfileByUsername(params.username);
        setPerfil(datosPerfil);

        // 2. Si el perfil existe, usamos su ID para traer su historial correspondiente
        if (datosPerfil?.id) {
          const data = await api.getUserHistory(datosPerfil.id);
          const registros = Array.isArray(data) ? data : data.history || [];

          const registrosOrdenados = registros.sort((a, b) => {
            const fechaA = new Date(a.created_at || a.listened_at || Date.now());
            const fechaB = new Date(b.created_at || b.listened_at || Date.now());
            return fechaB - fechaA;
          });

          setHistorial(registrosOrdenados);
        }
      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, [params.username]);

  if (cargando) return <div className="min-h-screen bg-[#0a0f16] p-12 text-[#f0f9ff]">Cargando perfil...</div>;
  if (!perfil) return <div className="min-h-screen bg-[#0a0f16] p-12 text-[#f0f9ff]">Usuario no encontrado</div>;

  const currentYear = fechaActual.getFullYear();
  const registradosUnicos = new Set(
    historial.map(log => log.albums?.spotify_id || log.albums?.id || log.album_id || log.albums?.title)
  ).size;

  const escuchasEsteAno = historial.filter(log => {
    const fecha = new Date(log.created_at || log.listened_at || Date.now());
    return fecha.getFullYear() === currentYear;
  }).length;

  const diarioAgrupado = [];
  historial.forEach((log) => {
    const fecha = new Date(log.created_at || log.listened_at || Date.now());
    const dateKey = `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`;
    const id = log.albums?.spotify_id || log.albums?.id || log.album_id || log.albums?.title;

    const indexExistente = diarioAgrupado.findIndex(item => item.dateKey === dateKey && item.albumId === id);
    if (indexExistente !== -1) {
      diarioAgrupado[indexExistente].count += 1;
      diarioAgrupado[indexExistente].rating = Number(log.rating) || diarioAgrupado[indexExistente].rating;
    } else {
      diarioAgrupado.push({ ...log, dateKey, albumId: id, count: 1, fechaObj: fecha });
    }
  });

  const [selectedYear, selectedMonth] = mesTop.split('-').map(Number);
  const topMensualObj = historial
    .filter(log => {
      const fecha = new Date(log.created_at || log.listened_at || Date.now());
      return fecha.getFullYear() === selectedYear && fecha.getMonth() === selectedMonth;
    })
    .reduce((acc, log) => {
      const id = log.albums?.spotify_id || log.albums?.id || log.albums?.title;
      if (!acc[id]) {
        acc[id] = { album: log.albums || {}, count: 0, rating: Number(log.rating) || 0 };
      }
      acc[id].count += 1;
      return acc;
    }, {});

  const topMensual = Object.values(topMensualObj).sort((a, b) => b.count - a.count);
  const mesesNombres = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const nombreMesSeleccionado = mesesNombres[selectedMonth];
  const mesesDisponibles = [...new Set(historial.map(log => {
    const f = new Date(log.created_at || log.listened_at || Date.now());
    return `${f.getFullYear()}-${f.getMonth()}`;
  }))];

  return (
    <div className="min-h-screen bg-[#0a0f16] text-[#f0f9ff] p-6 font-sans">
      <div className="max-w-5xl mx-auto mt-8">

        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#131b26] border border-[#1e293b] flex items-center justify-center text-3xl font-bold text-[#87ceeb]">
              {perfil.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{perfil.username}</h1>

              {/* Renderizado de la Biografía */}
              {perfil.bio ? (
                <p className="text-stone-400 text-sm mt-1 max-w-md italic">"{perfil.bio}"</p>
              ) : (
                <p className="text-stone-600 text-xs mt-1 italic">Sin biografía aún.</p>
              )}

              {/* El botón de editar solo aparece si eres el dueño del perfil */}
              {user && user.id === perfil.id && (
                <Link href="/settings" className="mt-3 inline-block text-[10px] uppercase tracking-widest bg-[#1e293b] text-stone-300 px-3 py-1 rounded hover:text-[#FFF096] hover:border-[#FFF096] border border-transparent transition-all">
                  Editar Perfil
                </Link>
              )}
            </div>
          </div>

          <div className="flex gap-8 text-center">
            <div>
              <p className="text-3xl font-light text-[#87ceeb]">{registradosUnicos}</p>
              <p className="text-[10px] uppercase tracking-widest text-stone-500 mt-1">Registrados</p>
            </div>
            <div>
              <p className="text-3xl font-light text-[#f0f9ff]">{escuchasEsteAno}</p>
              <p className="text-[10px] uppercase tracking-widest text-stone-500 mt-1">Este Año</p>
            </div>
          </div>
        </div>

        <nav className="flex gap-8 border-b border-[#1e293b] pb-4 mb-10 text-sm text-stone-400">
          {["perfil", "actividad"].map((tab) => (
            <button
              key={tab}
              onClick={() => setTabActiva(tab)}
              className={`hover:text-[#f0f9ff] transition-colors capitalize tracking-wide ${
                tabActiva === tab ? "text-[#87ceeb] border-b-2 border-[#87ceeb] pb-4 -mb-[18px]" : ""
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="min-h-[400px]">
          <>
            {tabActiva === "perfil" && (
              <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-12 items-start">
                <div className="space-y-10">
                  <div>
                    <h2 className="text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-4 border-b border-[#1e293b] pb-2">Discos Favoritos</h2>
                    <div className="grid grid-cols-5 gap-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="aspect-square bg-[#131b26] rounded border border-[#1e293b] shadow-md flex items-center justify-center text-stone-700 font-mono text-xs">
                          Slot {i}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-4 border-b border-[#1e293b] pb-2">Escuchados Recientemente</h2>
                    {historial.length === 0 ? (
                      <p className="text-stone-500 text-sm py-2">No hay registros de escucha todavía.</p>
                    ) : (
                      <div className="grid grid-cols-5 gap-3">
                        {historial.slice(0, 5).map((log, idx) => {
                          const album = log.albums || {};
                          return (
                            <div key={idx} className="flex flex-col group cursor-pointer">
                              <div className="aspect-square bg-[#131b26] rounded border border-[#1e293b] overflow-hidden shadow-md group-hover:border-[#87ceeb] transition-all relative">
                                {album.cover_url || album.coverUrl ? (
                                  <img src={album.cover_url || album.coverUrl} alt={album.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-stone-600 text-[10px] p-1 text-center leading-tight">No Cover</div>
                                )}
                              </div>
                              <span className="text-[11px] text-stone-400 truncate mt-1.5 group-hover:text-[#87ceeb] transition-colors leading-tight">
                                {album.title || "Álbum Desconocido"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <HistogramaRatings data={historial} />
                </div>
              </div>
            )}

            {tabActiva === "actividad" && (
              <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* COLUMNA IZQUIERDA: TOP MENSUAL */}
                <div className="flex flex-col border-r border-[#1e293b] pr-8">
                  <div className="flex justify-between items-end mb-6 border-b border-[#1e293b] pb-3">
                    <div>
                      <h2 className="text-sm text-[#f0f9ff] font-bold uppercase tracking-widest mb-3">Top Mensual</h2>
                      <div className="bg-[#1e293b] text-center rounded py-1 w-12 border border-[#1e293b]">
                        <div className="text-[11px] font-bold text-stone-300 uppercase">{nombreMesSeleccionado}</div>
                        <div className="text-[9px] text-stone-500">{selectedYear}</div>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-stone-500">Escuchas</span>
                  </div>

                  {topMensual.length === 0 ? (
                    <p className="text-stone-500 text-sm py-8 border border-dashed border-[#1e293b] rounded text-center mb-6">Sin escuchas registradas.</p>
                  ) : (
                    <div className="space-y-3 mb-8 flex-1">
                      {topMensual.map((item, idx) => (
                        <div key={idx} className="flex items-center p-2 hover:bg-[#131b26] rounded-md transition-colors group">
                          <span className="text-[11px] text-stone-600 font-bold w-4 shrink-0">{idx + 1}</span>
                          <div className="w-12 h-12 bg-[#131b26] rounded border border-[#1e293b] shrink-0 overflow-hidden shadow-md mx-4">
                            {item.album.cover_url || item.album.coverUrl ? (
                              <img src={item.album.cover_url || item.album.coverUrl} alt={item.album.title} className="w-full h-full object-cover" />
                            ) : null}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-[#f0f9ff] text-[15px] group-hover:text-[#87ceeb] transition-colors break-words leading-tight block">
                              {item.album.title || "Álbum Desconocido"}
                            </span>
                            <div className="text-[#FFF096] text-[11px] tracking-widest mt-0.5">
                              {"★".repeat(item.rating)}
                            </div>
                          </div>
                          <div className="w-8 text-right text-lg font-light text-[#87ceeb] ml-2">
                            {item.count}x
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto pt-6">
                    <h3 className="text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-3 border-b border-[#1e293b] pb-2">Historial</h3>
                    <div className="flex flex-wrap gap-2">
                      {mesesDisponibles.map(mesKey => {
                        const [y, m] = mesKey.split('-');
                        const isSelected = mesKey === mesTop;
                        return (
                          <button
                            key={mesKey}
                            onClick={() => setMesTop(mesKey)}
                            className={`text-center rounded py-1 w-10 border transition-all ${
                              isSelected ? "bg-[#87ceeb]/10 border-[#87ceeb] cursor-default" : "bg-[#131b26] border-[#1e293b] hover:border-[#FFF096] hover:bg-[#1e293b] cursor-pointer"
                            }`}
                          >
                            <div className={`text-[9px] font-bold uppercase ${isSelected ? 'text-[#87ceeb]' : 'text-stone-400'}`}>{mesesNombres[m]}</div>
                            <div className={`text-[7px] ${isSelected ? 'text-[#87ceeb]/70' : 'text-stone-600'}`}>{y.slice(-2)}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* COLUMNA DERECHA: DIARIO */}
                <div className="flex flex-col pl-8">
                  <div className="flex text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-6 border-b border-[#1e293b] pb-3">
                    <div className="w-14">Mes</div>
                    <div className="w-10">Día</div>
                    <div className="flex-1">Álbum</div>
                  </div>

                  <div className="max-h-[650px] overflow-y-auto pr-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e293b #0a0f16' }}>
                    {diarioAgrupado.length === 0 ? (
                      <p className="text-stone-500 text-sm py-4">No hay registros aún.</p>
                    ) : (
                      <div className="space-y-0">
                        {diarioAgrupado.map((registro, idx) => {
                          const album = registro.albums || {};
                          const fecha = registro.fechaObj;
                          const mes = mesesNombres[fecha.getMonth()].toUpperCase();
                          const dia = fecha.getDate().toString().padStart(2, '0');
                          const ano = fecha.getFullYear();
                          const ratingVal = registro.rating || 0;
                          const mostrarMes = idx === 0 || diarioAgrupado[idx - 1].fechaObj.getMonth() !== fecha.getMonth();

                          return (
                            <div key={idx} className="flex items-start border-b border-[#1e293b]/40 py-4 hover:bg-[#131b26]/50 transition-colors group">
                              <div className="w-14 pt-1">
                                {mostrarMes && (
                                  <div className="bg-[#1e293b] text-center rounded py-1 w-10 border border-[#1e293b] group-hover:border-[#334155] transition-colors">
                                    <div className="text-[10px] font-bold text-stone-300">{mes}</div>
                                    <div className="text-[8px] text-stone-500">{ano}</div>
                                  </div>
                                )}
                              </div>
                              <div className="w-10 pt-1 text-xl font-light text-stone-400 group-hover:text-[#f0f9ff] transition-colors">{dia}</div>
                              <div className="flex-1 flex gap-4">
                                <div className="w-12 h-12 bg-[#131b26] rounded border border-[#1e293b] overflow-hidden shrink-0 shadow-sm mt-0.5">
                                  {album.cover_url || album.coverUrl ? <img src={album.cover_url || album.coverUrl} alt={album.title} className="w-full h-full object-cover" /> : null}
                                </div>
                                <div className="flex flex-col justify-center min-w-0">
                                  <span className="font-medium text-[#f0f9ff] text-[15px] group-hover:text-[#87ceeb] transition-colors cursor-pointer leading-tight break-words">
                                    {album.title || "Álbum Desconocido"}
                                  </span>
                                  <div className="flex items-center gap-3 mt-1.5">
                                    <span className="text-[#FFF096] text-[11px] tracking-widest">{"★".repeat(ratingVal)}</span>
                                    {registro.count > 1 && (
                                      <span className="text-[10px] text-stone-400 bg-[#1e293b] px-2 py-0.5 rounded-full border border-[#334155]">{registro.count} escuchas</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        </div>
      </div>
    </div>
  );
}
