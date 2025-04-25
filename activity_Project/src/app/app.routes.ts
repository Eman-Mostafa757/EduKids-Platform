import { Routes } from '@angular/router';
import {SubjectSelectionComponent} from '../app/subject-selection/subject-selection.component';
import {QuestionComponent} from '../app/question/question.component';
export const routes: Routes = [
    { path: '', component: SubjectSelectionComponent },
{ path: 'questions', component: QuestionComponent }
];
