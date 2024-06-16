# Pruebas en Solidity

## Descripción del Proyecto
Este proyecto consiste en la realización de diversas pruebas en Solidity utilizando Hardhat como herramienta de desarrollo.

## Instalación
Para comenzar a trabajar con este proyecto, sigue los siguientes pasos:
1. Clona este repositorio en tu máquina local.
2. Ejecuta `npm install` para instalar todas las dependencias necesarias.

## Compilar y Test de hardhat
Se ejecuta el comando

1. npx hardhat compile
2. npx hardhat test

## Requisitos
Este proyecto utiliza Hardhat y algunas variables de entorno para su configuración. A continuación, se detallan las instrucciones para su uso:

- Se utilizan variables de sistema para configurar ciertos aspectos del proyecto. Estas variables se almacenan localmente en el sistema y no en el repositorio por razones de seguridad.
- Para utilizar una variable del sistema, invócala utilizando `vars.get["nombre de variable"]`.
- Puedes ver dónde están almacenadas las variables utilizando el comando `npx hardhat vars path`. Por ejemplo: `C:\Users\Enzo Meoniz\AppData\Roaming\hardhat-nodejs\Config\vars.json`.
- Para agregar nuevas variables, utiliza el comando `npx hardhat vars set NOMBRE_DE_LA_VARIABLE`.
- Para consultar el valor de una variable, utiliza el comando `npx hardhat vars get NOMBRE_DE_LA_VARIABLE`.

### Detalles de las variables agregadas hasta el momento
- `TEST_INFURA_API_KEY`: API key generada desde Infura.
- `TEST_ACCOUNT_PRIVATE_KEY`: La clave privada de mi wallet para realizar pruebas.

## Contribuciones
¡Se anima a cualquier persona a contribuir al proyecto! Si deseas contribuir, asegúrate de seguir estas directrices:
- Realiza un fork del repositorio.
- Crea una nueva rama para tu contribución.
- Haz tus cambios y realiza un pull request.

## Licencia
Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE.md para obtener más detalles.

## Autor y Reconocimientos
Autor: Meoniz Enzo.

## Estado del Proyecto
Actualmente, el proyecto se encuentra en desarrollo.

## Contacto
Si tienes alguna pregunta o sugerencia, no dudes en contactarme en [enzomeoniz@gmail.com](mailto:enzomeoniz@gmail.com).
