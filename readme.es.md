# Bot PCComponentes

Un pequeño bot en node para comprar en pccomponentes.com. (_Puede estar desactualizado a causa de cambios en la página. Eres libre de hacer cualquier pull request_)

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

en la carpeta del proyecto. Después tienes que cambiar los parámetros en el archivo index.ts. Si no tienes ninguna targeta de crédito/débito en la página la puedes añadir aquí, y a la hora de pagar el bot la añadirá automáticamente y pagará con ella, pero no es requerida. Si no tienes una tarjeta en tu cuenta y no has añadido una en el bot, seleccionará por defecto el pago con transferencia.

```javascript
const card: ICard = {
  name: 'AMADOR RIVAS LOPEZ',
  num: '5137422665338597',
  expiryDate: '0421',
  cvc: '668'
}

const app = new Bot({
  email: 'amador@mariscosrecio.com',
  password: 'yoquese',
  card: card,
  link: 'https://www.pccomponentes.com/msi-rtx-3060-ti-ventus-2x-oc-8gb-gddr6',
  maxPrice: 440,
  refreshRate: 5000
})

app.run()
```

Finalmente ejecuta `npm start` y deja que trabaje
