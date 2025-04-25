export type SectionType = 'عربي' | 'لغات';

export const schoolStructure: Record<SectionType, { grades: string[]; subjects: string[] }> = {
  عربي: {
    grades: ['KG1', 'KG2'],
    subjects: ['عربي', 'رياضيات', 'متعدد', 'English Connect', 'English Crystal'],
  },
  لغات: {
    grades: ['KG1', 'KG2'],
    subjects: ['عربي', 'Math', 'Discover', 'English Connect +', 'English Crystal'],
  },
};