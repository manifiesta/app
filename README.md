<div align="center">
  <picture>
    <img alt="logo" height="200px" src="https://github.com/manifiesta/app/assets/45843802/73ccdfd3-5f41-48c2-9c23-50b5437be46a">
  </picture>
</div>

# My ManiFiesta

ManiFiesta is a festival that takes place every year in September in Belgium, the festival of solidarity, with concerts, debates or artistic activities.

This repo contains the code for the official mobile app.

## Tech stuff

The application is made with [Ionic Angular](https://ionicframework.com/docs/angular/overview)

New color to apply ? Go to src/theme/variable.scss and there is the color generator https://ionicframework.com/docs/theming/color-generator
With that you can change the primary, secondary and other color easily

The info to change the icon and splashscreen https://capacitorjs.com/docs/guides/splash-screens-and-icons be carefull of the size !

For the Play Store, the icon need to be 512x512 pixel, the presentation image 1024x500 pixel and the screenshot of the app for phone need a ratio 16:9 or 9:16

For Apple Store we need screenshot right from the physical iPhone (no emulator)

See the package json file to see automatic script to run, test and build. Information for deployed on the Play and Apple Store will come later.

## License

[GPLv3](https://choosealicense.com/licenses/gpl-3.0/)

## TODO

Lot of refactor

Unit Testing

Any idea of new functionality?
