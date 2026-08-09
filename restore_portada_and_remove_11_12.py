import os

with open('documentacion_final.tex', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Replace title page with clean original title page
old_titlepage_start = text.find(r'\begin{titlepage}')
old_titlepage_end = text.find(r'\end{titlepage}') + len(r'\end{titlepage}')

new_titlepage = r'''\begin{titlepage}
\newgeometry{top=2cm,bottom=2cm,left=3.5cm,right=3.5cm}
\begin{tikzpicture}[remember picture,overlay]
  \fill[rosado!80!vino](current page.north east)-- ++(-4.0cm,0)-- ++(0,-5.0cm)--cycle;
  \fill[azul!60](current page.north east)-- ++(-2.0cm,0)-- ++(0,-2.5cm)--cycle;
\end{tikzpicture}
\vspace*{1.0cm}
\begin{center}
  {\Large\scshape\bfseries Universidad Politécnica de Pachuca}\\[4pt]
  {\small\scshape Dirección de Ingeniería en Software}
\end{center}
\vspace{1.5cm}
\begin{center}
  {\Huge\bfseries ARQUITECTURA\\[6pt]ORIENTADA A\\[6pt]SERVICIOS}\\[16pt]
  \rule{0.6\textwidth}{1.5pt}\\[16pt]
  {\Large\bfseries DOCUMENTACIÓN FINAL DEL PROYECTO:}\\[8pt]
  {\LARGE\bfseries\color{vino}Xiú --- Sistema de Reservaciones y Gestión Restaurantera}
\end{center}
\vspace{1.5cm}
\noindent\textbf{PROFESORA:} M. en C. Jazmín Rodríguez Flores\\[8pt]
\noindent\textbf{INTEGRANTES:}\\[4pt]
\noindent\hspace{1cm}$\bullet$ Cristopher Lopez Suarez\\[4pt]
\noindent\hspace{1cm}$\bullet$ Jovanny Hernandez Hernandez\\[8pt]
\noindent\textbf{CARRERA:} Ingeniería en Software\\[8pt]
\noindent\textbf{GRUPO:} 09\_01\\[8pt]
\noindent\textbf{CUATRIMESTRE:} Mayo -- Agosto 2026\\[8pt]
\noindent\textbf{MATERIA:} Arquitectura Orientada a Servicios (AOS)
\vfill
\begin{center}
  \rule{0.8\textwidth}{0.5pt}\\[4pt]
  {\small Pachuca de Soto, Hidalgo, México \quad | \quad 2026}
\end{center}
\end{titlepage}'''

text = text[:old_titlepage_start] + new_titlepage + text[old_titlepage_end:]

# 2. Update the Rubric Table (Remove rows 11 and 12 and renumber or delete them)
# Original rows 11 and 12 in the table:
old_table_part = r'''11 & Realizó al menos 3 pruebas del cliente y 3 del servidor con formato IEEE829 (5) & \textbf{X} & & & IEEE 829 (10/10) \\ \hline
12 & Integrantes programaron sus módulos asignados --- GitHub (5) & \textbf{X} & & & GitHub Commits \\ \hline'''

if old_table_part in text:
    text = text.replace(old_table_part, '')

# Also check for alternative formatting of rows 11 and 12
old_table_part2 = r'''11 & Realizó al menos 3 pruebas del cliente y 3 del servidor con formato IEEE829 (5) & \textbf{X} & & & IEEE 829 (4+4) \\ \hline
12 & Integrantes programaron sus módulos asignados --- GitHub (5) & \textbf{X} & & & GitHub Commits \\ \hline'''
if old_table_part2 in text:
    text = text.replace(old_table_part2, '')

# Renumber remaining items 13-16 to 11-14 so the table has a continuous list
text = text.replace(r'13 & Publicó en 2 o más sitios diferentes (5)', r'11 & Publicó en 2 o más sitios diferentes (5)')
text = text.replace(r'14 & El sistema tiene los módulos solicitados (5)', r'12 & El sistema tiene los módulos solicitados (5)')
text = text.replace(r'15 & El sistema realiza reportes (3)', r'13 & El sistema realiza reportes (3)')
text = text.replace(r'16 & Autoevaluación (2)', r'14 & Autoevaluación (2)')

with open('documentacion_final.tex', 'w', encoding='utf-8') as f:
    f.write(text)

with open('write_tex.py', 'w', encoding='utf-8') as f:
    f.write(f'import os\ncontent = r"""{text}"""\nwith open("documentacion_final.tex", "w", encoding="utf-8") as f:\n    f.write(content)\nprint("File written successfully!")\n')

print("Updated documentacion_final.tex and write_tex.py")
