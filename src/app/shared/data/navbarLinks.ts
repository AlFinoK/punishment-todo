import { NavbarLinksInterface } from '@shared/interfaces';

export const navbarLinks: NavbarLinksInterface[] = [
  {
    name: 'My tasks',
    routerLink: '/tasks/my-tasks',
    icon: 'mail',
  },
  {
    name: 'Important tasks',
    routerLink: '/tasks/important-tasks',
    icon: 'star',
  },
  {
    name: 'Finished tasks',
    routerLink: '/tasks/finished-tasks',
    icon: 'check',
  },
  {
    name: 'Deleted tasks',
    routerLink: '/tasks/deleted-tasks',
    icon: 'trash',
  },
];
