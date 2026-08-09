import os

with open('documentacion_final.tex', 'r', encoding='utf-8') as f:
    text = f.read()

# Remove Section 8 (Plan de Pruebas IEEE 829) and Section 9 (Repositorio GitHub)
# Replace with Security and Cloud Infrastructure architecture sections

old_section8_start = text.find(r'\section{Plan de Pruebas y Resultados de Verificación IEEE 829}')
old_section9_end = text.find(r'\section{Manual Operativo de Usuario por Rol}')

new_sections_8_9 = r'''\section{Arquitectura de Seguridad, Autenticación JWT y Protección CORS}

La seguridad en la arquitectura SOA de \textbf{Xiú} se implementó mediante un esquema sin estado (stateless) basado en \textbf{JSON Web Tokens (JWT)} y encriptación de credenciales con \textbf{Bcrypt}.

\subsection{Flujo de Firma y Autenticación Criptográfica}
1. \textbf{Hash de Contraseñas:} Las contraseñas de los usuarios (\texttt{admin@xiu.mx} y \texttt{mesero@xiu.mx}) se almacenan en MySQL procesadas con el algoritmo \texttt{bcrypt} utilizando una sal dinámica de 10 rondas.
2. \textbf{Firma Digital HS256:} Al validar las credenciales en \texttt{POST /api/auth/login}, el servicio \texttt{JwtService} de NestJS genera un token firmado con una clave secreta privada (\texttt{JWT\_SECRET}), emitiendo claims que incluyen el ID, correo y rol del usuario (\texttt{admin} o \texttt{mesero}).
3. \textbf{Cabecera Authorization Bearer:} El cliente React incluye el token en cada petición protegida utilizando el estándar \texttt{Authorization: Bearer <token>}.

\subsection{Protección Interceptora con Guards y Polimorfismo de CORS}
Para evitar vulnerabilidades de origen cruzado y accesos no autorizados:
\begin{itemize}[leftmargin=*]
  \item \textbf{NestJS JwtAuthGuard:} Intercepta las solicitudes antes de ejecutar los controladores de reservaciones. Si el token expira o es alterado, el servidor rechaza automáticamente con un código \texttt{401 Unauthorized}.
  \item \textbf{Configuración CORS Estricta:} Ambos microservicios (\textbf{NestJS} y \textbf{FastAPI}) configuran reglas de origen permitiendo exclusivamente las peticiones provenientes del dominio oficial del frontend en Vercel (\texttt{https://restaurante-frontend-omega.vercel.app}).
\end{itemize}

% ════════════════════════════════════════════════════════════════════════════
\section{Infraestructura de Despliegue Cloud y Gestión de Tolerancia a Fallos}

El despliegue distribuido de la plataforma se diseñó aprovechando el modelo de PaaS (Platform as a Service) para cada uno de los componentes de la arquitectura SOA:

\subsection{Topología de Despliegue en 3 Sitios Cloud}
\begin{itemize}[leftmargin=*]
  \item \textbf{Capa de Presentación (Vercel):} Hospeda la Single Page Application (SPA) construida en React 18, garantizando distribución mediante red CDN global con tiempos de respuesta sub-100ms.
  \item \textbf{Capa de Negocio y Auth (Railway):} Hospeda el contenedor de NestJS conectado a la base de datos relacional MySQL Cloud, gestionando conexiones continuas y transacciones ACID.
  \item \textbf{Capa de Menú y Productos (Render + MongoDB Atlas):} Hospeda el microservicio FastAPI en Python 3.11 conectado a un cluster distribuido de MongoDB Atlas en la nube.
\end{itemize}

\subsection{Manejo de Resiliencia y Arranque en Frío (Cold Start)}
En el entorno de producción de Render (plan gratuito), el contenedor del microservicio de menú entra en estado de suspensión tras 15 minutos de inactividad. La arquitectura cliente absorbe esta condición mediante un spinner de carga y reintentos asíncronos con tiempo de espera extendido (60 segundos), garantizando que el usuario obtenga sus datos de manera transparente una vez que el contenedor NoSQL completa su arranque en frío.

'''

if old_section8_start != -1 and old_section9_end != -1:
    text = text[:old_section8_start] + new_sections_8_9 + text[old_section9_end:]
    print("Replaced Sections 8 and 9 successfully!")
else:
    print(f"Could not find section indices: start={old_section8_start}, end={old_section9_end}")

with open('documentacion_final.tex', 'w', encoding='utf-8') as f:
    f.write(text)

with open('write_tex.py', 'w', encoding='utf-8') as f:
    f.write(f'import os\ncontent = r"""{text}"""\nwith open("documentacion_final.tex", "w", encoding="utf-8") as f:\n    f.write(content)\nprint("File written successfully!")\n')

print("Updated documentacion_final.tex and write_tex.py")
