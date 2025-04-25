import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { schoolStructure, SectionType }  from '../structure/school-data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subject-selection',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './subject-selection.component.html',
  styleUrls: ['./subject-selection.component.css']
})
export class SubjectSelectionComponent {
  schoolStructure = schoolStructure;
  schoolSections: { label: string; value: SectionType }[] = [
    { label: 'عربي', value: 'عربي' },
    { label: 'لغات', value: 'لغات' }
  ];
  

  selectedSection: SectionType | null = null;

  selectedGrade: string | null = null;
  selectedSubject: string | null = null;

  getGrades(): string[] {
    return this.selectedSection ? this.schoolStructure[this.selectedSection].grades : [];
  }
  
  getSubjects(): string[] {
    return this.selectedSection ? this.schoolStructure[this.selectedSection].subjects : [];
  }
  

  constructor(private router: Router) {}

startQuestions() {
  if (this.selectedSection && this.selectedGrade && this.selectedSubject) {
    this.router.navigate(['/questions'], {
      queryParams: {
        section: this.selectedSection,
        grade: this.selectedGrade,
        subject: this.selectedSubject
      }
    });
  }
}
  onSectionChange() {
    this.selectedGrade = null;
    this.selectedSubject = null;
  }
  
}