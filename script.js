/* =====================================================================
   PORTAFOLIO: LÓGICA DE LA PÁGINA
   No necesitas editar este archivo. Tus datos están en datos.js.
   ===================================================================== */
(() => {
    'use strict';

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    const DATOS = window.DATOS;
    if (!DATOS || !DATOS.perfil || !DATOS.curso) {
        const aviso = document.createElement('p');
        aviso.className = 'aviso-error';
        aviso.textContent = 'No se pudo leer datos.js. Revisa que esté en la misma carpeta que index.html y que no tenga errores de escritura.';
        document.body.prepend(aviso);
        return;
    }

    const perfil = DATOS.perfil;
    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------------------------------------------------------------
       Utilidades
       --------------------------------------------------------------- */
    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
    const norm = (s) => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
    const unirRuta = (...partes) => partes
        .filter(Boolean)
        .map((p) => String(p).replace(/^\/+|\/+$/g, ''))
        .filter(Boolean)
        .join('/');
    const rutaUrl = (ruta) => ruta.split('/').map(encodeURIComponent).join('/');
    const extension = (nombre) => (nombre.includes('.') ? nombre.split('.').pop() : '').toLowerCase();
    const limpiarNombre = (s) => s.replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, ' ').trim();
    const limitar = (v, min, max) => Math.min(max, Math.max(min, v));
    const espera = (ms) => new Promise((r) => setTimeout(r, ms));

    const EXT_IMAGEN = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'avif'];
    const tipoDe = (ext) => (EXT_IMAGEN.includes(ext) ? 'imagen' : 'documento');
    const sePuedeVer = (ext) => EXT_IMAGEN.includes(ext) || ext === 'pdf';

    const trazo = (d) => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${d}</svg>`;
    const IC = {
        descargar: trazo('<path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/>'),
        ojo: trazo('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>'),
        documento: trazo('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>'),
        lupa: trazo('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3M11 8v6M8 11h6"/>'),
        chevron: trazo('<path d="m6 9 6 6 6-6"/>'),
        pausa: trazo('<path d="M8 5v14M16 5v14"/>'),
        play: trazo('<path d="m7 5 12 7-12 7Z"/>')
    };

    /* ---------------------------------------------------------------
       Modelo: semanas, actividades y archivos
       --------------------------------------------------------------- */
    const SPU = Number(DATOS.curso.semanasPorUnidad) || 4;
    const archivosPorId = new Map();
    let contadorId = 0;

    function crearArchivo(base) {
        const archivo = { id: contadorId++, ...base };
        archivo.busqueda = norm([
            archivo.titulo, archivo.actividad, archivo.actividadDesc, archivo.grupo,
            archivo.semanaTitulo, `semana ${archivo.semana}`, archivo.ext
        ].join(' '));
        archivosPorId.set(archivo.id, archivo);
        return archivo;
    }

    function construirSemana(datosSemana, indice) {
        const numero = Number(datosSemana.numero) || indice + 1;
        const unidad = Math.ceil(numero / SPU);
        const archivos = [];

        const actividades = (datosSemana.actividades || []).map((a) => {
            const fuentes = [];
            if (a.archivos && a.archivos.length) fuentes.push({ titulo: '', carpeta: '', archivos: a.archivos });
            (a.grupos || []).forEach((g) => fuentes.push({ titulo: g.titulo || '', carpeta: g.carpeta || '', archivos: g.archivos || [] }));

            const grupos = fuentes.map((g) => ({
                titulo: g.titulo,
                archivos: g.archivos.map(([titulo, nombre]) => {
                    const ext = extension(nombre);
                    const ruta = unirRuta(a.carpeta, g.carpeta, nombre);
                    const archivo = crearArchivo({
                        titulo,
                        ruta,
                        url: rutaUrl(ruta),
                        ext,
                        tipo: tipoDe(ext),
                        ver: sePuedeVer(ext),
                        descarga: `${limpiarNombre(`Semana ${numero} - ${titulo}`)}.${ext}`,
                        semana: numero,
                        semanaTitulo: datosSemana.titulo || '',
                        actividad: a.titulo || '',
                        actividadDesc: a.descripcion || '',
                        grupo: g.titulo
                    });
                    archivos.push(archivo);
                    return archivo;
                })
            }));

            return { titulo: a.titulo || '', descripcion: a.descripcion || '', grupos };
        });

        return { id: `semana-${numero}`, numero, unidad, titulo: datosSemana.titulo || '', actividades, archivos };
    }

    const semanas = (DATOS.curso.semanas || [])
        .map(construirSemana)
        .sort((a, b) => a.numero - b.numero);

    const TOTAL_UNIDADES = Math.max(
        Math.ceil((Number(DATOS.curso.totalSemanas) || 16) / SPU),
        ...semanas.map((s) => s.unidad)
    );
    const TOTAL_SEMANAS = TOTAL_UNIDADES * SPU;
    const titulosUnidades = DATOS.curso.titulosUnidades || [];

    const unidades = Array.from({ length: TOTAL_UNIDADES }, (_, i) => ({
        numero: i + 1,
        titulo: titulosUnidades[i] || '',
        semanas: semanas.filter((s) => s.unidad === i + 1)
    }));

    /* ---------------------------------------------------------------
       Estado
       --------------------------------------------------------------- */
    const estado = {
        unidad: semanas.length ? semanas[semanas.length - 1].unidad : 1,
        tipo: 'todo',
        consulta: '',
        abiertas: new Set()
    };

    const buscando = () => estado.consulta.trim() !== '';
    const filtrando = () => buscando() || estado.tipo !== 'todo';
    const raiz = (p) => (p.length >= 5 ? p.slice(0, -1) : p);
    const palabras = () => norm(estado.consulta).split(/\s+/).filter(Boolean).map(raiz);
    const coincide = (archivo, ps) => (
        (estado.tipo === 'todo' || archivo.tipo === estado.tipo) &&
        ps.every((p) => archivo.busqueda.includes(p))
    );
    const semanasEnVista = () => (buscando() ? semanas : unidades[estado.unidad - 1].semanas);

    /* ---------------------------------------------------------------
       Perfil
       --------------------------------------------------------------- */
    function renderPerfil() {
        document.title = `${perfil.nombre} | Portafolio de ${perfil.curso}`;
        $('#nombre').textContent = perfil.nombre;
        $('#marca-texto').textContent = perfil.nombreCorto || perfil.nombre;
        $('#curso').textContent = perfil.curso;
        $('#presentacion').textContent = perfil.presentacion || '';

        $('#bio').innerHTML = (perfil.bio || []).map((t) => `<p>${esc(t)}</p>`).join('');

        const datos = (perfil.datos || []).filter(([, valor]) => valor);
        const dl = $('#datos-perfil');
        dl.innerHTML = datos.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
        dl.hidden = !datos.length;

        const temas = perfil.temas || [];
        $('#temas').innerHTML = temas.map((t) => `<li>${esc(t)}</li>`).join('');
        $('#bloque-temas').hidden = !temas.length;

        const enlaces = (perfil.contacto || []).filter(([, url]) => url);
        $('#contacto-enlaces').innerHTML = enlaces.map(([texto, url]) => {
            const href = /@/.test(url) && !/^(mailto:|https?:)/i.test(url) ? `mailto:${url}` : url;
            const externo = /^https?:/i.test(href);
            return `<a class="btn btn-fantasma" href="${esc(href)}"${externo ? ' target="_blank" rel="noopener"' : ''}>${esc(texto)}</a>`;
        }).join('');
        $('#contacto').hidden = !enlaces.length;
        $('#nav-contacto').hidden = !enlaces.length;

        $('#pie-texto').textContent = `© ${new Date().getFullYear()} ${perfil.nombre}. ${perfil.curso}.`;

        // Foto con respaldo de iniciales
        const partes = perfil.nombre.split(/\s+/).filter(Boolean);
        const iniciales = partes.length >= 4 ? partes[0][0] + partes[2][0] : partes.slice(0, 2).map((p) => p[0]).join('');
        $('#foto-iniciales').textContent = iniciales.toUpperCase();
        const foto = $('#foto-img');
        foto.alt = `Foto de ${perfil.nombre}`;
        foto.addEventListener('load', () => $('#foto').classList.add('tiene-foto'));
        if (perfil.foto) foto.src = perfil.foto;

        // Foto pequeña junto al nombre (misma imagen, con iniciales de respaldo)
        $('#avatar-iniciales').textContent = iniciales.toUpperCase();
        const avatar = $('#avatar-img');
        avatar.alt = `Foto de ${perfil.nombre}`;
        avatar.addEventListener('load', () => $('#avatar').classList.add('tiene-foto'));
        if (perfil.foto) avatar.src = perfil.foto;
    }

    /* ---------------------------------------------------------------
       Avance del curso (16 bloques agrupados por unidad)
       --------------------------------------------------------------- */
    function renderAvance() {
        $('#avance-texto').innerHTML = `<strong>${semanas.length} de ${TOTAL_SEMANAS}</strong> semanas publicadas`;
        $('#avance-pista').innerHTML = unidades.map((u) => {
            const bloques = Array.from({ length: SPU }, (_, i) => {
                const numero = (u.numero - 1) * SPU + i + 1;
                const sem = u.semanas.find((s) => s.numero === numero);
                if (sem) {
                    const nombre = `Semana ${numero}${sem.titulo ? `: ${sem.titulo}` : ''}`;
                    return `<button type="button" class="avance-bloque" data-listo="true" data-semana-num="${numero}" aria-label="Ir a ${esc(nombre)}" title="${esc(nombre)}"></button>`;
                }
                return `<span class="avance-bloque" data-listo="false" role="img" aria-label="Semana ${numero}: aún sin trabajos" title="Semana ${numero}: pendiente"></span>`;
            }).join('');
            return `<li class="avance-grupo"><div class="avance-bloques">${bloques}</div><span class="avance-nombre">Unidad ${u.numero}</span></li>`;
        }).join('');
    }

    /* ---------------------------------------------------------------
       Pestañas de unidades
       --------------------------------------------------------------- */
    const tabsEl = $('#tabs');
    const semanasEl = $('#semanas');

    function renderTabs() {
        tabsEl.innerHTML = unidades.map((u) => (
            `<button type="button" role="tab" class="tab${u.semanas.length ? '' : ' vacia'}" id="tab-u${u.numero}" data-unidad="${u.numero}" aria-controls="semanas"${u.semanas.length ? '' : ' title="Aún sin trabajos"'}>Unidad ${u.numero}</button>`
        )).join('');
        marcarTabs();
    }

    function marcarTabs() {
        $$('.tab', tabsEl).forEach((t) => {
            const activa = Number(t.dataset.unidad) === estado.unidad && !buscando();
            t.setAttribute('aria-selected', String(activa));
            t.tabIndex = Number(t.dataset.unidad) === estado.unidad ? 0 : -1;
        });
        tabsEl.classList.toggle('en-busqueda', buscando());
        const activa = $(`#tab-u${estado.unidad}`);
        if (activa && !buscando()) semanasEl.setAttribute('aria-labelledby', activa.id);
        else semanasEl.removeAttribute('aria-labelledby');
    }

    function elegirUnidad(numero) {
        if (buscando()) {
            estado.consulta = '';
            $('#buscar').value = '';
        }
        estado.unidad = numero;
        marcarTabs();
        renderSemanas();
    }

    tabsEl.addEventListener('click', (e) => {
        const boton = e.target.closest('[data-unidad]');
        if (boton) elegirUnidad(Number(boton.dataset.unidad));
    });

    tabsEl.addEventListener('keydown', (e) => {
        const teclas = { ArrowLeft: -1, ArrowRight: 1, Home: 'inicio', End: 'fin' };
        if (!(e.key in teclas)) return;
        e.preventDefault();
        let destino = estado.unidad;
        if (e.key === 'Home') destino = 1;
        else if (e.key === 'End') destino = TOTAL_UNIDADES;
        else destino = limitar(estado.unidad + teclas[e.key], 1, TOTAL_UNIDADES);
        elegirUnidad(destino);
        $(`#tab-u${destino}`).focus();
    });

    /* ---------------------------------------------------------------
       Render de semanas
       --------------------------------------------------------------- */
    function htmlArchivoDoc(f) {
        return `
            <li class="doc">
                <span class="doc-icono" aria-hidden="true">${IC.documento}</span>
                <span class="doc-textos">
                    <span class="doc-nombre">${esc(f.titulo)}</span>
                    <span class="doc-tipo">${esc(f.ext.toUpperCase())}</span>
                </span>
                <span class="doc-acciones">
                    ${f.ver ? `<button type="button" class="btn btn-fantasma btn-sm" data-ver="${f.id}" aria-label="Ver ${esc(f.titulo)}">${IC.ojo}Ver</button>` : ''}
                    <a class="btn btn-primario btn-sm" href="${esc(f.url)}" download="${esc(f.descarga)}" aria-label="Descargar ${esc(f.titulo)}">${IC.descargar}Descargar</a>
                </span>
            </li>`;
    }

    function htmlArchivoImg(f) {
        return `
            <figure class="tile">
                <button type="button" class="tile-vista" data-ver="${f.id}" aria-label="Ver ${esc(f.titulo)} en grande">
                    <img data-src="${esc(f.url)}" alt="" decoding="async" loading="lazy">
                    <span class="tile-lupa" aria-hidden="true">${IC.lupa}</span>
                    <span class="tile-error" aria-hidden="true">No se encontró el archivo</span>
                </button>
                <figcaption>
                    <span class="tile-nombre">${esc(f.titulo)}</span>
                    <a class="icon-btn" href="${esc(f.url)}" download="${esc(f.descarga)}" aria-label="Descargar ${esc(f.titulo)}" title="Descargar">${IC.descargar}</a>
                </figcaption>
            </figure>`;
    }

    function htmlSemana(sem, ids, mostrarUnidad) {
        const abierta = estado.abiertas.has(sem.id);
        const visibles = sem.archivos.filter((f) => ids.has(f.id));
        const nDocs = visibles.filter((f) => f.tipo === 'documento').length;
        const nImgs = visibles.filter((f) => f.tipo === 'imagen').length;

        const sub = mostrarUnidad
            ? `Unidad ${sem.unidad}${sem.titulo ? `: ${sem.titulo}` : ''}`
            : sem.titulo;

        const actividades = sem.actividades.map((a) => {
            const grupos = a.grupos.map((g) => {
                const archivos = g.archivos.filter((f) => ids.has(f.id));
                if (!archivos.length) return '';
                const docs = archivos.filter((f) => f.tipo === 'documento');
                const imgs = archivos.filter((f) => f.tipo === 'imagen');
                return `
                    <div class="grupo">
                        ${g.titulo ? `<h5 class="grupo-titulo">${esc(g.titulo)}</h5>` : ''}
                        ${docs.length ? `<ul class="docs">${docs.map(htmlArchivoDoc).join('')}</ul>` : ''}
                        ${imgs.length ? `<div class="galeria">${imgs.map(htmlArchivoImg).join('')}</div>` : ''}
                    </div>`;
            }).join('');
            if (!grupos.trim()) return '';
            return `
                <section class="actividad">
                    <h4 class="actividad-titulo">${esc(a.titulo)}</h4>
                    ${a.descripcion ? `<p class="actividad-desc">${esc(a.descripcion)}</p>` : ''}
                    ${grupos}
                </section>`;
        }).join('');

        return `
            <article class="semana${abierta ? ' abierta' : ''}" id="${sem.id}">
                <h3 class="semana-cab">
                    <button type="button" class="semana-boton" data-semana="${sem.id}" aria-expanded="${abierta}" aria-controls="${sem.id}-cuerpo">
                        <span class="semana-textos">
                            <span class="semana-nombre">Semana ${sem.numero}</span>
                            ${sub ? `<span class="semana-sub">${esc(sub)}</span>` : ''}
                        </span>
                        <span class="semana-cuentas">
                            ${nDocs ? `<span class="cuenta cuenta--doc">${plural(nDocs, 'documento', 'documentos')}</span>` : ''}
                            ${nImgs ? `<span class="cuenta cuenta--img">${plural(nImgs, 'infografía', 'infografías')}</span>` : ''}
                        </span>
                        ${IC.chevron.replace('class="ic"', 'class="ic chevron"')}
                    </button>
                </h3>
                <div class="semana-cuerpo" id="${sem.id}-cuerpo">
                    <div class="semana-cuerpo-in"${abierta ? '' : ' inert'}>
                        <div class="semana-contenido">${actividades}</div>
                    </div>
                </div>
            </article>`;
    }

    function htmlVacio() {
        const unidad = unidades[estado.unidad - 1];
        if (!filtrando() && !unidad.semanas.length) {
            return `<div class="vacio"><p>Todavía no subo trabajos de la Unidad ${unidad.numero}. Aparecerán aquí a medida que avance el curso.</p></div>`;
        }
        const q = estado.consulta.trim();
        const mensaje = q
            ? `No encontré archivos para «${esc(q)}». Prueba con otra palabra, por ejemplo «matriz» o «bucle».`
            : 'No hay archivos de ese tipo en esta unidad.';
        return `<div class="vacio"><p>${mensaje}</p><button type="button" class="btn btn-fantasma btn-sm" data-limpiar>Quitar filtros</button></div>`;
    }

    function renderSemanas() {
        const ps = palabras();
        const enBusqueda = buscando();
        let html = '';
        let nSemanas = 0, nDocs = 0, nImgs = 0;

        semanasEnVista().forEach((sem) => {
            const visibles = sem.archivos.filter((f) => coincide(f, ps));
            if (!visibles.length) return;
            nSemanas++;
            nDocs += visibles.filter((f) => f.tipo === 'documento').length;
            nImgs += visibles.filter((f) => f.tipo === 'imagen').length;
            html += htmlSemana(sem, new Set(visibles.map((f) => f.id)), enBusqueda);
        });

        semanasEl.innerHTML = html || htmlVacio();

        // Resumen
        const resumen = $('#resumen');
        if (!html) {
            resumen.textContent = '';
        } else {
            const detalle = `${plural(nSemanas, 'semana', 'semanas')}, ${plural(nDocs, 'documento', 'documentos')} y ${plural(nImgs, 'infografía', 'infografías')}.`;
            if (enBusqueda) {
                resumen.textContent = `Resultados para «${estado.consulta.trim()}» en todas las unidades: ${detalle}`;
            } else {
                const u = unidades[estado.unidad - 1];
                resumen.textContent = `Unidad ${u.numero}${u.titulo ? `, ${u.titulo}` : ''}: ${detalle}`;
            }
        }

        $$('.semana.abierta', semanasEl).forEach(cargarImagenes);
    }

    // Las miniaturas solo se descargan cuando la semana está abierta.
    function cargarImagenes(contenedor) {
        $$('img[data-src]', contenedor).forEach((img) => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }

    semanasEl.addEventListener('load', (e) => {
        if (e.target.tagName === 'IMG') e.target.classList.add('cargada');
    }, true);
    semanasEl.addEventListener('error', (e) => {
        if (e.target.tagName === 'IMG') {
            const vista = e.target.closest('.tile-vista');
            if (vista) vista.classList.add('error');
        }
    }, true);

    function alternarSemana(id, boton) {
        const art = boton.closest('.semana');
        const abrir = !art.classList.contains('abierta');
        art.classList.toggle('abierta', abrir);
        boton.setAttribute('aria-expanded', String(abrir));
        $('.semana-cuerpo-in', art).inert = !abrir;
        if (abrir) {
            estado.abiertas.add(id);
            cargarImagenes(art);
            history.replaceState(null, '', `#${id}`);
        } else {
            estado.abiertas.delete(id);
        }
    }

    semanasEl.addEventListener('click', (e) => {
        const ver = e.target.closest('[data-ver]');
        if (ver) return abrirVisor(Number(ver.dataset.ver), ver);
        const semana = e.target.closest('[data-semana]');
        if (semana) return alternarSemana(semana.dataset.semana, semana);
        if (e.target.closest('[data-limpiar]')) limpiarFiltros();
    });

    function irASemana(numero) {
        const sem = semanas.find((s) => s.numero === numero);
        if (!sem) return;
        estado.consulta = '';
        estado.tipo = 'todo';
        $('#buscar').value = '';
        marcarTipos();
        estado.unidad = sem.unidad;
        estado.abiertas.add(sem.id);
        marcarTabs();
        renderSemanas();
        const el = document.getElementById(sem.id);
        if (el) el.scrollIntoView({ behavior: reducirMovimiento ? 'auto' : 'smooth', block: 'start' });
        history.replaceState(null, '', `#${sem.id}`);
    }

    $('#avance-pista').addEventListener('click', (e) => {
        const bloque = e.target.closest('[data-semana-num]');
        if (bloque) irASemana(Number(bloque.dataset.semanaNum));
    });

    /* ---------------------------------------------------------------
       Búsqueda y filtros
       --------------------------------------------------------------- */
    function marcarTipos() {
        $$('#tipos button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tipo === estado.tipo)));
    }

    function aplicarFiltros() {
        if (filtrando()) {
            const ps = palabras();
            semanasEnVista().forEach((s) => {
                if (s.archivos.some((f) => coincide(f, ps))) estado.abiertas.add(s.id);
            });
        }
        marcarTabs();
        renderSemanas();
    }

    function limpiarFiltros() {
        estado.consulta = '';
        estado.tipo = 'todo';
        $('#buscar').value = '';
        marcarTipos();
        marcarTabs();
        renderSemanas();
    }

    let temporizador;
    $('#buscar').addEventListener('input', (e) => {
        clearTimeout(temporizador);
        temporizador = setTimeout(() => {
            estado.consulta = e.target.value;
            aplicarFiltros();
        }, 150);
    });

    $('#tipos').addEventListener('click', (e) => {
        const boton = e.target.closest('[data-tipo]');
        if (!boton) return;
        estado.tipo = boton.dataset.tipo;
        marcarTipos();
        aplicarFiltros();
    });

    /* ---------------------------------------------------------------
       Visor: vista previa, zoom, arrastre y descarga
       --------------------------------------------------------------- */
    const V = {
        el: $('#visor'),
        escenario: $('#visor-escenario'),
        img: $('#visor-img'),
        pdf: $('#visor-pdf'),
        estado: $('#visor-estado'),
        titulo: $('#visor-titulo'),
        sub: $('#visor-sub'),
        contador: $('#visor-contador'),
        pasos: $('#visor-pasos'),
        zoom: $('#visor-zoom'),
        valor: $('#visor-valor'),
        ayuda: $('#visor-ayuda'),
        descarga: $('#visor-descarga'),
        abrir: $('#visor-abrir'),
        lista: [],
        i: 0,
        token: 0,
        modo: 'imagen',
        k: 1, x: 0, y: 0, fit: 1, nw: 0, nh: 0,
        foco: null
    };

    const tamanoEscenario = () => {
        const r = V.escenario.getBoundingClientRect();
        return { w: r.width, h: r.height, izq: r.left, arr: r.top };
    };

    function pintar() {
        V.img.style.transform = `translate3d(${V.x}px, ${V.y}px, 0) scale(${V.k})`;
        V.valor.textContent = `${Math.round(V.k * 100)}%`;
    }

    function acotar() {
        const { w, h } = tamanoEscenario();
        const ancho = V.nw * V.k;
        const alto = V.nh * V.k;
        V.x = ancho <= w ? (w - ancho) / 2 : limitar(V.x, w - ancho, 0);
        V.y = alto <= h ? (h - alto) / 2 : limitar(V.y, h - alto, 0);
    }

    function ajustarVista() {
        if (!V.nw || !V.nh) return;
        const { w, h } = tamanoEscenario();
        V.fit = Math.min((w - 24) / V.nw, (h - 24) / V.nh, 1);
        V.k = V.fit;
        acotar();
        pintar();
    }

    function zoomEn(nuevoK, cx, cy) {
        const maxK = Math.max(V.fit * 8, 4);
        nuevoK = limitar(nuevoK, V.fit, maxK);
        const razon = nuevoK / V.k;
        V.x = cx - (cx - V.x) * razon;
        V.y = cy - (cy - V.y) * razon;
        V.k = nuevoK;
        acotar();
        pintar();
    }

    function zoomBoton(factor) {
        const { w, h } = tamanoEscenario();
        zoomEn(V.k * factor, w / 2, h / 2);
    }

    function mostrar(indice) {
        const n = V.lista.length;
        if (!n) return;
        V.i = (indice + n) % n;
        const f = V.lista[V.i];
        const token = ++V.token;

        V.titulo.textContent = f.titulo;
        V.sub.textContent = `Semana ${f.semana}: ${f.actividad}${f.grupo ? `, ${f.grupo}` : ''}`;
        V.contador.textContent = n > 1 ? `${V.i + 1} de ${n}` : '';
        V.pasos.hidden = n <= 1;
        V.descarga.href = f.url;
        V.descarga.setAttribute('download', f.descarga);
        V.abrir.href = f.url;

        if (f.tipo === 'imagen') {
            V.modo = 'imagen';
            V.escenario.dataset.modo = 'imagen';
            V.escenario.classList.remove('arrastrando');
            V.pdf.hidden = true;
            V.pdf.src = 'about:blank';
            V.zoom.hidden = false;
            V.ayuda.hidden = false;
            V.img.classList.remove('lista');
            V.img.alt = f.titulo;
            V.estado.textContent = 'Cargando…';
            V.estado.hidden = false;

            V.img.onload = () => {
                if (token !== V.token) return;
                V.nw = V.img.naturalWidth || 1000;
                V.nh = V.img.naturalHeight || 1000;
                V.img.style.width = `${V.nw}px`;
                V.img.style.height = `${V.nh}px`;
                ajustarVista();
                V.img.classList.add('lista');
                V.estado.hidden = true;
            };
            V.img.onerror = () => {
                if (token !== V.token) return;
                V.estado.textContent = 'No se pudo cargar este archivo. Revisa que la ruta en datos.js coincida con el nombre real del archivo.';
                V.estado.hidden = false;
            };
            V.img.src = f.url;
        } else {
            V.modo = 'pdf';
            V.escenario.dataset.modo = 'pdf';
            V.img.classList.remove('lista');
            V.img.removeAttribute('src');
            V.zoom.hidden = true;
            V.ayuda.hidden = true;
            V.estado.hidden = true;
            V.pdf.hidden = false;
            V.pdf.src = `${f.url}#view=FitH`;
        }

        // Precarga de las imágenes vecinas
        [V.i - 1, V.i + 1].forEach((j) => {
            const vecino = V.lista[(j + n) % n];
            if (vecino && vecino.tipo === 'imagen') new Image().src = vecino.url;
        });
    }

    function abrirVisor(id, disparador) {
        const f = archivosPorId.get(id);
        if (!f) return;
        const sem = semanas.find((s) => s.numero === f.semana);
        const ps = palabras();
        V.lista = sem.archivos.filter((a) => a.ver && coincide(a, ps));
        if (!V.lista.some((a) => a.id === f.id)) V.lista.push(f);
        V.foco = disparador || document.activeElement;

        V.el.hidden = false;
        document.body.classList.add('sin-scroll');
        requestAnimationFrame(() => V.el.classList.add('visible'));
        mostrar(V.lista.findIndex((a) => a.id === f.id));
        $('#visor-cerrar').focus();
    }

    function cerrarVisor() {
        V.token++;
        V.el.classList.remove('visible');
        document.body.classList.remove('sin-scroll');
        setTimeout(() => {
            if (V.el.classList.contains('visible')) return;
            V.el.hidden = true;
            V.img.removeAttribute('src');
            V.pdf.src = 'about:blank';
        }, 220);
        if (V.foco && typeof V.foco.focus === 'function') V.foco.focus();
    }

    $('#visor-cerrar').addEventListener('click', cerrarVisor);
    $('#visor-ant').addEventListener('click', () => mostrar(V.i - 1));
    $('#visor-sig').addEventListener('click', () => mostrar(V.i + 1));
    $('#visor-mas').addEventListener('click', () => zoomBoton(1.25));
    $('#visor-menos').addEventListener('click', () => zoomBoton(1 / 1.25));
    $('#visor-ajustar').addEventListener('click', ajustarVista);

    // Rueda del mouse: zoom hacia el cursor
    V.escenario.addEventListener('wheel', (e) => {
        if (V.modo !== 'imagen') return;
        e.preventDefault();
        const { izq, arr } = tamanoEscenario();
        const factor = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015));
        zoomEn(V.k * factor, e.clientX - izq, e.clientY - arr);
    }, { passive: false });

    // Arrastre con un dedo o el mouse, pellizco con dos dedos
    const punteros = new Map();
    let arrastre = null;
    let pellizco = null;

    V.escenario.addEventListener('pointerdown', (e) => {
        if (V.modo !== 'imagen') return;
        V.escenario.setPointerCapture(e.pointerId);
        punteros.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (punteros.size === 1) {
            arrastre = { x0: e.clientX, y0: e.clientY, xi: V.x, yi: V.y };
            V.escenario.classList.add('arrastrando');
        } else if (punteros.size === 2) {
            const [a, b] = [...punteros.values()];
            pellizco = { d: Math.hypot(a.x - b.x, a.y - b.y), k: V.k };
            arrastre = null;
        }
    });

    V.escenario.addEventListener('pointermove', (e) => {
        if (!punteros.has(e.pointerId)) return;
        punteros.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pellizco && punteros.size === 2) {
            const [a, b] = [...punteros.values()];
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            const { izq, arr } = tamanoEscenario();
            zoomEn(pellizco.k * (d / pellizco.d), (a.x + b.x) / 2 - izq, (a.y + b.y) / 2 - arr);
        } else if (arrastre) {
            V.x = arrastre.xi + (e.clientX - arrastre.x0);
            V.y = arrastre.yi + (e.clientY - arrastre.y0);
            acotar();
            pintar();
        }
    });

    function soltar(e) {
        if (!punteros.has(e.pointerId)) return;
        punteros.delete(e.pointerId);
        if (arrastre && punteros.size === 0 && e.type === 'pointerup') {
            const dx = e.clientX - arrastre.x0;
            const dy = e.clientY - arrastre.y0;
            // Deslizar de lado en la vista ajustada cambia de archivo
            if (V.k <= V.fit * 1.01 && Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                mostrar(V.i + (dx < 0 ? 1 : -1));
            }
        }
        if (punteros.size < 2) pellizco = null;
        if (punteros.size === 0) {
            arrastre = null;
            V.escenario.classList.remove('arrastrando');
        }
    }
    V.escenario.addEventListener('pointerup', soltar);
    V.escenario.addEventListener('pointercancel', soltar);

    V.escenario.addEventListener('dblclick', (e) => {
        if (V.modo !== 'imagen') return;
        const { izq, arr } = tamanoEscenario();
        if (V.k > V.fit * 1.05) ajustarVista();
        else zoomEn(Math.max(1, V.fit * 2), e.clientX - izq, e.clientY - arr);
    });

    window.addEventListener('resize', () => {
        if (V.el.hidden || V.modo !== 'imagen' || !V.nw) return;
        const estabaAjustada = Math.abs(V.k - V.fit) < 0.001;
        if (estabaAjustada) ajustarVista();
        else { acotar(); pintar(); }
    });

    document.addEventListener('keydown', (e) => {
        if (V.el.hidden) return;
        if (e.key === 'Escape') { e.preventDefault(); cerrarVisor(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); mostrar(V.i - 1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); mostrar(V.i + 1); }
        else if (V.modo === 'imagen' && (e.key === '+' || e.key === '=')) zoomBoton(1.25);
        else if (V.modo === 'imagen' && (e.key === '-' || e.key === '_')) zoomBoton(1 / 1.25);
        else if (V.modo === 'imagen' && e.key === '0') ajustarVista();
        else if (e.key === 'Tab') {
            const enfocables = $$('button, a[href]', V.el).filter((el) => !el.disabled && el.offsetParent !== null);
            if (!enfocables.length) return;
            const primero = enfocables[0];
            const ultimo = enfocables[enfocables.length - 1];
            if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
            else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
        }
    });

    /* ---------------------------------------------------------------
       Portada: un arreglo que se ordena solo (burbuja)
       --------------------------------------------------------------- */
    function iniciarOrden() {
        const cont = $('#orden-barras');
        const contador = $('#orden-contador');
        const boton = $('#orden-pausa');
        const N = 12;
        cont.style.setProperty('--n', N);

        let barras = [];
        let comparaciones = 0;
        let pausado = false;
        let visible = true;

        const crearBarras = (ordenadas) => {
            const valores = Array.from({ length: N }, (_, i) => i + 1);
            if (!ordenadas) {
                do {
                    for (let i = N - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [valores[i], valores[j]] = [valores[j], valores[i]];
                    }
                } while (valores.every((v, i) => v === i + 1));
            }
            cont.innerHTML = '';
            barras = valores.map((v, i) => {
                const el = document.createElement('div');
                el.className = 'barra' + (ordenadas ? ' listo' : '');
                el.style.setProperty('--i', i);
                el.style.setProperty('--h', `${14 + ((v - 1) / (N - 1)) * 86}%`);
                el.innerHTML = '<span></span>';
                cont.appendChild(el);
                return { el, v };
            });
        };

        const actualizarContador = () => {
            contador.textContent = plural(comparaciones, 'comparación', 'comparaciones');
        };

        if (reducirMovimiento) {
            crearBarras(true);
            contador.textContent = 'Arreglo ordenado';
            boton.hidden = true;
            return;
        }

        const ajustarBoton = () => {
            boton.innerHTML = pausado ? IC.play : IC.pausa;
            boton.setAttribute('aria-pressed', String(pausado));
            const texto = pausado ? 'Reanudar animación' : 'Pausar animación';
            boton.setAttribute('aria-label', texto);
            boton.title = texto;
        };
        ajustarBoton();
        boton.addEventListener('click', () => { pausado = !pausado; ajustarBoton(); });

        new IntersectionObserver((entradas) => { visible = entradas[0].isIntersecting; }).observe(cont);

        const puedeAvanzar = async () => {
            while (pausado || document.hidden || !visible) await espera(250);
        };

        (async function ciclo() {
            for (;;) {
                crearBarras(false);
                comparaciones = 0;
                actualizarContador();
                await espera(1000);

                for (let pasada = 0; pasada < N - 1; pasada++) {
                    let huboCambio = false;
                    for (let j = 0; j < N - 1 - pasada; j++) {
                        await puedeAvanzar();
                        barras[j].el.classList.add('comparando');
                        barras[j + 1].el.classList.add('comparando');
                        comparaciones++;
                        actualizarContador();
                        await espera(110);

                        if (barras[j].v > barras[j + 1].v) {
                            [barras[j], barras[j + 1]] = [barras[j + 1], barras[j]];
                            barras[j].el.style.setProperty('--i', j);
                            barras[j + 1].el.style.setProperty('--i', j + 1);
                            huboCambio = true;
                            await espera(240);
                        }
                        barras[j].el.classList.remove('comparando');
                        barras[j + 1].el.classList.remove('comparando');
                    }
                    barras[N - 1 - pasada].el.classList.add('listo');
                    if (!huboCambio) break;
                }
                barras.forEach((b) => b.el.classList.add('listo'));
                await espera(2800);
            }
        })();
    }

    /* ---------------------------------------------------------------
       Inicio
       --------------------------------------------------------------- */
    renderPerfil();
    renderAvance();
    renderTabs();
    renderSemanas();
    iniciarOrden();

    function leerHash() {
        const m = location.hash.match(/^#semana-(\d+)$/);
        if (m) irASemana(Number(m[1]));
    }
    leerHash();
    window.addEventListener('hashchange', leerHash);
})();
