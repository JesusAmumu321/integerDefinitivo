CREATE DATABASE prueba;
USE prueba;
-- drop database prueba;
CREATE TABLE lenguajes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(30) NOT NULL,
  desarrolladores INT NOT NULL,
  activa BOOLEAN NOT NULL DEFAULT 1
);

INSERT INTO lenguajes (nombre, desarrolladores, activa)
VALUES ("C++", 10, 1);

CREATE TABLE usuarios (
  id_usuario INT PRIMARY KEY AUTO_INCREMENT,
  nombre_usuario VARCHAR(60) NOT NULL,
  correo VARCHAR(60) NOT NULL,
  contrasena VARCHAR(30) NOT NULL,
  contrasena_conf VARCHAR(30)
);

CREATE TABLE medicamento (
  tipo_medicamento varchar(30) NOT NULL,
  cantidadUnaCaja INT NOT NULL,
  cantidadCajas INT NOT NULL,
  nombreMed VARCHAR(30),
  caducidadMed DATE not null,
  ultimaToma DATE not null,
  cantidadDosis int not null,
  frecuenciaToma int not null,
  Pk_usuario int not null,
  foreign key (Pk_Usuario) references usuarios(id_usuario)
);



drop table medicamento;

desc medicamento;
-- drop table medicamento;
select * from medicamento;
select * from usuarios;

-- Primero, añadimos un índice único a la columna 'correo' en la tabla 'usuarios'
ALTER TABLE usuarios
ADD UNIQUE INDEX idx_correo (correo);

-- Ahora, creamos la tabla 'contactos' con las claves foráneas
CREATE TABLE contactos (
  id_contacto INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT,
  correo VARCHAR(60) NOT NULL,
  razon_contacto ENUM('sugerencia', 'duda', 'aclaracion') NOT NULL,
  detalles TEXT NOT NULL,
  como_nos_ubico ENUM('hospital', 'publicidad', 'conocidos') NOT NULL,
  fecha_contacto TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (correo) REFERENCES usuarios(correo)
);
select * from contactos;