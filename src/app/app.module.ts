import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase, AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from 'angularfire2/auth';
// import { NgxEchartsModule } from 'ngx-echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { MessagesService } from './services/messages.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { AppRoutingModule } from './routes/app-routing.module';
import { LayoutComponent } from './navigation/layout/layout.component';
import { D1Component } from './pages/d1/d1.component';
import { ProductsComponent } from './pages/products/products.component';
import { BlogComponent } from './pages/blog/blog.component';
import { LoginComponent } from './navigation/login/login.component';
import { HeaderComponent } from './navigation/header/header.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    NgbModule.forRoot(),
    // NgxEchartsModule,
    NgxEchartsModule,
    AppRoutingModule,
    FlexLayoutModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
  ],
  declarations: [
    AppComponent,
    LayoutComponent,
    D1Component,
    ProductsComponent,
    BlogComponent,
    LoginComponent,
    HeaderComponent,
  ],
  providers: [
    MessagesService,
    AuthService,
    AngularFireDatabase,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
