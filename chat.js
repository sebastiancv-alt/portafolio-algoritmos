/* =====================================================================
   ASISTENTE DEL PORTAFOLIO (chat sin servidor, funciona en GitHub Pages)
   No necesitas editar este archivo.

   Cómo funciona:
   - Lee la misma información que usa la página (datos.js): semanas,
     actividades, archivos, temas y perfil.
   - Si existe conocimiento.js (lo genera generar_conocimiento.py), también
     conoce el código de tus ZIP (clases y métodos) y el texto de tus PDF.
   - Entiende la pregunta con reglas y búsqueda por palabras. No inventa:
     solo responde con lo que hay en tu portafolio.
   ===================================================================== */
(() => {
    'use strict';

    const global = typeof window !== 'undefined' ? window : globalThis;

    /* ---------------------------------------------------------------
       Utilidades de texto
       --------------------------------------------------------------- */
    const norm = (s) => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const separarCamel = (s) => String(s ?? '')
        .replace(/([a-záéíóúñ0-9])([A-ZÁÉÍÓÚÑ])/g, '$1 $2')
        .replace(/[_\-./]+/g, ' ');
    const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

    // Palabras que no ayudan a buscar
    const VACIAS = new Set((
        'el la los las un una unos unas de del al y o u e en a ante con por para sin sobre entre ' +
        'que es son fue ser esta este esto esa ese eso estos estas mi mis tu tus su sus se me te lo le les nos ' +
        'como cual cuales cuando donde quien quienes cuanto cuantos cuantas hay tiene tienen tengo tienes ' +
        'dime dame muestrame muestra quiero puedes podrias favor hola ver info informacion acerca mas muy ' +
        'tambien si no pero ya hacer hizo haces estoy estan algo todo toda todos todas hablame cuentame explicame ' +
        'portafolio curso semana semanas unidad unidades actividad actividades trabajo trabajos ' +
        'veo veamos encuentro encuentra busco buscar trabaje trabajaste trabajado aprendi aprendiste explicame'
    ).split(' '));

    // Palabras que describen "qué quiere ver" pero no un tema concreto
    const GENERICAS_TXT = (
        'resumen trata trato contiene contenido archivos archivo vi visto hice hecho temas tema lista listar ' +
        'mostrar mostrarme general completo todo detalle detalles principal principales ' +
        'codigo codigos proyecto proyectos clase clases metodo metodos funcion funciones atributo atributos'
    ).split(' ');

    const raiz = (w) => {
        if (w.length > 4 && w.endsWith('ces')) return `${w.slice(0, -3)}z`;
        if (w.length >= 4 && w.endsWith('s')) return w.slice(0, -1);
        return w;
    };

    const palabrasDe = (s, quitarVacias = false) => norm(separarCamel(s))
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w && !/^\d+$/.test(w) && !(quitarVacias && VACIAS.has(w)))
        .map(raiz);

    const GENERICAS = new Set(GENERICAS_TXT.map(raiz));

    const igual = (q, d) => q === d || (q.length >= 4 && d.length >= 4 && (d.startsWith(q) || q.startsWith(d)));

    // Equivalencias para que "stack" encuentre "pila", "imagen" encuentre "infografía", etc.
    const SINONIMOS = {
        pila: ['stack', 'lifo', 'apilar', 'desapilar'],
        cola: ['queue', 'fifo', 'encolar', 'desencolar'],
        arbol: ['abb', 'binario', 'nodo', 'bst'],
        infografia: ['imagen', 'diagrama', 'grafico', 'grafica'],
        codigo: ['zip', 'proyecto', 'java', 'programa', 'fuente'],
        documento: ['pdf', 'enunciado'],
        matriz: ['bidimensional', 'tabla'],
        arreglo: ['vector', 'array', 'unidimensional', 'lista'],
        ordenamiento: ['ordenar', 'burbuja', 'sort', 'orden'],
        busqueda: ['buscar', 'search', 'encontrar'],
        estudiante: ['alumno'],
        inventario: ['stock', 'equipo', 'catalogo'],
        flujo: ['diagrama', 'flujograma']
    };

    // "stack" también lleva a "pila": armamos el grupo de palabras equivalentes en ambos sentidos
    const grupoDe = (w) => {
        const grupo = new Set([w]);
        Object.entries(SINONIMOS).forEach(([clave, alts]) => {
            const todas = [clave, ...alts].map(raiz);
            if (todas.includes(w)) todas.forEach((x) => grupo.add(x));
        });
        return [...grupo];
    };

    /* ---------------------------------------------------------------
       Motor: construye el índice y responde preguntas
       --------------------------------------------------------------- */
    function crearMotor(DATOS, CONOC) {
        const perfil = DATOS.perfil || {};
        const curso = DATOS.curso || {};
        const SPU = Number(curso.semanasPorUnidad) || 4;
        const IMG = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'avif'];
        const ZIPS = ['zip', 'rar', '7z'];

        const unirRuta = (...p) => p.filter(Boolean).map((x) => String(x).replace(/^\/+|\/+$/g, '')).filter(Boolean).join('/');
        const urlDe = (ruta) => ruta.split('/').map(encodeURIComponent).join('/');
        const extDe = (n) => (n.includes('.') ? n.split('.').pop().toLowerCase() : '');

        /* ---------- Modelo (igual que el de la página) ---------- */
        const semanas = (curso.semanas || []).map((s, i) => {
            const numero = Number(s.numero) || i + 1;
            const actividades = (s.actividades || []).map((a) => {
                const fuentes = [];
                if (a.archivos && a.archivos.length) fuentes.push({ titulo: '', carpeta: '', archivos: a.archivos });
                (a.grupos || []).forEach((g) => fuentes.push({ titulo: g.titulo || '', carpeta: g.carpeta || '', archivos: g.archivos || [] }));
                const archivos = [];
                fuentes.forEach((g) => g.archivos.forEach(([titulo, nombre]) => {
                    const ext = extDe(nombre);
                    const ruta = unirRuta(a.carpeta, g.carpeta, nombre);
                    archivos.push({ titulo, nombre, ruta, url: urlDe(ruta), ext, tipo: IMG.includes(ext) ? 'imagen' : 'documento', grupo: g.titulo });
                }));
                return {
                    titulo: a.titulo || '',
                    descripcion: a.descripcion || '',
                    archivos,
                    grupos: fuentes.map((g) => g.titulo).filter(Boolean)
                };
            });
            return { numero, unidad: Math.ceil(numero / SPU), titulo: s.titulo || '', actividades };
        }).sort((a, b) => a.numero - b.numero);

        const todosLosArchivos = (lista) => lista.flatMap((s) => s.actividades.flatMap((a) => a.archivos));
        const semanaDe = (n) => semanas.find((s) => s.numero === n);
        const tituloUnidad = (u) => (curso.titulosUnidades || [])[u - 1] || '';

        const cuenta = (archivos) => {
            const c = { img: 0, zip: 0, pdf: 0, otros: 0 };
            archivos.forEach((f) => {
                if (f.tipo === 'imagen') c.img++;
                else if (ZIPS.includes(f.ext)) c.zip++;
                else if (f.ext === 'pdf') c.pdf++;
                else c.otros++;
            });
            return c;
        };
        const etiquetasDe = (c) => {
            const e = [];
            if (c.img) e.push(plural(c.img, 'infografía', 'infografías'));
            if (c.pdf) e.push(plural(c.pdf, 'PDF', 'PDF'));
            if (c.zip) e.push(c.zip === 1 ? '1 ZIP de código' : `${c.zip} ZIP de código`);
            if (c.otros) e.push(plural(c.otros, 'otro archivo', 'otros archivos'));
            return e;
        };

        /* ---------- Acciones (botones de cada tarjeta) ---------- */
        const accionSemana = (n) => ({ tipo: 'semana', num: n, texto: `Ver semana ${n}` });
        const accionArchivo = (f, texto) => ({ tipo: 'archivo', url: f.url, ext: f.ext, texto: texto || (f.tipo === 'imagen' || f.ext === 'pdf' ? 'Abrir' : 'Descargar') });
        const accionesDeActividad = (sem, act) => {
            const acciones = [accionSemana(sem.numero)];
            const zip = act.archivos.find((f) => ZIPS.includes(f.ext));
            if (zip) acciones.push(accionArchivo(zip, 'Descargar código'));
            const pdf = act.archivos.find((f) => f.ext === 'pdf');
            if (pdf) acciones.push(accionArchivo(pdf, 'Abrir PDF'));
            return acciones;
        };

        /* ---------- Conocimiento extra (ZIP y PDF) ---------- */
        const proyectos = (CONOC && CONOC.proyectos) || [];
        const documentos = (CONOC && CONOC.documentos) || [];
        const hayCodigo = proyectos.length > 0;

        /* ---------- Índice de búsqueda ---------- */
        const entradas = [];
        const agregar = (e) => entradas.push({ peso: 0, ...e, t: [...new Set(e.t)], c: [...new Set(e.c)] });

        semanas.forEach((sem) => {
            agregar({
                tipo: 'semana', semana: sem.numero, ref: sem, peso: 0.4,
                t: palabrasDe(`${sem.titulo} ${tituloUnidad(sem.unidad)}`),
                c: palabrasDe(sem.actividades.map((a) => `${a.titulo} ${a.descripcion}`).join(' '))
            });
            sem.actividades.forEach((act) => {
                agregar({
                    tipo: 'actividad', semana: sem.numero, ref: { sem, act },
                    t: palabrasDe(`${act.titulo} ${sem.titulo}`),
                    c: palabrasDe(`${act.descripcion} ${act.grupos.join(' ')} ${act.archivos.map((f) => `${f.titulo} ${f.grupo}`).join(' ')}`)
                });
            });
        });

        (perfil.temas || []).forEach((tema) => agregar({ tipo: 'tema', semana: null, ref: tema, t: palabrasDe(tema), c: [], peso: -0.5 }));

        proyectos.forEach((p) => {
            const semProy = p.semana != null ? p.semana : (String(p.ruta || '').match(/semana\s*(\d+)/i) || [])[1];
            const sem = semProy != null ? Number(semProy) : null;
            agregar({
                tipo: 'proyecto', semana: sem, ref: p,
                t: palabrasDe(`${p.nombre} codigo proyecto java`),
                c: palabrasDe((p.clases || []).map((c) => `${c.nombre} ${c.comentario || ''}`).join(' '))
            });
            (p.clases || []).forEach((cl) => {
                (cl.metodos || []).forEach((m) => {
                    agregar({
                        tipo: 'metodo', semana: sem, ref: { p, cl, m },
                        t: palabrasDe(`${m.nombre} ${cl.nombre}`),
                        c: palabrasDe(`${m.comentario || ''} ${m.firma || ''} ${p.nombre}`)
                    });
                });
            });
        });

        documentos.forEach((d) => {
            const sem = d.semana != null ? Number(d.semana) : null;
            const texto = String(d.texto || '');
            const trozos = [];
            for (let i = 0; i < texto.length; i += 500) trozos.push(texto.slice(Math.max(0, i - 60), i + 560));
            trozos.slice(0, 40).forEach((trozo) => agregar({
                tipo: 'pdf', semana: sem, ref: { d, trozo },
                t: palabrasDe(d.nombre), c: palabrasDe(trozo)
            }));
        });

        /* ---------- Búsqueda ---------- */
        const vocabulario = [...new Set(entradas.flatMap((e) => [...e.t, ...e.c]))];
        const existe = (q) => q.alts.some((alt) => vocabulario.some((d) => igual(alt, d)));

        // Palabras de tema de la pregunta (sin las genéricas), mostrando la palabra tal como la escribió la persona
        function temaDe(texto) {
            const escritas = String(texto).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
            return palabrasDe(texto, true)
                .filter((w) => !GENERICAS.has(w))
                .map((w) => ({
                    base: w,
                    mostrar: escritas.find((x) => raiz(norm(x)) === w) || w,
                    alts: [w, ...grupoDe(w).filter((x) => x !== w)]
                }));
        }

        function puntuar(entrada, qs) {
            let total = 0;
            let cubiertos = 0;
            for (const q of qs) {
                let mejor = 0;
                for (const alt of q.alts) {
                    const esBase = alt === q.base;
                    if (entrada.t.some((d) => igual(alt, d))) mejor = Math.max(mejor, esBase ? 3 : 2.2);
                    else if (entrada.c.some((d) => igual(alt, d))) mejor = Math.max(mejor, esBase ? 1 : 0.7);
                }
                if (mejor) { cubiertos++; total += mejor; }
            }
            const minimo = qs.length <= 2 ? qs.length : qs.length - 1;
            if (!qs.length || cubiertos < minimo) return 0;
            return total + cubiertos * 0.5 + entrada.peso;
        }

        function buscar(qs, { semana = null, unidad = null, tipos = null } = {}) {
            if (!qs.length) return { qs, res: [] };
            const res = entradas
                .filter((e) => (semana == null || e.semana === semana) &&
                    (unidad == null || (e.semana != null && Math.ceil(e.semana / SPU) === unidad)) &&
                    (!tipos || tipos.includes(e.tipo)))
                .map((e) => ({ e, p: puntuar(e, qs) }))
                .filter((r) => r.p > 0)
                .sort((a, b) => b.p - a.p);
            return { qs, res };
        }

        /* ---------- Tarjetas ---------- */
        function itemSemana(sem, conActividades = false) {
            const c = cuenta(todosLosArchivos([sem]));
            return {
                titulo: `Semana ${sem.numero}${sem.titulo ? ` · ${sem.titulo}` : ''}`,
                detalle: conActividades
                    ? sem.actividades.map((a) => a.titulo).join(' · ')
                    : `Unidad ${sem.unidad}. ${plural(sem.actividades.length, 'actividad', 'actividades')}.`,
                etiquetas: etiquetasDe(c),
                acciones: [accionSemana(sem.numero)]
            };
        }

        function itemActividad(sem, act) {
            return {
                titulo: act.titulo,
                detalle: act.descripcion,
                etiquetas: [`Semana ${sem.numero}`, ...etiquetasDe(cuenta(act.archivos))],
                acciones: accionesDeActividad(sem, act)
            };
        }

        function itemDe(r) {
            const { e } = r;
            if (e.tipo === 'semana') return itemSemana(e.ref, true);
            if (e.tipo === 'actividad') return itemActividad(e.ref.sem, e.ref.act);
            if (e.tipo === 'tema') return { titulo: e.ref, detalle: 'Es uno de los temas que trabajé en el curso.', etiquetas: [], acciones: [] };
            if (e.tipo === 'proyecto') {
                const p = e.ref;
                const nClases = (p.clases || []).length;
                const nMetodos = (p.clases || []).reduce((n, c) => n + (c.metodos || []).length, 0);
                const acciones = [];
                if (e.semana != null) acciones.push(accionSemana(e.semana));
                if (p.ruta) acciones.push(accionArchivo({ url: urlDe(p.ruta), ext: 'zip', tipo: 'documento' }, 'Descargar código'));
                return {
                    titulo: `Proyecto ${p.nombre}`,
                    detalle: `Clases: ${(p.clases || []).map((c) => c.nombre).join(', ') || 'sin clases detectadas'}.`,
                    etiquetas: [e.semana != null ? `Semana ${e.semana}` : '', plural(nClases, 'clase', 'clases'), plural(nMetodos, 'método', 'métodos')].filter(Boolean),
                    acciones
                };
            }
            if (e.tipo === 'metodo') {
                const { p, cl, m } = e.ref;
                const acciones = [];
                if (e.semana != null) acciones.push(accionSemana(e.semana));
                if (p.ruta) acciones.push(accionArchivo({ url: urlDe(p.ruta), ext: 'zip', tipo: 'documento' }, 'Descargar código'));
                return {
                    titulo: `${cl.nombre}.${m.firma || m.nombre}`,
                    detalle: m.comentario || `Método de la clase ${cl.nombre} del proyecto ${p.nombre}.`,
                    etiquetas: [e.semana != null ? `Semana ${e.semana}` : '', p.nombre].filter(Boolean),
                    acciones
                };
            }
            if (e.tipo === 'pdf') {
                const { d, trozo } = e.ref;
                const acciones = [];
                if (e.semana != null) acciones.push(accionSemana(e.semana));
                if (d.ruta) acciones.push(accionArchivo({ url: urlDe(d.ruta), ext: 'pdf', tipo: 'documento' }, 'Abrir PDF'));
                return {
                    titulo: d.nombre,
                    detalle: `…${trozo.replace(/\s+/g, ' ').trim().slice(0, 240)}…`,
                    etiquetas: [e.semana != null ? `Semana ${e.semana}` : ''].filter(Boolean),
                    acciones
                };
            }
            return null;
        }

        /* ---------- Respuestas ---------- */
        const ultimaSemana = () => semanas[semanas.length - 1];

        function sugerencias() {
            const lista = ['¿Qué temas trabajé?'];
            const ult = ultimaSemana();
            if (ult) lista.push(`Resumen de la semana ${ult.numero}`);
            lista.push('¿Cuántas infografías hay?');
            if (ult && ult.titulo) lista.push(`¿Dónde veo ${ult.titulo.toLowerCase()}?`);
            if (hayCodigo) lista.push('¿Qué clases tiene el código?');
            return lista;
        }

        function bienvenida() {
            return {
                texto: 'Hola, soy el asistente de este portafolio. Te cuento qué trabajos hay, de qué trata cada semana, dónde encontrar un tema o qué contiene el código de los proyectos. Solo respondo con lo que hay en esta página.',
                items: [],
                chips: sugerencias()
            };
        }

        function respuestaGeneral() {
            const archivos = todosLosArchivos(semanas);
            const c = cuenta(archivos);
            const temas = (perfil.temas || []).join(', ');
            return {
                texto: `El portafolio reúne ${plural(semanas.length, 'semana', 'semanas')} del curso ${perfil.curso || ''}, con ${plural(c.img, 'infografía', 'infografías')}, ${plural(c.pdf, 'PDF', 'PDF')} y ${plural(c.zip, 'ZIP de código', 'ZIP de código')}.` +
                    (temas ? ` Los temas que trabajé: ${temas}.` : '') + ' Esto es lo que hay por semana:',
                items: semanas.map((s) => itemSemana(s)),
                chips: ['¿Cuántas infografías hay?', hayCodigo ? '¿Qué clases tiene el código?' : '¿Cómo te contacto?']
            };
        }

        function respuestaSemanas(nums, numActividad) {
            const existentes = nums.map(semanaDe).filter(Boolean);
            const faltan = nums.filter((n) => !semanaDe(n));
            if (!existentes.length) {
                const pub = semanas.map((s) => s.numero);
                return {
                    texto: `Todavía no hay trabajos de ${nums.length > 1 ? 'esas semanas' : `la semana ${nums[0]}`}. Hay publicadas ${pub.length ? `las semanas ${pub[0]} a ${pub[pub.length - 1]}` : 'ninguna semana'}.`,
                    items: [], chips: sugerencias()
                };
            }
            const sem = existentes[0];
            if (existentes.length === 1 && numActividad && sem.actividades[numActividad - 1]) {
                const act = sem.actividades[numActividad - 1];
                return {
                    texto: `Esto es la actividad ${numActividad} de la semana ${sem.numero}:`,
                    items: [itemActividad(sem, act)],
                    chips: [`Resumen de la semana ${sem.numero}`]
                };
            }
            const items = [];
            let texto = '';
            if (existentes.length === 1) {
                texto = `La semana ${sem.numero}${sem.titulo ? ` trata de «${sem.titulo}»` : ''} (Unidad ${sem.unidad}) y tiene ${plural(sem.actividades.length, 'actividad', 'actividades')}:`;
                sem.actividades.forEach((a) => items.push(itemActividad(sem, a)));
            } else {
                texto = `Resumen de las semanas ${existentes.map((s) => s.numero).join(', ')}:`;
                existentes.forEach((s) => items.push(itemSemana(s, true)));
            }
            if (faltan.length) texto += ` (Aún no hay trabajos de la semana ${faltan.join(', ')}.)`;
            return { texto, items, chips: ['¿Cuántas infografías hay?'] };
        }

        function respuestaUnidad(u) {
            const sems = semanas.filter((s) => s.unidad === u);
            if (!sems.length) return { texto: `Todavía no hay trabajos de la unidad ${u}.`, items: [], chips: sugerencias() };
            const nombre = tituloUnidad(u);
            return {
                texto: `La unidad ${u}${nombre ? ` («${nombre}»)` : ''} tiene ${plural(sems.length, 'semana publicada', 'semanas publicadas')}:`,
                items: sems.map((s) => itemSemana(s, true)),
                chips: []
            };
        }

        function respuestaConteo(n, filtros) {
            let sems = semanas;
            let ambito = 'en todo el portafolio';
            if (filtros.semanas.length) {
                sems = semanas.filter((s) => filtros.semanas.includes(s.numero));
                ambito = `en la semana ${filtros.semanas.join(', ')}`;
            } else if (filtros.unidad) {
                sems = semanas.filter((s) => s.unidad === filtros.unidad);
                ambito = `en la unidad ${filtros.unidad}`;
            }
            if (!sems.length) return { texto: 'No hay trabajos publicados en ese rango.', items: [], chips: sugerencias() };
            const c = cuenta(todosLosArchivos(sems));
            let texto;
            if (/infograf|imagen|diagrama/.test(n) && !/codigo|zip|pdf/.test(n)) texto = `Hay ${plural(c.img, 'infografía', 'infografías')} ${ambito}.`;
            else if (/codigo|zip|proyecto/.test(n)) texto = `Hay ${plural(c.zip, 'proyecto de código (ZIP)', 'proyectos de código (ZIP)')} ${ambito}.`;
            else if (/pdf|documento|enunciado/.test(n)) texto = `Hay ${plural(c.pdf, 'PDF', 'PDF')} ${ambito}.`;
            else if (/semana/.test(n)) texto = `Hay ${plural(sems.length, 'semana publicada', 'semanas publicadas')} ${ambito}.`;
            else texto = `${ambito[0].toUpperCase()}${ambito.slice(1)} hay ${plural(sems.length, 'semana', 'semanas')}, con ${plural(c.img, 'infografía', 'infografías')}, ${plural(c.pdf, 'PDF', 'PDF')} y ${plural(c.zip, 'ZIP de código', 'ZIP de código')}.`;
            const items = sems.length > 1 ? sems.map((s) => itemSemana(s)) : [];
            return { texto: `${texto}${items.length ? ' Por semana:' : ''}`, items, chips: [] };
        }

        function respuestaPerfil() {
            const datos = (perfil.datos || []).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`);
            return {
                texto: `${perfil.nombre ? `${perfil.nombre}. ` : ''}${perfil.presentacion || ''}${datos.length ? ` ${datos.join(' · ')}.` : ''}`.trim(),
                items: [], chips: ['¿Qué temas trabajé?', '¿Cómo te contacto?']
            };
        }

        function respuestaContacto() {
            const enlaces = (perfil.contacto || []).filter(([, url]) => url);
            if (!enlaces.length) return { texto: 'Por ahora no hay datos de contacto publicados.', items: [], chips: [] };
            return {
                texto: 'Puedes escribirme por aquí:',
                items: enlaces.map(([texto, url]) => ({
                    titulo: texto, detalle: url, etiquetas: [],
                    acciones: [{ tipo: 'enlace', url: /@/.test(url) && !/^(mailto:|https?:)/i.test(url) ? `mailto:${url}` : url, texto: 'Abrir' }]
                })),
                chips: []
            };
        }

        function respuestaBusqueda(qs, filtros, soloCodigo) {
            const tipos = soloCodigo ? ['metodo', 'proyecto'] : null;
            const semanaUnica = filtros.semanas.length === 1 ? filtros.semanas[0] : null;
            let { res } = buscar(qs, { semana: semanaUnica, unidad: filtros.unidad, tipos });
            if (!res.length && tipos) ({ res } = buscar(qs, { semana: semanaUnica, unidad: filtros.unidad }));
            if (!res.length) return { vacio: true };

            // Si hay una semana que coincide por título, sus actividades ya aparecen debajo: evitamos repetir.
            const vistos = new Set();
            const items = [];
            for (const r of res) {
                const it = itemDe(r);
                if (!it) continue;
                const clave = `${it.titulo}|${it.detalle}`;
                if (vistos.has(clave)) continue;
                vistos.add(clave);
                items.push(it);
                if (items.length >= 5) break;
            }
            const total = new Set(res.map((r) => { const it = itemDe(r); return it && `${it.titulo}|${it.detalle}`; })).size;
            const sobre = qs.map((q) => q.mostrar).join(' ');
            let msg = items.length === 1 ? `Encontré esto sobre «${sobre}»:` : `Encontré ${items.length} resultados sobre «${sobre}»:`;
            if (total > items.length) msg += ` (Hay ${total - items.length} más; si quieres, afina tu pregunta.)`;
            return { texto: msg, items, chips: [] };
        }

        function respuestaVacia(soloCodigo) {
            if (soloCodigo && !hayCodigo) {
                return {
                    texto: 'Todavía no tengo el detalle del código de los proyectos, pero cada actividad incluye su ZIP para descargar. Puedo decirte en qué semana está cada proyecto.',
                    items: [], chips: ['Resumen de la semana ' + (ultimaSemana() ? ultimaSemana().numero : 1), '¿Qué temas trabajé?']
                };
            }
            return {
                texto: 'No encontré eso en el portafolio. Puedo ayudarte con las semanas, los temas, las infografías, los PDF y el código de los proyectos. Prueba con una palabra clave, por ejemplo «matriz», «pila» o «cola».',
                items: [], chips: sugerencias()
            };
        }

        /* ---------- Entrada principal ---------- */
        function responder(entrada) {
            const original = String(entrada ?? '').trim().slice(0, 300);
            const n = norm(original).replace(/[¿?¡!]/g, ' ').replace(/\s+/g, ' ').trim();
            if (!n) return bienvenida();

            if (/^(hola|holi|buenas|buenos dias|buenas tardes|buenas noches|hey|saludos|que tal)\b/.test(n) && n.split(' ').length <= 4) return bienvenida();
            if (/^(gracias|muchas gracias|ok gracias|genial|perfecto|listo)\b/.test(n) && n.split(' ').length <= 4) {
                return { texto: '¡De nada! Si quieres, pregúntame por otra semana o tema.', items: [], chips: sugerencias() };
            }
            if (/(que puedes|que sabes|que haces|en que me ayudas|como funcionas|como te uso|ayuda\b|quien eres|que eres)/.test(n)) return bienvenida();

            // Filtros: semanas y unidad mencionadas
            const filtros = { semanas: [], unidad: null };
            const mSem = n.match(/semanas?\s+(\d{1,2}(?:\s*(?:,|y|e|-|a|al)\s*(?:la\s+)?\d{1,2})*)/);
            if (mSem) filtros.semanas = [...new Set((mSem[1].match(/\d{1,2}/g) || []).map(Number))].slice(0, 4);
            const mUni = n.match(/unidad\s+(\d{1,2})/);
            if (mUni) filtros.unidad = Number(mUni[1]);
            const mAct = n.match(/actividad(?:es)?\s+(\d{1,2})/);
            const numActividad = mAct ? Number(mAct[1]) : null;

            if (/(contacto|contactar|contactarte|correo|email|e-mail|github|linkedin|escribirte|escribirle|redes)/.test(n) && !filtros.semanas.length) return respuestaContacto();
            if (/(quien (es|soy)|sobre ti|sobre mi|sobre el autor|presentate|el autor|datos personales|carrera|ciclo|universidad|como te llamas|como se llama|que estudias|que estudia)/.test(n) && !filtros.semanas.length) return respuestaPerfil();
            if (/(cuant[oa]s|total de|numero de|cantidad)/.test(n)) return respuestaConteo(n, filtros);

            if (/(ultim[ao]|mas reciente|reciente|mas nuev[ao]|lo nuevo)/.test(n) && ultimaSemana() && !filtros.semanas.length) {
                return respuestaSemanas([ultimaSemana().numero], null);
            }

            const tema = temaDe(original);
            const pideCodigo = /(codigo|zip|clases?|metodos?|funcion|funciones|atributos?|proyectos?)\b/.test(n);
            const listaProyectos = () => {
                const sel = entradas.filter((e) => e.tipo === 'proyecto' && (!filtros.semanas.length || filtros.semanas.includes(e.semana)));
                if (!sel.length) return null;
                return {
                    texto: `Estos son los proyectos de código${filtros.semanas.length ? ` de la semana ${filtros.semanas.join(', ')}` : ''}:`,
                    items: sel.slice(0, 8).map((e) => itemDe({ e })), chips: []
                };
            };

            if (!tema.length) {
                if (filtros.semanas.length) return (pideCodigo && hayCodigo && listaProyectos()) || respuestaSemanas(filtros.semanas, numActividad);
                if (filtros.unidad) return respuestaUnidad(filtros.unidad);
                if (pideCodigo) return (hayCodigo && listaProyectos()) || respuestaVacia(true);
                return respuestaGeneral();
            }

            // Si solo pide un tipo de archivo ("infografías de la unidad 1"), contamos y listamos por semana
            if (tema.every((q) => /^(infograf|imagen)/.test(q.base))) return respuestaConteo(n, filtros);

            // Solo buscamos con las palabras que existen en el portafolio
            const conocidas = tema.filter(existe);
            if (conocidas.length) {
                const r = respuestaBusqueda(conocidas, filtros, pideCodigo && hayCodigo);
                if (!r.vacio) return r;
            }
            return respuestaVacia(pideCodigo);
        }

        return { responder, bienvenida, sugerencias, _semanas: semanas };
    }

    /* ---------------------------------------------------------------
       Interfaz del chat
       --------------------------------------------------------------- */
    function iniciarUI(motor) {
        const doc = document;
        const reducir = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const movil = () => global.matchMedia && global.matchMedia('(max-width: 640px)').matches;

        const el = (tag, props = {}, hijos = []) => {
            const nodo = doc.createElement(tag);
            Object.entries(props).forEach(([k, v]) => {
                if (v == null || v === false) return;
                if (k === 'class') nodo.className = v;
                else if (k === 'text') nodo.textContent = v;
                else nodo.setAttribute(k, v === true ? '' : v);
            });
            [].concat(hijos).forEach((h) => h && nodo.append(h));
            return nodo;
        };
        const trazo = (d) => {
            const s = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
            s.setAttribute('viewBox', '0 0 24 24');
            s.setAttribute('class', 'ic');
            s.setAttribute('aria-hidden', 'true');
            s.setAttribute('focusable', 'false');
            const p = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
            p.setAttribute('d', d);
            s.append(p);
            return s;
        };

        const fab = el('button', { type: 'button', class: 'chat-fab', 'aria-expanded': 'false', 'aria-controls': 'chat-panel', 'aria-label': 'Abrir el asistente del portafolio' },
            [trazo('M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z'), el('span', { text: 'Pregúntame' })]);

        const btnReiniciar = el('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Borrar la conversación', title: 'Borrar la conversación' }, [trazo('M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5')]);
        const btnCerrar = el('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Cerrar el asistente', title: 'Cerrar (Esc)' }, [trazo('M6 6l12 12M18 6 6 18')]);
        const log = el('div', { class: 'chat-log', role: 'log', 'aria-live': 'polite', 'aria-label': 'Conversación', tabindex: '0' });
        const chips = el('div', { class: 'chat-chips' });
        const entrada = el('input', { type: 'text', class: 'chat-entrada', placeholder: 'Pregunta sobre el portafolio…', autocomplete: 'off', maxlength: '200', 'aria-label': 'Tu pregunta' });
        const enviar = el('button', { type: 'submit', class: 'btn btn-primario btn-sm', 'aria-label': 'Enviar' }, [trazo('M5 12h14M13 6l6 6-6 6')]);
        const form = el('form', { class: 'chat-form' }, [entrada, enviar]);

        const panel = el('section', { class: 'chat-panel', id: 'chat-panel', role: 'dialog', 'aria-label': 'Asistente del portafolio', hidden: true }, [
            el('header', { class: 'chat-cab' }, [
                el('div', { class: 'chat-cab-textos' }, [
                    el('strong', { text: 'Asistente del portafolio' }),
                    el('small', { text: 'Responde solo con la información de esta página' })
                ]),
                btnReiniciar, btnCerrar
            ]),
            log, chips, form
        ]);

        const raiz = el('div', { class: 'chat' }, [panel, fab]);
        doc.body.append(raiz);

        function irASemana(n) {
            if (movil()) cerrar(false);
            history.replaceState(null, '', `#semana-${n}`);
            global.dispatchEvent(new HashChangeEvent('hashchange'));
        }

        function botonAccion(a) {
            if (a.tipo === 'semana') {
                const b = el('button', { type: 'button', class: 'btn btn-fantasma btn-sm', text: a.texto });
                b.addEventListener('click', () => irASemana(a.num));
                return b;
            }
            const abre = a.tipo === 'enlace' || ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(a.ext);
            return el('a', Object.assign(
                { class: 'btn btn-fantasma btn-sm', href: a.url, text: a.texto },
                abre ? { target: '_blank', rel: 'noopener' } : { download: '' }
            ));
        }

        function pintarChips(lista) {
            chips.replaceChildren(...(lista || []).map((t) => {
                const b = el('button', { type: 'button', class: 'chat-chip', text: t });
                b.addEventListener('click', () => preguntar(t));
                return b;
            }));
        }

        function agregarUsuario(texto) {
            log.append(el('div', { class: 'chat-msg usuario' }, [el('p', { text: texto })]));
        }

        function agregarBot(r) {
            const cuerpo = [el('p', { text: r.texto })];
            (r.items || []).forEach((it) => {
                cuerpo.push(el('div', { class: 'chat-item' }, [
                    el('h4', { text: it.titulo }),
                    it.detalle ? el('p', { class: 'chat-item-detalle', text: it.detalle }) : null,
                    (it.etiquetas && it.etiquetas.length) ? el('ul', { class: 'chat-etiquetas' }, it.etiquetas.map((t) => el('li', { text: t }))) : null,
                    (it.acciones && it.acciones.length) ? el('div', { class: 'chat-acciones' }, it.acciones.map(botonAccion)) : null
                ]));
            });
            log.append(el('div', { class: 'chat-msg bot' }, cuerpo));
            pintarChips(r.chips);
        }

        const bajar = () => { log.scrollTop = log.scrollHeight; };

        function preguntar(texto) {
            const t = String(texto || '').trim();
            if (!t) return;
            agregarUsuario(t);
            entrada.value = '';
            pintarChips([]);
            bajar();
            const respuesta = motor.responder(t);
            if (reducir) { agregarBot(respuesta); bajar(); return; }
            const escribiendo = el('div', { class: 'chat-msg bot escribiendo', 'aria-hidden': 'true' }, [el('span'), el('span'), el('span')]);
            log.append(escribiendo);
            bajar();
            setTimeout(() => { escribiendo.remove(); agregarBot(respuesta); bajar(); }, 380);
        }

        function reiniciar() {
            log.replaceChildren();
            agregarBot(motor.bienvenida());
            bajar();
        }

        function abrir() {
            panel.hidden = false;
            requestAnimationFrame(() => panel.classList.add('abierto'));
            fab.setAttribute('aria-expanded', 'true');
            fab.setAttribute('aria-label', 'Cerrar el asistente del portafolio');
            if (!log.children.length) reiniciar();
            setTimeout(() => entrada.focus(), 60);
        }

        function cerrar(devolverFoco = true) {
            panel.classList.remove('abierto');
            panel.hidden = true;
            fab.setAttribute('aria-expanded', 'false');
            fab.setAttribute('aria-label', 'Abrir el asistente del portafolio');
            if (devolverFoco) fab.focus();
        }

        fab.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
        btnCerrar.addEventListener('click', () => cerrar());
        btnReiniciar.addEventListener('click', reiniciar);
        form.addEventListener('submit', (e) => { e.preventDefault(); preguntar(entrada.value); });
        panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); cerrar(); } });
    }

    /* ---------------------------------------------------------------
       Arranque
       --------------------------------------------------------------- */
    global.PortafolioChat = { crearMotor };
    if (typeof module !== 'undefined' && module.exports) module.exports = { crearMotor };

    if (typeof document !== 'undefined' && global.DATOS && global.DATOS.curso) {
        const arrancar = () => iniciarUI(crearMotor(global.DATOS, global.CONOCIMIENTO || null));
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
        else arrancar();
    }
})();
