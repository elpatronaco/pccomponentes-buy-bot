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
  email: 'amador@gmail.com',
  password: 'mariscosrecio',
  card: card,
  // SI QUIERES VARIOS PRODUCTOS APÍLALOS EN UN ARRAY
  items: [
    {
      link: 'https://www.pccomponentes.com/rtx-3060',
      maxPrice: 3000
    },
    {
      link: 'https://www.pccomponentes.com/rtx-3080-x-trio',
      maxPrice: 1000
    }
  ],
  // SI SÓLO QUIERES UNO
  items: {
    link: 'https://www.pccomponentes.com/rtx-3060',
    maxPrice: 3000
  },
  refreshRate: 1000,
  debug: false
})

app.run()
```

Finalmente ejecuta `npm start` y deja que trabaje
