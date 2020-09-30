import { trigger, transition, style, animate } from '@angular/animations';

export const animationShow = trigger('showSmooth', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('200ms ease-in', style({ opacity: 1 })),
  ]),
  transition(':leave', [
    style({ opacity: 1 }),
    animate('200ms ease-in', style({ opacity: 0 })),
  ]),
]);
