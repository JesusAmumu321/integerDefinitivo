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
  id_medicamento int auto_increment primary key,
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

-- drop table medicamento;

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


CREATE TABLE eventos (
  id_evento INT PRIMARY KEY AUTO_INCREMENT,
  id_medicamento INT NOT NULL,
  titulo VARCHAR(100) NOT NULL,
  fecha_hora DATETIME NOT NULL,
  FOREIGN KEY (id_medicamento) REFERENCES medicamento(id_medicamento)
);
-- drop table eventos;

select * from eventos;

DELIMITER //

CREATE PROCEDURE GenerarEventosMedicamento(
    IN p_id_medicamento INT,
    IN p_nombre_med VARCHAR(30),
    IN p_frecuencia_toma INT,
    IN p_ultima_toma DATE
)
BEGIN
    DECLARE fecha_actual DATE;
    DECLARE fecha_final DATE;
    
    SET fecha_actual = CURDATE(); -- Empezamos desde hoy
    SET fecha_final = p_ultima_toma;
    
    WHILE fecha_actual <= fecha_final DO
        CASE p_frecuencia_toma
            WHEN 8 THEN
                INSERT INTO eventos (id_medicamento, titulo, fecha_hora)
                VALUES (p_id_medicamento, p_nombre_med, TIMESTAMP(fecha_actual, '07:00:00')),
                       (p_id_medicamento, p_nombre_med, TIMESTAMP(fecha_actual, '15:00:00')),
                       (p_id_medicamento, p_nombre_med, TIMESTAMP(fecha_actual, '23:00:00'));
            WHEN 6 THEN
                INSERT INTO eventos (id_medicamento, titulo, fecha_hora)
                VALUES (p_id_medicamento, p_nombre_med, TIMESTAMP(fecha_actual, '08:00:00')),
                       (p_id_medicamento, p_nombre_med, TIMESTAMP(fecha_actual, '14:00:00')),
                       (p_id_medicamento, p_nombre_med, TIMESTAMP(fecha_actual, '20:00:00'));
            WHEN 12 THEN
                INSERT INTO eventos (id_medicamento, titulo, fecha_hora)
                VALUES (p_id_medicamento, p_nombre_med, TIMESTAMP(fecha_actual, '08:00:00')),
                       (p_id_medicamento, p_nombre_med, TIMESTAMP(fecha_actual, '20:00:00'));
            WHEN 24 THEN
                INSERT INTO eventos (id_medicamento, titulo, fecha_hora)
                VALUES (p_id_medicamento, p_nombre_med, TIMESTAMP(fecha_actual, '08:00:00'));
            WHEN 10 THEN
                INSERT INTO eventos (id_medicamento, titulo, fecha_hora)
                VALUES (p_id_medicamento, p_nombre_med, TIMESTAMP(fecha_actual, '08:00:00')),
                       (p_id_medicamento, p_nombre_med, TIMESTAMP(fecha_actual, '18:00:00'));
        END CASE;
        
        SET fecha_actual = DATE_ADD(fecha_actual, INTERVAL 1 DAY);
    END WHILE;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER after_medicamento_insert
AFTER INSERT ON medicamento
FOR EACH ROW
BEGIN
    CALL GenerarEventosMedicamento(
        NEW.id_medicamento,
        NEW.nombreMed,
        NEW.frecuenciaToma,
        NEW.ultimaToma
    );
END //

DELIMITER ;
