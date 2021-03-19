# Bot PCComponentes

Un pequeño bot en node para que puedas mearte en los mineros. (_Puede estar desactualizado a causa de cambios en la página. Eres libre de hacer cualquier pull request_)

### Tiendas soportadas actualmente:

- **PCComponentes**
- **LDLC**
- **Coolmod**
- **Aussar** (puede funcionar mal)

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

Ahora prueba a ejecutar el bot, este debería de funcionar correctamente.

### Error Timeout al abrir las páginas

Si os encontrais con este error es porque el dispositivo donde estés ejecutando el bot no es capaz de cargar todas las páginas que le has introducido en 30s (es el timeout por defecto). Para corregir este error debes subir el Timeout del bot desde el fichero data.json. También se puede deshabilitar si se pone a 0.

```json
{
  "timeout": 30000 // milisegundos
}
```

Con esto debería de estar corregido el error, pero os recomiendo reducir el número de páginas a consultar ya que ralentizará al bot en general puesto que estais sobrecargando la máquina que lo ejecuta.
