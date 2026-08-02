import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { register } from 'swiper/element/bundle';
import { AppComponent } from './app/app.component';

register();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
