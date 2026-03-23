import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

// O bootstrapApplication é a função que inicia a aplicação Angular, passando o componente raiz (AppComponent) e a configuração da aplicação (appConfig).
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
