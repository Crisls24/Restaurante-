CREATE DATABASE IF NOT EXISTS reservaciones_db;
USE reservaciones_db;

CREATE TABLE usuarios (
    id_usuario     INT PRIMARY KEY AUTO_INCREMENT,
    nombre         VARCHAR(100) NOT NULL,
    apellido       VARCHAR(100) NOT NULL,
    email          VARCHAR(150) UNIQUE NOT NULL,
    telefono       VARCHAR(15),
    password_hash  VARCHAR(255) NOT NULL,
    rol   ENUM('cliente','mesero','admin') DEFAULT 'cliente',
    activo         BOOLEAN DEFAULT TRUE,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mesas (
    id_mesa   INT PRIMARY KEY AUTO_INCREMENT,
    numero    INT UNIQUE NOT NULL,
    capacidad INT NOT NULL,
    ubicacion VARCHAR(100),
    activa    BOOLEAN DEFAULT TRUE
);

CREATE TABLE estados_reservacion (
    id_estado INT PRIMARY KEY AUTO_INCREMENT,
    nombre    VARCHAR(50) NOT NULL
    -- Valores: Pendiente, Confirmada, Cancelada, Completada
);

CREATE TABLE reservaciones (
    id_reservacion INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario     INT NOT NULL,
    id_mesa        INT NOT NULL,
    id_estado      INT NOT NULL DEFAULT 1,
    fecha          DATE NOT NULL,
    hora_inicio    TIME NOT NULL,
    hora_fin       TIME NOT NULL,
    num_personas   INT NOT NULL,
    notas          TEXT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_mesa)    REFERENCES mesas(id_mesa),
    FOREIGN KEY (id_estado)  REFERENCES estados_reservacion(id_estado),
    CONSTRAINT chk_horario CHECK (hora_fin > hora_inicio),
    UNIQUE KEY uk_mesa_fecha_hora (id_mesa, fecha, hora_inicio)
);

CREATE TABLE resenas (
    id_resena      INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario     INT NOT NULL,
    id_reservacion INT NOT NULL,
    calificacion   TINYINT NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
    comentario     TEXT,
    fecha          DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario)     REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_reservacion) REFERENCES reservaciones(id_reservacion)
);

CREATE TABLE menu_relacional (
    id_item    INT PRIMARY KEY AUTO_INCREMENT,
    mongo_id   VARCHAR(50) UNIQUE,   -- Referencia al _id de MongoDB
    nombre     VARCHAR(150) NOT NULL,
    categoria  VARCHAR(100),
    precio     DECIMAL(10,2) NOT NULL,
    disponible BOOLEAN DEFAULT TRUE
);
