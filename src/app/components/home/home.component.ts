import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  users: User[];

  constructor(public userService: UserService, private router: Router) {
    if (!this.userService.user) {
      this.router.navigateByUrl('/');
    } else {
      this.userService.getAll().subscribe(
        (data: User[]) => {
          this.users = data.filter(
            (user: User) => user.email != this.userService.user.email
          );
          console.log(this.users);
        },
        (error) => {}
      );
    }
  }

  ngOnInit(): void {}

  handleExit(): void {
    this.userService.user = null;
    this.router.navigateByUrl('/');
  }
}
