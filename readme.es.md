# Bot PCComponentes

Un pequeño bot en node para comprar en pccomponentes.com. (**Puede estar desactualizado a causa de cambios en la página. Eres libre de hacer cualquier pull request**)

### [in English](https://github.com/elpatronaco/pccomponentes-buy-bot/blob/master/readme.md)

## Tutorial

Para correr el bot necesitas la última versión de Node instalada y el chromedriver para tu versión de chrome (puedes instalarla desde [aquí](https://chromedriver.chromium.org/getting-started))

Instala los módulos de node con el comando `npm script` en la carpeta del proyecto. Después tienes que cambiar los parámetros en el archivo index.ts. Si no tienes ninguna targeta de crédito/débito en la página la puedes añadir aquí, y a la hora de pagar el bot la añadirá automáticamente y pagará con ella, pero no es requerida.

```javascript
let card: ICard = {
  name: 'AMADOR RIVAS',
  num: 54025187234213,
  expiryDate: 0925,
  cvc: 134
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
