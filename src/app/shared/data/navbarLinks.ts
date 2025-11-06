import { NavbarLinksInterface } from '@shared/interfaces';

export const navbarLinks: NavbarLinksInterface[] = [
  {
    name: 'My tasks',
    routerLink: '/tasks/my-tasks',
    icon: 'mail',
  },
  {
    name: 'Important',
    routerLink: '/tasks/important-tasks',
    icon: 'star',
  },
  {
    name: 'Completed',
    routerLink: '/tasks/completed-tasks',
    icon: 'check',
  },
  {
    name: 'Deleted',
    routerLink: '/tasks/deleted-tasks',
    icon: 'trash',
  },
];
