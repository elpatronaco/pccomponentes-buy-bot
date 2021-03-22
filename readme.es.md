# Bot PCComponentes

**Si te gusta mi trabajo puedes donar aquí:**

[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://www.paypal.com/paypalme/paucolome)[![Donate](https://img.shields.io/badge/BitCoin-bc1q7dwjlknyvwv4s4hr7gmzje96awv5s47hys38xq-yellow)](https://link.trustwallet.com/send?coin=0&address=bc1q7dwjlknyvwv4s4hr7gmzje96awv5s47hys38xq)[![Donate](https://img.shields.io/badge/NANO-nano_3t6mahppbnjg43b3ri6z4ywt5hhtdkf9cpgnny19uonptg8a5sabkfgj4fw9-9cf)](https://link.trustwallet.com/send?coin=165&address=nano_3t6mahppbnjg43b3ri6z4ywt5hhtdkf9cpgnny19uonptg8a5sabkfgj4fw9)

Un pequeño bot en node para que puedas mearte en los mineros. (_Puede estar desactualizado a causa de cambios en la página. Eres libre de hacer cualquier pull request_)

:warning: **Disclaimer**: El uso de este bot está en un vacío legal (al menos en España). Asegúrate de mirar las leyes correspondientes en tu país. Tú eres responsable de tus acciones y nunca deberías culpar al creador ni a los contribuidores.

### Tiendas soportadas actualmente:

- **PCComponentes**
- **LDLC**
- **Coolmod**
- **Aussar** (no acabada)
- **Amazon** [necesitas tener 1-Click configurado]

### [in English](https://github.com/elpatronaco/pccomponentes-buy-bot/blob/master/readme.md)

## Tutorial

Para correr el bot necesitas la última versión de [Node](https://nodejs.org/es/download/) instalada y el [chromedriver](https://chromedriver.chromium.org/getting-started) para tu versión de chrome

Abre la consola y escribe

```console
cd [directorio del proyecto, ej /usr/app/ o C://app]
```

Luego instala los módulos de node con el comando

```console
npm install
```

en la carpeta del proyecto. Después tienes que cambiar los parámetros en el archivo data.json.

```javascript
"pccomponentes": {
  "email": "amador@gmail.com",
  "password": "mariscosrecio",
  "items": [
    {
      "link": "https://www.pccomponentes.com/xiaomi-mi-computer-monitor-light-bar?gclid=Cj0KCQiAhP2BBhDdARIsAJEzXlFGPt39wcTtyjo0deaBkYmMFp7w0uHrSrSwFlMSCJzVJIUCZZYrQs0aAvfzEALw_wcB&",
      "maxPrice": 3000
    }
  ]
},
```

Finalmente ejecuta `npm start` y deja que trabaje

## Posibles errores

### Error del ejecutable de Chromium en UNIX

Si estás ejecutando el bot en un dispositivo con arquitectura ARM posiblemente dé error la versión de chromium que viene por defecto con puppeteer. Para solucionarlo es necesario instalar Chromium de manera externa. Puedes hacerlo así si estas en Ubuntu o Debian:

```
sudo apt install chromium-browser
```

Una vez instalado Chromium debes indicar al bot que quieres cargar la versión externa de Chromium. Para ello es necesario saber donde se encuentra Chromium, puedes encontrar la ruta así si tu sistema es Ubuntu o Debian:

```
which chromium-browser
```

Una vez obtenida la ruta de Chromium (por defecto es /usr/bin/chromium-browser), debes añadirla a los ajustes del bot en el fichero data.json. Debe quedar así:

```json
{
  "browserOptions": {
    "headless": {
      "headless": true,
      "defaultViewport": null,
      "executablePath": "/usr/bin/chromium-browser" // ruta
    },
    "debug": {
      "headless": false,
      "args": ["--start-maximized"],
      "defaultViewport": null
    }
  }
}
```

Ahora debería funcionar correctamente
