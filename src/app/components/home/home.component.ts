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
  account: User;
  users: User[];
  suggestions: User[];
  requests: User[];
  pendings: User[];

  constructor(public userService: UserService, private router: Router) {
    if (!this.userService.user) {
      this.router.navigateByUrl('/');
    } else {
      this.getCoreData();
    }
  }

  ngOnInit(): void {}

  handleExit(): void {
    this.userService.user = null;
    this.router.navigateByUrl('/');
  }

  async getCoreData(): Promise<void> {
    try {
      this.account = await this.userService
        .getUser(this.userService.user.email)
        .toPromise();
      this.userService.user = this.account;
      this.users = await this.userService.getAll().toPromise();
      this.users = this.users.filter(
        (user: User) => user.email != this.account.email
      );
      this.suggestions = this.users.filter(
        (user: User) =>
          !this.account.friends.includes(user.email) &&
          !this.account.invitations.includes(user.email) &&
          !user.invitations.includes(this.account.email)
      );
      this.requests = this.users.filter((user: User) =>
        this.account.invitations.includes(user.email)
      );
      this.pendings = this.users.filter((user: User) =>
        user.invitations.includes(this.account.email)
      );
      console.log(this.pendings);
    } catch (error) {
      console.log(error);
    }
  }

  sendInvitation(suggestion: User): void {
    suggestion.invitations.push(this.account.email);
    this.userService.updateUser(suggestion).subscribe(
      () => this.getCoreData(),
      (error) => console.log(error)
    );
  }
}
