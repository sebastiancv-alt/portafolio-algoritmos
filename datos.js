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
        },

        /* ============================ SEMANA 6 ============================ */
        {
          numero: 6,
          titulo: "Pilas",
          actividades: [
            {
              titulo: "Actividad 1: Gestión de pila de estudiantes",
              descripcion: "Métodos de la pila de estudiantes, con el código del proyecto.",
              carpeta: "archivos/semana6/actividad_1",
              archivos: [
                ["Código del proyecto (GestionPilaEstudiantes)", "GestionPilaEstudiantes.zip"],
                ["Método 1", "act_1_metodo_01.png"],
                ["Método 2", "act_1_metodo_02.png"],
                ["Método 3", "act_1_metodo_03.png"],
                ["Método 4", "act_1_metodo_04.png"],
                ["Método 5", "act_1_metodo_05.png"],
                ["Método 6", "act_1_metodo_06.png"],
                ["Método 7", "act_1_metodo_07.png"],
                ["Método 8", "act_1_metodo_08.png"],
                ["Método 9", "act_1_metodo_09.png"]
              ]
            },
            {
              titulo: "Actividad 2: Inventario de equipos",
              descripcion: "Métodos del inventario de equipos, con el código del proyecto.",
              carpeta: "archivos/semana6/actividad_2",
              archivos: [
                ["Código del proyecto (InventarioEquipos)", "InventarioEquipos.zip"],
                ["Método 1", "act_2_metodo_01.png"],
                ["Método 2", "act_2_metodo_02.png"],
                ["Método 3", "act_2_metodo_03.png"],
                ["Método 4", "act_2_metodo_04.png"],
                ["Método 5", "act_2_metodo_05.png"],
                ["Método 6", "act_2_metodo_06.png"],
                ["Método 7", "act_2_metodo_07.png"],
                ["Método 8", "act_2_metodo_08.png"],
                ["Método 9", "act_2_metodo_09.png"],
                ["Método 10", "act_2_metodo_10.png"]
              ]
            },
            {
              titulo: "Actividad 3: Editor con historial",
              descripcion: "Métodos del editor con historial, con el código del proyecto.",
              carpeta: "archivos/semana6/actividad_3",
              archivos: [
                ["Código del proyecto (EditorHistorial)", "EditorHistorial.zip"],
                ["Método 1", "act_3_metodo_01.png"],
                ["Método 2", "act_3_metodo_02.png"],
                ["Método 3", "act_3_metodo_03.png"],
                ["Método 4", "act_3_metodo_04.png"],
                ["Método 5", "act_3_metodo_05.png"],
                ["Método 6", "act_3_metodo_06.png"],
                ["Método 7", "act_3_metodo_07.png"]
              ]
            }
          ]
        },

        /* ============================ SEMANA 7 ============================ */
        {
          numero: 7,
          titulo: "Colas",
          actividades: [
            {
              titulo: "Actividad 1: Cola de estudiantes",
              descripcion: "Métodos de la cola de estudiantes, con el código del proyecto.",
              carpeta: "archivos/semana7/actividad-1",
              archivos: [
                ["Código del proyecto (Cola_Estudiantes)", "01_Cola_Estudiantes.zip"],
                ["Método 1", "act_1_metodo_1.png"],
                ["Método 2", "act_1_metodo_2.png"],
                ["Método 3", "act_1_metodo_3.png"],
                ["Método 4", "act_1_metodo_4.png"],
                ["Método 5", "act_1_metodo_5.png"],
                ["Método 6", "act_1_metodo_6.png"],
                ["Método 7", "act_1_metodo_7.png"],
                ["Método 8", "act_1_metodo_8.png"],
                ["Método 9", "act_1_metodo_9.png"],
                ["Método 10", "act_1_metodo_10.png"],
                ["Método 11", "act_1_metodo_11.png"],
                ["Método 12", "act_1_metodo_12.png"],
                ["Método 13", "act_1_metodo_13.png"]
              ]
            },
            {
              titulo: "Actividad 2: Cola del banco",
              descripcion: "Métodos de la cola del banco, con el código del proyecto.",
              carpeta: "archivos/semana7/actividad-2",
              archivos: [
                ["Código del proyecto (Cola_Banco)", "02_Cola_Banco.zip"],
                ["Método 1", "act_2_metodo_1.png"],
                ["Método 2", "act_2_metodo_2.png"],
                ["Método 3", "act_2_metodo_3.png"],
                ["Método 4", "act_2_metodo_4.png"],
                ["Método 5", "act_2_metodo_5.png"],
                ["Método 6", "act_2_metodo_6.png"]
              ]
            },
            {
              titulo: "Actividad 3: Cola de pedidos",
              descripcion: "Métodos de la cola de pedidos, con el código del proyecto.",
              carpeta: "archivos/semana7/actividad-3",
              archivos: [
                ["Código del proyecto (Cola_Pedidos)", "03_Cola_Pedidos.zip"],
                ["Método 1", "act_3_metodo_1.jpg"],
                ["Método 2", "act_3_metodo_2.jpg"],
                ["Método 3", "act_3_metodo_3.jpg"],
                ["Método 4", "act_3_metodo_4.jpg"],
                ["Método 5", "act_3_metodo_5.jpg"],
                ["Método 6", "act_3_metodo_6.jpg"],
                ["Método 7", "act_3_metodo_7.jpg"],
                ["Método 8", "act_3_metodo_8.jpg"]
              ]
            }
          ]
        },
        /* ============================ SEMANA 8 ============================ */
        {
          numero: 8,
          titulo: "Árboles",
          actividades: [
            {
              titulo: "Actividad 1: Explorador de archivos",
              descripcion: "Diagrama de flujo e infografías del explorador de archivos, con el código del proyecto.",
              carpeta: "archivos/semana8/actividad1",
              archivos: [
                ["Código del proyecto (ExploradorArchivos)", "ExploradorArchivos.zip"],
                ["Diagrama de flujo", "diagrama_flujo_1.png"],
                ["Infografía 1", "act_1_infografia_1.png"],
                ["Infografía 2", "act_1_infografia_2.png"],
                ["Infografía 3", "act_1_infografia_3.png"],
                ["Infografía 4", "act_1_infografia_4.png"],
                ["Infografía 5", "act_1_infografia_5.png"],
                ["Infografía 6", "act_1_infografia_6.png"],
                ["Infografía 7", "act_1_infografia_7.png"]
              ]
            },
            {
              titulo: "Actividad 2: Catálogo de inventario",
              descripcion: "Diagrama de flujo e infografías del catálogo de inventario, con el código del proyecto.",
              carpeta: "archivos/semana8/actividad2",
              archivos: [
                ["Código del proyecto (CatalogoInventario)", "CatalogoInventario.zip"],
                ["Diagrama de flujo", "act_2_diagrama_flujo.png"],
                ["Infografía 1", "act_2_infografia_1.png"],
                ["Infografía 2", "act_2_infografia_2.png"],
                ["Infografía 3", "act_2_infografia_3.png"],
                ["Infografía 4", "act_2_infografia_4.png"],
                ["Infografía 5", "act_2_infografia_5.png"],
                ["Infografía 6", "act_2_infografia_6.png"],
                ["Infografía 7", "act_2_infografia_7.png"]
              ]
            },
            {
              titulo: "Actividad 3: Árbol de registros académicos",
              descripcion: "Diagramas e infografías del árbol de registros académicos, con el código del proyecto.",
              carpeta: "archivos/semana8/actividad3",
              archivos: [
                ["Código del proyecto (ArbolRegistrosAcademicos)", "ArbolRegistrosAcademicos.zip"],
                ["Diagramas de la actividad", "diagramas_act_3.png"],
                ["Infografía 1", "act_3_infografia_1.png"],
                ["Infografía 2", "act_3_infografia_2.png"],
                ["Infografía 3", "act_3_infografia_3.png"],
                ["Infografía 4", "act_3_infografia_4.png"],
                ["Infografía 5", "act_3_infografia_5.png"],
                ["Infografía 6", "act_3_infografia_6.png"],
                ["Infografía 7", "act_3_infografia_7.png"]
              ]
            }
          ]
        },

        /* ============================ SEMANA 9 ============================ */
        {
          numero: 9,
          titulo: "Proyectos",
          actividades: [
            {
              titulo: "Proyecto 2: Análisis de dependencias de tareas",
              descripcion: "Infografía del proyecto Análisis de dependencias de tareas, con el código del proyecto.",
              carpeta: "archivos/semana9/Proyecto02",
              archivos: [
                ["Código del proyecto (AnalisisDependenciasTareas)", "AnalisisDependenciasTareas.zip"],
                ["Infografía del proyecto", "PROYECTO02_AnalisisDependenciasTareas.png"]
              ]
            },
            {
              titulo: "Proyecto 3: Evaluador de fórmulas de negocio",
              descripcion: "Infografía del proyecto Evaluador de fórmulas de negocio, con el código del proyecto.",
              carpeta: "archivos/semana9/Proyecto03",
              archivos: [
                ["Código del proyecto (EvaluadorFormulasNegocio)", "EvaluadorFormulasNegocio.zip"],
                ["Infografía del proyecto", "PROYECTO03_EvaluadorFormulasNegocios.png"]
              ]
            },
            {
              titulo: "Proyecto 4: Sistema de costos compuestos",
              descripcion: "Infografía del proyecto Sistema de costos compuestos, con el código del proyecto.",
              carpeta: "archivos/semana9/Proyecto04",
              archivos: [
                ["Código del proyecto (SistemaCostosCompuestos)", "SistemaCostosCompuestos.zip"],
                ["Infografía del proyecto", "PROYECTO04_SistemasCostosCompuestos.png"]
              ]
            }
          ]
        },

        /* ============================ SEMANA 10 ============================ */
        {
          numero: 10,
          titulo: "Listas enlazadas",
          actividades: [
            {
              titulo: "Gestión de alumnos con lista",
              descripcion: "Métodos de la gestión de alumnos con una lista enlazada, con el código del proyecto.",
              carpeta: "archivos/semana10",
              archivos: [
                ["Código del proyecto (GestionAlumnosLista)", "GestionAlumnosLista-smn10.zip"],
                ["Método 1: Insertar alumno al inicio", "metodo_01_insert_alumno_al_inicio.png"],
                ["Método 2: Insertar alumno al final", "metodo_02_insertar_alumno_al_final.png"],
                ["Método 3: Insertar alumno en la posición X", "metodo_03_insertar_alumno_posicionx.png"],
                ["Método 4: Insertar alumno por referencia", "metodo_04_insertar_alumno_por_referencia.png"],
                ["Método 5: Eliminar alumno por código", "metodo_05_eliminar_alumno_por_codigo.png"],
                ["Método 6: Buscar alumno por código", "metodo_06_buscar_alumno_por_codigo.png"],
                ["Método 7: Mostrar todos los alumnos", "metodo_07_mostrar_todos_los_alumnos.png"],
                ["Método 8: Ordenar alumnos por código", "metodo_08_ordenar_alumnos_por_codigo.png"],
                ["Método 9: Ordenar alumnos por promedio", "metodo_09_ordenar_alumnos_por_promedio.png"],
                ["Método 10: Intercambiar dos alumnos", "metodo_10_intercambiar_dos_alumnos.png"],
                ["Método 11: Contar elementos en una lista", "metodo_11_contar_elementos_en_una_lista.png"],
                ["Método 12: Modificar datos de un arreglo", "metodo_12_modificar_datos_de_un_arreglo.png"],
                ["Método 13: Verificar si la lista está vacía", "metodo_13_verificar_si_la_lista_esta_vacia.png"]
              ]
            }
          ]
        },

        /* ============================ SEMANA 11 ============================ */
        {
          numero: 11,
          titulo: "Listas circulares",
          actividades: [
            {
              titulo: "Proyecto 1: Gestión de alumnos con lista circular",
              descripcion: "Métodos de la gestión de alumnos con una lista circular, con el informe y el código del proyecto.",
              carpeta: "archivos/semana11/Proyecto01",
              archivos: [
                ["Código del proyecto (GestionAlumnosListaCircular)", "GestionAlumnosListaCircular_semana11.zip"],
                ["Informe del proyecto (Word)", "Informe_gest_alumnos_semana11.docx"],
                ["Método 1", "Proyecto_01_Metodo_01.png"],
                ["Método 2", "Proyecto_01_Metodo_02.png"],
                ["Método 3", "Proyecto_01_Metodo_03.png"],
                ["Método 4", "Proyecto_01_Metodo_04.png"],
                ["Método 5", "Proyecto_01_Metodo_05.png"],
                ["Método 6", "Proyecto_01_Metodo_06.png"],
                ["Método 7", "Proyecto_01_Metodo_07.png"],
                ["Método 8", "Proyecto_01_Metodo_08.png"],
                ["Método 9", "Proyecto_01_Metodo_09.png"],
                ["Método 10", "Proyecto_01_Metodo_10.png"],
                ["Método 11", "Proyecto_01_Metodo_11.png"],
                ["Método 12", "Proyecto_01_Metodo_12.png"]
              ]
            },
            {
              titulo: "Proyecto 2: Gestión de turnos de un centro médico",
              descripcion: "Métodos de la gestión de turnos de un centro médico, con el informe y el código del proyecto.",
              carpeta: "archivos/semana11/Proyecto02",
              archivos: [
                ["Código del proyecto (GestionTurnosCentroMedico)", "GestionTurnosCentroMedico_modificado.zip"],
                ["Informe del proyecto (Word)", "Informe_Proyecto02_GestionTurnosCentroMedico.docx"],
                ["Método 1", "Proyecto_02_Metodo_01.png"],
                ["Método 2", "Proyecto_02_Metodo_02.png"],
                ["Método 3", "Proyecto_02_Metodo_03.png"],
                ["Método 4", "Proyecto_02_Metodo_04.png"],
                ["Método 5", "Proyecto_02_Metodo_05.png"],
                ["Método 6", "Proyecto_02_Metodo_06.png"],
                ["Método 7", "Proyecto_02_Metodo_07.png"],
                ["Método 8", "Proyecto_02_Metodo_08.png"],
                ["Método 9", "Proyecto_02_Metodo_09.png"],
                ["Método 10", "Proyecto_02_Metodo_10.png"],
                ["Método 11", "Proyecto_02_Metodo_11.png"],
                ["Método 12", "Proyecto_02_Metodo_12.png"],
                ["Método 13", "Proyecto_02_Metodo_13.png"],
                ["Método 14", "Proyecto_02_Metodo_14.png"],
                ["Método 15", "Proyecto_02_Metodo_15.png"],
                ["Método 16", "Proyecto_02_Metodo_16.png"]
              ]
            }
          ]
        },

        /* ============================ SEMANA 12 ============================ */
        {
          numero: 12,
          titulo: "Proyectos de listas",
          actividades: [
            {
              titulo: "Proyecto 1: Gestión de estudiantes con lista",
              descripcion: "Métodos de la gestión de estudiantes con una lista, con el informe y el código del proyecto.",
              carpeta: "archivos/semana12/Proyecto1",
              archivos: [
                ["Código del proyecto (GestionEstudiantesLista)", "GestionEstudiantesLista.zip"],
                ["Informe del proyecto (Word)", "Informe_GestionEstudiantesLista.docx"],
                ["Método 1", "Proyecto01_metodo01.png"],
                ["Método 2", "Proyecto01_metodo02.png"],
                ["Método 3", "Proyecto01_metodo03.png"],
                ["Método 4", "Proyecto01_metodo04.png"],
                ["Método 5", "Proyecto01_metodo05.png"],
                ["Método 6", "Proyecto01_metodo06.png"],
                ["Método 7", "Proyecto01_metodo07.png"],
                ["Método 8", "Proyecto01_metodo08.png"],
                ["Método 9", "Proyecto01_metodo09.png"],
                ["Método 10", "Proyecto01_metodo10.png"],
                ["Método 11", "Proyecto01_metodo11.png"],
                ["Método 12", "Proyecto01_metodo12.png"],
                ["Método 13", "Proyecto01_metodo13.png"],
                ["Método 14", "Proyecto01_metodo14.png"],
                ["Método 15", "Proyecto01_metodo15.png"],
                ["Método 16", "Proyecto01_metodo16.png"],
                ["Método 17", "Proyecto01_metodo17.png"]
              ]
            },
            {
              titulo: "Proyecto 2: Gestión de turnos clínicos",
              descripcion: "Métodos de la gestión de turnos clínicos, con el informe y el código del proyecto.",
              carpeta: "archivos/semana12/Proyecto2",
              archivos: [
                ["Código del proyecto (GestionTurnosClinicos)", "GestionTurnosClinicos.zip"],
                ["Informe del proyecto (Word)", "Informe_GestionTurnosClinicos.docx"],
                ["Método 1", "Proyecto02_metodo01.png"],
                ["Método 2", "Proyecto02_metodo02.png"],
                ["Método 3", "Proyecto02_metodo03.png"],
                ["Método 4", "Proyecto02_metodo04.png"],
                ["Método 5", "Proyecto02_metodo05.png"],
                ["Método 6", "Proyecto02_metodo06.png"],
                ["Método 7", "Proyecto02_metodo07.png"],
                ["Método 8", "Proyecto02_metodo08.png"],
                ["Método 9", "Proyecto02_metodo09.png"],
                ["Método 10", "Proyecto02_metodo10.png"]
              ]
            }
          ]
        }

        /* ---------------------------------------------------------------
           PLANTILLA PARA UNA SEMANA NUEVA
           Copia desde "," hasta el último "}", pégala justo antes del "]"
           que cierra "semanas", y cambia los textos.
  
        ,{
          numero: 13,
          titulo: "Título de la semana",
          actividades: [
            {
              titulo: "Nombre de la actividad",
              descripcion: "Una frase que explique de qué trata.",
              carpeta: "archivos/semana13",
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