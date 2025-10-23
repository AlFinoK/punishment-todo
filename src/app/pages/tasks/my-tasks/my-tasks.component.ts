import { Component, OnInit } from '@angular/core';
import { TasksListComponent } from '../common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrl: './my-tasks.component.scss',
  imports: [TasksListComponent, HttpClientModule],
})
export class MyTasksComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const testUrl = `${environment.apiUrl}/tasks`;
    this.http.get(testUrl).subscribe({
      next: (res) => {
        alert('✅ Бэкенд работает! Ответ получен.');
        console.log('Ответ от API:', res);
      },
      error: (err) => {
        alert('❌ Ошибка при подключении к бэкенду!');
        console.error('Ошибка запроса:', err);
      },
    });
  }
}
