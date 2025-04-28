import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {QuestionComponent} from '../app/question/question.component'
import { SubjectSelectionComponent } from './subject-selection/subject-selection.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,QuestionComponent,SubjectSelectionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'activity_Project';
  
}
