# IntegradoraDefinitivoVerdadero
INTEGRADORA

Trabajo encagardo por el ingeniero Vidal

1. Se utilizaron api's para la conexion a la base de datos.

2. Tabla para registro e inicio de sesion.
create table usuarios(
id_usuario int primary key auto_increment,
nombre_usuario varchar(60) not null,
correo varchar(60) not null,
contrasena varchar(30) not null,
contrasena_conf varchar(30));

3. El avance es optimo, pero por algunos errores de logica al utilizar github nos retraso de manera significativa en el sitio web, pero ya se esta trabajando en ello. Por lo que no esta todo en el archivo server.js, solo esta lo que es funcional.
La utilizacion de distintos recursos en linea fueron de gran ayuda en la elaboracion de este sitio, por lo que no todo es 100% fiel a lo que el ingeniero Vidal nos enseño en clase.

4. Funcionamiento de los end points y apis.

4.1 GET /login y GET /registro:
    Estos endpoints sirven archivos HTML para las páginas de inicio de sesión y registro. Utilizan res.sendFile() para enviar el archivo HTML correspondiente al cliente.

4.2 POST /api/verificar-correo:
    Verifica si un correo electrónico ya existe en la base de datos. Recibe el correo en el cuerpo de la petición, consulta la base de datos y responde con un JSON indicando si el correo existe o no.

4.3 POST /api/registrar:
    Registra un nuevo usuario en la base de datos. Recibe los datos del usuario (nombre, correo, contraseña) en el cuerpo de la petición, los inserta en la base de datos y responde con un mensaje de éxito o error dado sea el caso.

4.4 POST /api/iniciar:
    Maneja el inicio de sesión. Recibe el correo y la contraseña, verifica si existen en la base de datos y si coinciden. Responde con un JSON indicando si la autenticación fue exitosa o no.
