import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule], // Import FormsModule for ngModel
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: any[] = [];
  newTask: string = '';
  tasks: { name: string; completed: boolean }[] = [];

  // Local Storage CRUD Variables
  newUser = { name: '', email: '' };
  localUsers: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.loadLocalUsers();
  }

  fetchUsers() {
    this.http.get<any[]>('http://localhost:3000/users').subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  addTask() {
    if (this.newTask.trim()) {
      this.tasks.push({ name: this.newTask, completed: false });
      this.newTask = '';
    }
  }

  toggleTask(index: number) {
    this.tasks[index].completed = !this.tasks[index].completed;
  }

  deleteTask(index: number) {
    this.tasks.splice(index, 1);
  }

  // CRUD Operations with Local Storage
  loadLocalUsers() {
    const storedUsers = localStorage.getItem('users');
    this.localUsers = storedUsers ? JSON.parse(storedUsers) : [];
  }

  addUser() {
    if (this.newUser.name && this.newUser.email) {
      this.localUsers.push({ ...this.newUser });
      this.newUser = { name: '', email: '' };
      this.saveLocalUsers();
    }
  }

  editUser(index: number) {
    this.newUser = { ...this.localUsers[index] };
    this.deleteUser(index);
  }

  deleteUser(index: number) {
    this.localUsers.splice(index, 1);
    this.saveLocalUsers();
  }

  saveLocalUsers() {
    localStorage.setItem('users', JSON.stringify(this.localUsers));
  }
}
