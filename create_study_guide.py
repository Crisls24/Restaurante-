import os, subprocess

content = r"""\documentclass[12pt,a4paper]{article}

% ── Codificación y lenguaje ──────────────────────────────────────────────────
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage[spanish,mexico]{babel}

% ── Fuentes y Márgenes ───────────────────────────────────────────────────────
\usepackage{lmodern}
\usepackage[top=2.5cm, bottom=2.5cm, left=2.5cm, right=2.5cm, headheight=15pt]{geometry}

% ── Colores ──────────────────────────────────────────────────────────────────
\usepackage{xcolor}
\usepackage{array}
\usepackage{tcolorbox}
\tcbset{colback=grisclaro,colframe=azul!80!black,boxrule=0.8pt,arc=3pt,left=8pt,right=8pt,top=6pt,bottom=6pt,fonttitle=\bfseries}

\definecolor{rosado}{RGB}{220, 180, 185}
\definecolor{grisclaro}{RGB}{245, 247, 250}
\definecolor{grisoscuro}{RGB}{50, 50, 60}
\definecolor{azul}{RGB}{30, 70, 120}
\definecolor{verde}{RGB}{39, 130, 80}
\definecolor{vino}{RGB}{120, 30, 50}

% ── Gráficos y TikZ ──────────────────────────────────────────────────────────
\usepackage{graphicx}
\usepackage{tikz}
\usetikzlibrary{calc, positioning, shapes.geometric, arrows.meta, shadows}

% ── Código Fuente ────────────────────────────────────────────────────────────
\usepackage{listings}
\lstset{
  basicstyle=\ttfamily\footnotesize,
  backgroundcolor=\color{grisclaro},
  frame=single,
  breaklines=true,
  showstringspaces=false,
  numbers=left,
  numberstyle=\tiny\color{grisoscuro},
  xleftmargin=12pt
}

\lstdefinelanguage{TypeScript}{
  keywords={const,let,var,function,return,require,async,await,try,catch,new,module,exports,if,else,import,export,default,from,class,extends,interface,type,readonly,public,private,protected,Injectable,Controller,Get,Post,Delete,Put,Body,Param,Query,Request,UseGuards,Module,TypeOrmModule},
  keywordstyle=\color{azul}\bfseries,
  stringstyle=\color{verde},
  commentstyle=\color{grisoscuro}\itshape,
  morestring=[b]",
  morestring=[b]',
  morestring=[b]`,
  morecomment=[l]{//},
  basicstyle=\ttfamily\footnotesize,
  frame=single,
  backgroundcolor=\color{grisclaro},
  breaklines=true,
  numbers=left,
  numberstyle=\tiny\color{grisoscuro},
  xleftmargin=12pt
}

% ── Encabezados ──────────────────────────────────────────────────────────────
\usepackage{fancyhdr}
\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\small\color{grisoscuro}AOS --- Guía de Exposición y Estudio}
\fancyhead[R]{\small\color{grisoscuro}Defensa Oral del Proyecto Xiú}
\fancyfoot[C]{\small\thepage}
\renewcommand{\headrulewidth}{0.4pt}

\usepackage[hidelinks]{hyperref}
\urlstyle{same}

\usepackage{titlesec}
\titleformat{\section}{\large\bfseries\color{azul}}{}{0em}{\thesection.\quad}[\vspace{2pt}\hrule\vspace{4pt}]
\titleformat{\subsection}{\normalsize\bfseries\color{vino}}{\thesubsection.}{0.5em}{}
\titleformat{\subsubsection}{\normalsize\bfseries\itshape\color{grisoscuro}}{\thesubsubsection.}{0.5em}{}

\usepackage{enumitem}
\usepackage{float}

\begin{document}
\pagenumbering{gobble}

% ════════════════════════════════════════════════════════════════════════════
% PORTADA DE LA GUÍA DE ESTUDIO
% ════════════════════════════════════════════════════════════════════════════
\begin{titlepage}
\newgeometry{top=2cm,bottom=2cm,left=3.5cm,right=3.5cm}
\begin{tikzpicture}[remember picture,overlay]
  \fill[vino!80!black](current page.north east)-- ++(-4.0cm,0)-- ++(0,-5.0cm)--cycle;
  \fill[azul!70](current page.north east)-- ++(-2.0cm,0)-- ++(0,-2.5cm)--cycle;
\end{tikzpicture}
\vspace*{1.0cm}
\begin{center}
  {\Large\scshape\bfseries Universidad Politécnica de Pachuca}\\[4pt]
  {\small\scshape Dirección de Ingeniería en Software}
\end{center}
\vspace{1.5cm}
\begin{center}
  {\Huge\bfseries GUÍA DE ESTUDIO Y GUIÓN DE EXPOSICIÓN ORAL}\\[12pt]
  \rule{0.7\textwidth}{1.5pt}\\[16pt]
  {\Large\bfseries DEFENSA TÉCNICA DEL PROYECTO INTEGRADOR:}\\[8pt]
  {\LARGE\bfseries\color{vino}Xiú --- Sistema de Reservaciones SOA y Microservicios}
\end{center}
\vspace{1.5cm}
\noindent\textbf{PROFESORA:} M. en C. Jazmín Rodríguez Flores\\[8pt]
\noindent\textbf{INTEGRANTES:}\\[4pt]
\noindent\hspace{1cm}$\bullet$ Cristopher Lopez Suarez\\[4pt]
\noindent\hspace{1cm}$\bullet$ Jovanny Hernandez Hernandez\\[8pt]
\noindent\textbf{ASIGNATURA:} Arquitectura Orientada a Servicios (AOS)\\[8pt]
\noindent\textbf{PROPÓSITO:} Preparación para la evaluación oral, guiones para los videos de demostración (Cliente y Servidor) y explicación técnica exhaustiva del código fuente.
\vfill
\begin{center}
  \rule{0.8\textwidth}{0.5pt}\\[4pt]
  {\small Pachuca de Soto, Hidalgo, México \quad | \quad 2026}
\end{center}
\end{titlepage}
\restoregeometry

\newpage
\pagenumbering{arabic}
\tableofcontents
\newpage

% ════════════════════════════════════════════════════════════════════════════
\section{Guiones de Grabación para los Videos Demostrativos}
% ════════════════════════════════════════════════════════════════════════════

La maestra evaluará el funcionamiento práctico a través de demostraciones en video. A continuación tienes los guiones explicativos paso a paso y palabra por palabra que debes pronunciar durante la grabación de pantalla.

\subsection{Video 1: Demostración y Explicación del Cliente Funcional (Vercel SPA + GitHub)}

\begin{tcolorbox}[title=Guión Explicativo para el Video del CLIENTE (Paso a Paso)]
\textbf{Paso 1: Introducción y Repositorio en GitHub (0:00 -- 0:30)}\newline
\textit{"Hola profesora, en este video demostramos la funcionalidad del programa cliente de nuestro sistema Xiú. El código fuente está alojado en nuestro repositorio público de GitHub \texttt{https://github.com/Crisls24/Restaurante-.git}, donde se puede observar la colaboración entre Cristopher López y Jovanny Hernández mediante la rama principal main. El frontend fue desarrollado utilizando React 18 con Vite y Tailwind CSS, y se encuentra desplegado de manera continua en la plataforma Vercel en la URL oficial \texttt{https://restaurante-frontend-omega.vercel.app/}."}\\[8pt]

\textbf{Paso 2: Navegación del Cliente Público y Reservación (0:30 -- 1:30)}\newline
\textit{"Como cliente público, el usuario ingresa a la vista principal donde observa la presentación del restaurante. Al dar clic en 'Ver Menú', el cliente consume asíncronamente los datos del microservicio NoSQL en Render. Posteriormente, el cliente hace clic en 'Reservar Mesa', donde se despliega un formulario interactivo. Al seleccionar fecha, hora y número de personas, la SPA ejecuta una petición POST al microservicio de reservaciones. El cliente recibe la respuesta en JSON, muestra el comprobante digital en pantalla e incluye un botón directo para enviar la confirmación vía WhatsApp Web."}\\[8pt]

\textbf{Paso 3: Inicio de Sesión y Roles (1:30 -- 2:30)}\newline
\textit{"Para el personal del restaurante, el cliente incluye la pantalla de Login en \texttt{/login}. Al ingresar las credenciales de Administrador (\texttt{admin@xiu.mx}) o Mesero (\texttt{mesero@xiu.mx}), la SPA realiza la autenticación contra el backend, guarda el token JWT en el localStorage y habilita el menú protegido en tiempo real. Aquí mostramos el Panel de Control con indicadores, el Tablero de Mesas con estados visuales (verde=libre, rojo=ocupada), la Gestión de Menú para crear y borrar platillos, y el módulo de Reportes estadísticos."}
\end{tcolorbox}

\subsection{Video 2: Demostración y Explicación del Servidor Funcional (Railway NestJS + Render FastAPI)}

\begin{tcolorbox}[title=Guión Explicativo para el Video del SERVIDOR (Paso a Paso)]
\textbf{Paso 1: Arquitectura SOA y Despliegue en la Nube (0:00 -- 0:40)}\newline
\textit{"Buenas tardes profesora, en este video demostramos el funcionamiento del servidor. Nuestra arquitectura servidor está orientada a servicios (SOA) y está dividida en dos microservicios políglotas totalmente independientes desuscriptos de la capa visual:"}\newline
1. \textbf{Auth-Service (NestJS/TypeScript):} Desplegado en Railway en la URL \texttt{https://restaurante-production-36c3.up.railway.app/api}, encargado de la autenticación JWT, usuarios y reservaciones en la base de datos relacional MySQL.\newline
2. \textbf{Menu-Service (FastAPI/Python):} Desplegado en Render en la URL \texttt{https://menu-service-u8l0.onrender.com/api}, encargado del catálogo NoSQL en MongoDB Atlas.\\[8pt]

\textbf{Paso 2: Demostración de Endpoints REST en Vivo (0:40 -- 2:00)}\newline
\textit{"Demostramos el funcionamiento del Auth-Service ejecutando una petición POST a \texttt{/api/auth/login} con las credenciales de admin. El servidor responde HTTP 201 enviando el token JWT firmado con el algoritmo HS256. Al consultar \texttt{GET /api/reservations/available}, el servidor valida la disponibilidad de las 12 mesas en MySQL y retorna el JSON. Asimismo, demostramos la seguridad: si intentamos consultar un endpoint protegido sin el encabezado Authorization Bearer, el Guard de NestJS intercepta la petición y responde HTTP 401 Unauthorized."}\\[8pt]

\textbf{Paso 3: Demostración del Servicio NoSQL en FastAPI (2:00 -- 3:00)}\newline
\textit{"Por parte del Menu-Service en Python FastAPI, ejecutamos la petición \texttt{GET /api/menu}. El servidor conecta de forma asíncrona mediante la librería Motor a MongoDB Atlas y retorna los 10 documentos en formato JSON. Cuando el administrador crea un nuevo platillo con POST \texttt{/api/menu}, FastAPI valida el esquema Pydantic e inserta el nuevo documento en la colección de MongoDB en tiempo real."}
\end{tcolorbox}

% ════════════════════════════════════════════════════════════════════════════
\section{Simulacro de Examen Oral: Preguntas y Respuestas Clave de la Maestra}
% ════════════════════════════════════════════════════════════════════════════

Si la profesora te realiza preguntas durante la evaluación oral, estas son las preguntas más probables y la respuesta técnica exacta que debes dar para obtener la calificación máxima:

\begin{description}[leftmargin=*,style=nextline]
  \item[\textbf{Pregunta 1: ¿Por qué eligieron una Arquitectura Orientada a Servicios (SOA) y no un sistema monolítico?}]
  \textbf{Respuesta Exacta:}\newline
  \textit{"Elegimos SOA porque nos permite desacoplar los componentes del sistema. El frontend en React no depende del lenguaje del backend; puede consumir datos de NestJS en TypeScript y de FastAPI en Python simultáneamente. Además, SOA brinda escalabilidad independiente: si la demanda de reservaciones aumenta, podemos escalar el servicio de autenticación en Railway sin necesidad de duplicar el servicio de menú en Render."}

  \item[\textbf{Pregunta 2: ¿Por qué usaron Persistencia Políglota (MySQL + MongoDB)? ¿Por qué el menú en NoSQL y las reservas en Relacional?}]
  \textbf{Respuesta Exacta:}\newline
  \textit{"Usamos MySQL para el módulo de usuarios y reservaciones porque requerimos propiedades ACID, integridad referencial y relaciones estrictas mediante llaves foráneas entre la tabla de mesas y reservaciones. En cambio, para el catálogo del menú utilizamos MongoDB (NoSQL) porque los platillos tienen un esquema flexible; un platillo puede incluir etiquetas dinámicas de alérgenos, promociones o ingredientes sin necesidad de alterar una estructura de tabla rígida."}

  \item[\textbf{Pregunta 3: ¿Cómo funciona la seguridad y cómo evitan que un usuario no autorizado modifique las mesas o el menú?}]
  \textbf{Respuesta Exacta:}\newline
  \textit{"La seguridad se implementó mediante tokens JWT (JSON Web Tokens) sin estado. Cuando el usuario inicia sesión, el servidor valida el hash bcrypt de la contraseña y retorna el JWT. En las peticiones posteriores, el cliente envía el token en el encabezado \texttt{Authorization: Bearer <token>}. En NestJS, la clase \texttt{JwtAuthGuard} e \texttt{RolesGuard} interceptan la petición antes de llegar al controlador. Si el token no es válido o el usuario no tiene el rol \texttt{admin}, el Guard bloquea el acceso retornando un error 401 o 403."}

  \item[\textbf{Pregunta 4: ¿Qué es un DTO y cómo lo utilizan en su código NestJS?}]
  \textbf{Respuesta Exacta:}\newline
  \textit{"Un DTO (Data Transfer Object) es una clase que define la estructura exacta y las reglas de validación de los datos enviados desde el cliente. En NestJS creamos la clase \texttt{CreateReservationDto} utilizando decoradores de \texttt{class-validator} como \texttt{@IsString()}, \texttt{@Matches()} y \texttt{@Min()}. El \texttt{ValidationPipe} global revisa el cuerpo del JSON antes de entrar al controlador; si algún campo no cumple el formato (por ejemplo la fecha), el servidor responde un error 400 Bad Request detallado."}

  \item[\textbf{Pregunta 5: ¿Por qué al consultar el menú en Render la primera petición tarda unos segundos?}]
  \textbf{Respuesta Exacta:}\newline
  \textit{"Esto se debe al mecanismo de 'Cold Start' (arranque en frío) de los servicios gratuitos de Render. Cuando el servicio no recibe tráfico durante 15 minutos, Render suspende temporalmente el contenedor en la nube para ahorrar recursos. Al recibir la primera petición, el contenedor se vuelve a iniciar en aproximadamente 25-30 segundos y responde HTTP 200 OK. Las peticiones subsecuentes responden de inmediato."}

  \item[\textbf{Pregunta 6: ¿Cómo colaboraron en GitHub y qué estructura de control de versiones utilizaron?}]
  \textbf{Respuesta Exacta:}\newline
  \textit{"Gestionamos el proyecto en el repositorio público \texttt{https://github.com/Crisls24/Restaurante-.git}. Cristopher trabajó en los módulos del servidor NestJS, TypeORM y autenticación, mientras que Jovanny trabajó en el frontend React, el microservicio FastAPI NoSQL y la integración de notificaciones. Sincronizamos nuestros cambios mediante commits claros en la rama principal, integrando despliegue continuo (CI/CD) automatizado hacia Vercel, Railway y Render."}
\end{description}

% ════════════════════════════════════════════════════════════════════════════
\section{Explicación Detallada del Código Fuente Archivo por Archivo}
% ════════════════════════════════════════════════════════════════════════════

A continuación se desglosa el propósito técnico de cada archivo relevante de la estructura del proyecto para que puedas responder cualquier consulta específica sobre el código.

\subsection{Estructura del Proyecto en el Sistema de Archivos}
\begin{lstlisting}[language=bash]
Restaurante/
|-- frontend/                        # Aplicacion SPA React (Vercel)
|   |-- src/
|   |   |-- components/ Navbar.jsx, TableBoard.jsx, Footer.jsx
|   |   |-- pages/ Login.jsx, Reservation.jsx, AdminMenu.jsx, Reports.jsx
|   |   |-- services/ api.js (Axios Instance)
|   |   +-- App.jsx (React Router DOM)
+-- services/
    |-- auth-service/                # Microservicio NestJS/MySQL (Railway)
    |   |-- src/
    |   |   |-- auth/ auth.controller.ts, auth.service.ts, jwt.strategy.ts
    |   |   |-- reservations/ reservations.controller.ts, reservations.service.ts
    |   |   +-- dto/ create-reservation.dto.ts
    +-- menu-service/                # Microservicio FastAPI/MongoDB (Render)
        +-- app/
            |-- main.py (FastAPI App & CORS)
            |-- database.py (Motor Async MongoDB Connection)
            +-- routers/ menu.py (CRUD Endpoints)
\end{lstlisting}

\subsection{Archivos Clave del FRONTEND (React 18 SPA)}

\begin{enumerate}[leftmargin=*]
  \item \textbf{\texttt{src/App.jsx}:} Archivo principal de enrutamiento. Utiliza \texttt{BrowserRouter}, \texttt{Routes} y \texttt{Route} de React Router DOM v6 para renderizar componentes dinámicos sin recargar la página.
  \item \textbf{\texttt{src/pages/Login.jsx}:} Renderiza el formulario de acceso para empleados. Captura email y contraseña, ejecuta la petición a \texttt{VITE\_AUTH\_API/auth/login}, guarda la respuesta en \texttt{localStorage.setItem('token', data.token)} y actualiza el estado global del usuario.
  \item \textbf{\texttt{src/pages/Reservation.jsx}:} Formulario para que los clientes registren sus reservas. Incluye un selector de hora/fecha y calcula la disponibilidad llamando a \texttt{GET /reservations/available}. Al enviar, genera el comprobante y arma la URL dinámica de WhatsApp \texttt{https://wa.me/5217712430474?text=...}.
  \item \textbf{\texttt{src/pages/TableBoard.jsx}:} Componente interactivo que dibuja la cuadrícula de las 12 mesas del restaurante. Aplica clases CSS dinámicas según el estado devuelto por el servidor (\texttt{libre}=verde, \texttt{ocupada}=rojo, \texttt{reservada}=amarillo).
  \item \textbf{\texttt{src/pages/AdminMenu.jsx}:} Interfaz exclusiva de Administrador que consume el microservicio Python FastAPI en Render para agregar, editar y eliminar platillos de MongoDB Atlas mediante modales de React.
\end{enumerate}

\subsection{Archivos Clave del BACKEND 1 (NestJS Auth-Service)}

\begin{enumerate}[leftmargin=*]
  \item \textbf{\texttt{src/auth/auth.service.ts}:} Contiene la lógica del inicio de sesión. Utiliza \texttt{bcrypt.compare()} para comparar la contraseña ingresada contra el hash de la base de datos MySQL. Si es correcta, invoca \texttt{jwtService.sign()} con el payload del usuario.
  \item \textbf{\texttt{src/auth/jwt.strategy.ts}:} Estrategia de Passport JWT. Extrae el token enviado en la cabecera HTTP \texttt{Authorization: Bearer <token>}, valida la firma contra la clave secreta \texttt{JWT\_SECRET} y adjunta los datos del usuario al objeto \texttt{request.user}.
  \item \textbf{\texttt{src/reservations/dto/create-reservation.dto.ts}:} Clase DTO provista de reglas de validación stictas de NestJS. Ejemplo de código:
\begin{lstlisting}[language=TypeScript]
export class CreateReservationDto {
  @IsString()
  cliente_nombre: string;

  @IsString()
  cliente_telefono: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  fecha: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  hora_inicio: string;

  @IsNumber()
  @Min(1)
  @Max(20)
  num_personas: number;
}
\end{lstlisting}
  \item \textbf{\texttt{src/reservations/reservations.controller.ts}:} Define las rutas HTTP para reservaciones. Incluye el método \texttt{create()} decorado con \texttt{@Post()} y métodos protegidos con \texttt{@UseGuards(JwtAuthGuard)}.
\end{enumerate}

\subsection{Archivos Clave del BACKEND 2 (FastAPI Menu-Service)}

\begin{enumerate}[leftmargin=*]
  \item \textbf{\texttt{app/main.py}:} Punto de entrada del microservicio en Python. Instancia la clase \texttt{FastAPI()}, añade el middleware \texttt{CORSMiddleware} para permitir origen cruzado desde Vercel e incluye las rutas del enrutador de menú.
  \item \textbf{\texttt{app/database.py}:} Utiliza la librería cliente \texttt{motor.motor\_asyncio} para establecer una conexión no bloqueante hacia el cluster de MongoDB Atlas usando la cadena de conexión \texttt{MONGO\_DETAILS}.
  \item \textbf{\texttt{app/routers/menu.py}:} Contiene las funciones asíncronas \texttt{async def get\_menu()}, \texttt{async def create\_menu\_item()} y \texttt{async def delete\_menu\_item()} que ejecutan operaciones CRUD directamente sobre la colección \texttt{menu\_items} de MongoDB.
\end{enumerate}

% ════════════════════════════════════════════════════════════════════════════
\section{Resumen de Puntos de Defensa Rápida para el Examen}
% ════════════════════════════════════════════════════════════════════════════

Si la profesora te pide hacer una síntesis express del proyecto en 1 minuto, di exactamente esto:

\begin{tcolorbox}[colback=verde!10,colframe=verde!80!black,title=Resumen Express de 1 Minuto para el Examen]
\textit{"Nuestro proyecto **Xiú** es un sistema restaurantero basado en **Arquitectura Orientada a Servicios (SOA)** con persistencia políglota y despliegue distribuido en la nube:"}\\[4pt]
1. \textbf{Frontend SPA:} Desarrollado en React 18 responsivo, desplegado en **Vercel**.\newline
2. \textbf{Auth \& Reservaciones:} Microservicio NestJS en TypeScript con persistencia relacional **MySQL**, desplegado en **Railway** con autenticación **JWT**.\newline
3. \textbf{Catálogo de Menú:} Microservicio FastAPI en Python 3.11 con persistencia NoSQL **MongoDB Atlas**, desplegado en **Render**.\newline
4. \textbf{Control de Versiones y Pruebas:} Desarrollado colaborativamente en **GitHub** con una suite de pruebas E2E aprobada al 100\%.
\end{tcolorbox}

\end{document}
"""

with open('guia_estudio_defensa.tex', 'w', encoding='utf-8') as f:
    f.write(content)

print("guia_estudio_defensa.tex written successfully!")
