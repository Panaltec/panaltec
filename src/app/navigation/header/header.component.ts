import { AuthService } from '../../services/auth.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();

  public isLogin: boolean;
  public nombreUsuario: string;
  public emailUsuario: string;

  constructor( public authService: AuthService, private router: Router ) { }

  ngOnInit() {

  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onClickLogout() {
    this.authService.logout();
    this.router.navigate (['/login']);
  }

}
