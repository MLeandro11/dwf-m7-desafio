import { Router } from '@vaadin/router';

export const router = new Router(document.querySelector('.root'));

router.setRoutes([
  { path: '/', component: 'my-home' },
  { path: '/signin', component: 'signin-page' },
  { path: '/profile', component: 'profile-page' },
  { path: '/my-pets', component: 'pets-page' },
  { path: '/report', component: 'report-page' },
  { path: '/report/edit-pet', component: 'report-edit' }
]);