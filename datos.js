/* =====================================================================
   DATOS DEL PORTAFOLIO
   Este es el único archivo que necesitas editar para actualizar la página.

   1) PERFIL: tu nombre, datos, temas y enlaces de contacto.
      Si dejas un dato vacío ("") simplemente no se muestra.

   2) CURSO: las semanas con sus actividades y archivos.
      - Las semanas se numeran del 1 al 16. La unidad se calcula sola:
        semanas 1-4 = Unidad 1, 5-8 = Unidad 2, 9-12 = Unidad 3, 13-16 = Unidad 4.
      - Cada archivo se escribe así:  ["Nombre que se ve en la página", "nombre-real-del-archivo.png"]
      - El tipo se detecta por la extensión: PDF/Word/ZIP = documento, PNG/JPG = infografía.

   Para agregar una semana nueva, copia la plantilla que está al final de
   este archivo, pégala dentro de "semanas" y cambia los textos.
   ===================================================================== */

   window.DATOS = {

    /* ------------------------------ PERFIL ------------------------------ */
    perfil: {
      nombre: "Arthur Sebastian Curasma Vidal",
      nombreCorto: "UPLA",                     // el que aparece arriba, junto al logo
      curso: "Algoritmos y Estructuras de Datos",
  
      // Texto corto debajo de tu nombre
      presentacion:
        "Aquí reúno mis trabajos del curso, ordenados por semana: los enunciados en PDF y las infografías que explican cada proceso. Puedes verlos sin salir de la página y descargarlos.",
  
      // Tu foto: guárdala junto a index.html con este nombre (mejor si es vertical).
      // Si no existe, se muestran tus iniciales.
      foto: "foto.jpg",
  
      // Datos rápidos (etiqueta, valor). Completa "Universidad" y se mostrará solo.
      datos: [
        ["Carrera", "Ingeniería de Sistemas y Computación"],
        ["Ciclo", "IV"],
        ["Universidad", ""],
        ["Curso", "Algoritmos y Estructuras de Datos"]
      ],
  
      // Etiquetas de temas
      temas: [
        "Java",
        "Estructuras de control",
        "Arreglos",
        "Matrices",
        "Arreglos paralelos",
        "Búsqueda y ordenamiento",
        "Infografías de procesos"
      ],
  
      // Contacto (texto del botón, enlace). Los vacíos no se muestran.
      // Para el correo puedes escribir solo la dirección: "tucorreo@gmail.com"
      contacto: [
        ["GitHub", "https://github.com/sebastiancv-alt"],
        ["Correo", ""],
        ["LinkedIn", ""]
      ]
    },
  
    /* ------------------------------ CURSO ------------------------------- */
    curso: {
      semanasPorUnidad: 4,
      totalSemanas: 16,
  
      // Nombre de cada unidad (déjalo vacío si prefieres solo "Unidad 2", etc.)
      titulosUnidades: ["Fundamentos y arreglos", "Gestión de datos académicos", "", ""],
  
      semanas: [
  
        /* ============================ SEMANA 1 ============================ */
        {
          numero: 1,
          titulo: "Fundamentos de algoritmos",
          actividades: [
            {
              titulo: "Conceptos básicos de algoritmos",
              descripcion: "Definición, tipos de datos, operadores y estructuras algorítmicas iniciales.",
              carpeta: "archivos/semana1",
              archivos: [
                ["Actividad 1: Algoritmos", "Actividad 1 - Algoritmos.pdf"],
                ["Algoritmos", "infografia1.png"],
                ["Tipos de datos", "infografia2.jpg"],
                ["Operadores", "infografia3.png"],
                ["Estructuras secuenciales", "infografia4.png"]
              ]
            },
            {
              titulo: "Estructuras de control y notas",
              descripcion: "Condicionales, bucles y gestión de notas en pseudocódigo y código.",
              carpeta: "archivos/semana1",
              archivos: [
                ["Actividad 2: Notas", "Actividad 2 - Notas.pdf"],
                ["Estructura selectiva Si-Entonces", "infografia5.png"],
                ["Estructura selectiva Según", "infografia6.png"],
                ["Bucle Mientras", "infografia7.jpg"],
                ["Bucle Para", "infografia8.png"],
                ["Gestión de notas", "infografiagestionnotas.png"]
              ]
            }
          ]
        },
  
        /* ============================ SEMANA 2 ============================ */
        {
          numero: 2,
          titulo: "Arreglos y matrices",
          actividades: [
            {
              titulo: "Arreglos unidimensionales",
              descripcion: "Estructuras de datos lineales: creación, inicialización y recorrido.",
              carpeta: "archivos/semana2",
              archivos: [
                ["Arreglos unidimensionales", "arreglosunidimensionales.png"],
                ["Creación e inicialización", "creacioneinicializaciondelarreglo.png"],
                ["Mostrar datos", "mostrardatos.png"]
              ]
            },
            {
              titulo: "Arreglos bidimensionales",
              descripcion: "Matrices, llenado secuencial, búsquedas y operaciones con filas, columnas y diagonales.",
              carpeta: "archivos/semana2",
              archivos: [
                ["Búsqueda y ubicación de un elemento", "busquedayubicaciondeunelemento.png"],
                ["Crear matriz", "crearmatriz.png"],
                ["Imprimir la matriz", "imprimirvisualizarlamatriz.png"],
                ["Llenado secuencial", "llenadosecuencialdematriz.png"],
                ["Suma de la diagonal principal", "sumadeladiagonalprincipal.png"],
                ["Suma por columnas", "sumaporcolumnas.png"],
                ["Suma por filas", "sumaporfilas.png"]
              ]
            }
          ]
        },
  
        /* ============================ SEMANA 3 ============================ */
        {
          numero: 3,
          titulo: "Arreglos paralelos y ordenamiento",
          actividades: [
            {
              titulo: "Ejercicio 1: Arreglos paralelos",
              descripcion: "Manejo e implementación de arreglos paralelos.",
              carpeta: "archivos/semana3",
              archivos: [
                ["Enunciado 1", "Enunciado 1.pdf"],
                ["Arreglos paralelos", "arreglosparalelos.png"]
              ]
            },
            {
              titulo: "Ejercicio 2: Gestión modular",
              descripcion: "Gestión modular de empleados y procesamiento de datos.",
              carpeta: "archivos/semana3",
              archivos: [
                ["Enunciado 2", "Enunciado 2.pdf"],
                ["Gestión modular de empleados", "gestionmodulardeempleados.png"]
              ]
            },
            {
              titulo: "Ejercicio 3: Promedio de salón",
              descripcion: "Cálculos con dimensiones dinámicas.",
              carpeta: "archivos/semana3",
              archivos: [
                ["Enunciado 3", "Enunciado 3.pdf"],
                ["Promedio de salón con dimensiones dinámicas", "promediodesaloncondimensionesdinamicas.png"]
              ]
            },
            {
              titulo: "Ejercicio 4: Búsqueda y ordenamiento",
              descripcion: "Sistema completo de búsqueda y ordenamiento de arreglos.",
              carpeta: "archivos/semana3",
              archivos: [
                ["Enunciado 4", "Enunciado 4.pdf"],
                ["Sistema completo de búsqueda y ordenamiento", "sistemacompletobusquedayordenamiento.png"]
              ]
            },
            {
              titulo: "Ejercicio 5: Vectores paralelos",
              descripcion: "Estructuración y manipulación de vectores paralelos.",
              carpeta: "archivos/semana3",
              archivos: [
                ["Enunciado 5", "Enunciado 5.pdf"],
                ["Vectores paralelos", "vectoresparalelos.png"]
              ]
            }
          ]
        },
  
        /* ============================ SEMANA 4 ============================ */
        {
          numero: 4,
          titulo: "Registro académico e inventario",
          actividades: [
            {
              titulo: "Actividad 01: Registro académico",
              descripcion: "Control y métodos de registro académico (ArregloAlumno).",
              carpeta: "archivos/semana4/Actividad 01 – Control y Métodos de Registro Académico (ArregloAlumno)",
              archivos: [
                ["Proceso 1", "proceso1.png"],
                ["Proceso 2", "proceso2.png"],
                ["Proceso 3", "proceso3.png"],
                ["Proceso 4", "proceso4.png"],
                ["Proceso 5", "proceso5.png"],
                ["Proceso 6", "proceso6.png"]
              ]
            },
            {
              titulo: "Actividad 02: Control e inventario",
              descripcion: "Control de equipos e inventario de hardware en Java.",
              carpeta: "archivos/semana4/Actividad 02 – Control de Equipos e Inventario de Hardware",
              // Cuando una actividad tiene subcarpetas, se separan en "grupos".
              // La carpeta del grupo se escribe a partir de la carpeta de la actividad.
              grupos: [
                {
                  titulo: "Arreglo Alumno",
                  carpeta: "arreglo alumno java infografias",
                  archivos: [
                    ["Búsqueda por nombre", "busquedapornombre.png"],
                    ["Mover el primer elemento al final", "moverprimerelementoparalfinal.png"],
                    ["Promedio general", "promediogeneral.png"],
                    ["Identificación de extremos", "sisdegestionidentificaciondeextremos.jpg"],
                    ["Gestión académica", "sistemadegestionacademica.jpg"],
                    ["Ordenamiento académico", "sistemadegestionacademicaordenamiento.jpg"]
                  ]
                },
                {
                  titulo: "Arreglo Computadora",
                  carpeta: "arreglo computadora java infografias",
                  archivos: [
                    ["Gestión básica", "gestionbasicaactividad.jpg"],
                    ["Auditoría y ordenamiento", "sistemadegestionauditoriayordenamiento.jpg"],
                    ["Mantenimiento y modificación", "sistemadegestionmantenimientoymodificacion.jpg"],
                    ["Consultas y filtros", "sistemagestiondeinventarioconsultasyfiltros.jpg"]
                  ]
                }
              ]
            }
          ]
        }
  
        ,
        /* ============================ SEMANA 5 ============================ */
        {
          numero: 5,
          titulo: "Métodos de gestión académica",
          actividades: [
            {
              titulo: "Actividad 1: Métodos de la actividad Alumno",
              descripcion: "Búsqueda, listado, ordenamiento y consultas sobre el arreglo de alumnos, con el código del proyecto.",
              carpeta: "archivos/semana5/1-Infografias de los metodos de la actividad alumno",
              archivos: [
                ["Código del proyecto (GestionAlumnos)", "GestionAlumnos_S05.zip"],
                ["1. Buscar por nombre", "buscar_por_nombre_1.jpg"],
                ["2. Listar alumnos por carrera", "listar_alumnos_por_carrera_2.jpg"],
                ["3. Ordenar por apellidos", "ordenar_por_apellidos_3.jpg"],
                ["4. Ordenar por calificación final", "ordenar_por_calificacionfinal_4.jpg"],
                ["5. Gestión de alumnos", "gestion_alumnos_5.jpg"],
                ["6. Localizar líder académico", "localiza_lider_academico_6.jpg"],
                ["7. Obtener último alumno reprobado", "obtener_ultimo_alumno_reprobado_7.jpg"],
                ["8. Eliminar por carrera", "eliminar_carrera_8.jpg"],
                ["9. Contar por carrera", "contar_por_carrera_9.png"],
                ["10. Mostrar rango", "mostrar_rango_10.png"]
              ]
            },
            {
              titulo: "Actividad 2: Métodos del sistema académico",
              descripcion: "Control académico completo: estudiantes, cursos, matrículas y reportes, con el código del proyecto.",
              carpeta: "archivos/semana5/2-Metodos del sistema academico -infografias",
              grupos: [
                {
                  titulo: "Código del proyecto",
                  carpeta: "",
                  archivos: [
                    ["Código del proyecto (ControlAcadémico)", "ControlAcademico.zip"]
                  ]
                },
                {
                  titulo: "Gestión de estudiantes",
                  carpeta: "",
                  archivos: [
                    ["1. Registrar estudiante", "Regis_Estudiante_1.png"],
                    ["2. Listar estudiantes", "Listar_Estudiantes_2.png"],
                    ["3. Buscar estudiante", "Buscar_estudiante_3.png"],
                    ["4. Modificar estudiante", "modific_estud_4.png"],
                    ["5. Eliminar estudiante", "elim_estudiante_5.png"]
                  ]
                },
                {
                  titulo: "Gestión de cursos",
                  carpeta: "",
                  archivos: [
                    ["6. Registrar curso", "regist_curso_6.png"],
                    ["7. Listar cursos", "listar_cursos_7.png"],
                    ["8. Buscar curso", "buscar_curso_8.jpg"],
                    ["9. Modificar cursos", "modific_de_cursos_9.jpg"],
                    ["10. Eliminar curso", "eliminar_curso_10.jpg"]
                  ]
                },
                {
                  titulo: "Matrículas y calificaciones",
                  carpeta: "",
                  archivos: [
                    ["11. Registrar matrícula", "registrar_matricula_11.jpg"],
                    ["12. Recuperar inscripción", "recup_de_inscrip_12.jpg"],
                    ["13. Visualizar cursos por alumno", "visualizacion_cursos_por_alumno_13.jpg"],
                    ["14. Cambiar calificación", "cambiar_calificacion_14.jpg"],
                    ["15. Gestión de matrículas", "gestion_matriculas_15.jpg"]
                  ]
                },
                {
                  titulo: "Reportes",
                  carpeta: "",
                  archivos: [
                    ["16. Opciones de reporte", "opcion_de_reporte_16.jpg"],
                    ["17. Ranking académico", "ranking_academico_17.jpg"],
                    ["18. Estudiantes por carrera", "estudiante_por_carrera_18.jpg"],
                    ["19. Reporte de reprobados", "report_reprobados_19.jpg"],
                    ["20. Hallar mejor promedio", "hallar_mejor_promedio_20.jpg"]
                  ]
                }
              ]
            }
          ]
        }
  
        /* ---------------------------------------------------------------
           PLANTILLA PARA UNA SEMANA NUEVA
           Copia desde "," hasta el último "}", pégala justo antes del "]"
           que cierra "semanas", y cambia los textos.
  
        ,{
          numero: 6,
          titulo: "Título de la semana",
          actividades: [
            {
              titulo: "Nombre de la actividad",
              descripcion: "Una frase que explique de qué trata.",
              carpeta: "archivos/semana6",
              archivos: [
                ["Enunciado", "Enunciado.pdf"],
                ["Infografía del proceso", "infografia1.png"]
              ]
            }
          ]
        }
        --------------------------------------------------------------- */
      ]
    }
  };