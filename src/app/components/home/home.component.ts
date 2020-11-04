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
  friends: User[];

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
      this.friends = this.users.filter((user: User) =>
        this.account.friends.includes(user.email)
      );
      console.log(this.friends);
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

  cancelInvitation(pending: User): void {
    pending.invitations = pending.invitations.filter(
      (invitation) => invitation != this.account.email
    );
    console.log(pending);
    this.userService.updateUser(pending).subscribe(
      () => this.getCoreData(),
      (error) => console.log(error)
    );
  }

  async acceptInvitation(request: User): Promise<void> {
    try {
      this.account.invitations = this.account.invitations.filter(
        (invitation) => invitation != request.email
      );
      this.account.friends.push(request.email);
      await this.userService.updateUser(this.account).toPromise();
      request.friends.push(this.account.email);
      await this.userService.updateUser(request).toPromise();
      this.getCoreData();
    } catch (error) {
      console.log(error);
    }
  }

  declineInvitation(request: User): void {
    this.account.invitations = this.account.invitations.filter(
      (invitation) => invitation != request.email
    );
    this.userService.updateUser(this.account).subscribe(
      () => this.getCoreData(),
      (error) => console.log(error)
    );
  }

  async deleteFriend(friend: User): Promise<void> {
    try {
      this.account.friends = this.account.friends.filter(
        (currentFriend) => currentFriend != friend.email
      );
      await this.userService.updateUser(this.account).toPromise();
      friend.friends = friend.friends.filter(
        (currentFriend) => currentFriend != this.account.email
      );
      await this.userService.updateUser(friend).toPromise();
      this.getCoreData();
    } catch (error) {
      console.log(error);
    }
  }
}
