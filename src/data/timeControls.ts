import { TimeControlOption } from '../types';

export const TIME_CONTROLS: TimeControlOption[] = [
  // Bullet
  {
    id: 'bullet-1-0',
    name: '1 daqiqa',
    type: 'bullet',
    initialSeconds: 60,
    incrementSeconds: 0,
    badge: '1 daq',
    description: 'Ultra tezkor Bullet (har bir tomon uchun 1 daqiqa)'
  },
  {
    id: 'bullet-1-1',
    name: '1 | 1',
    type: 'bullet',
    initialSeconds: 60,
    incrementSeconds: 1,
    badge: '1+1',
    description: '1 daqiqa + har bir yurish uchun 1 soniya qo\'shimcha'
  },
  {
    id: 'bullet-2-1',
    name: '2 | 1',
    type: 'bullet',
    initialSeconds: 120,
    incrementSeconds: 1,
    badge: '2+1',
    description: '2 daqiqa + har bir yurish uchun 1 soniya qo\'shimcha'
  },

  // Blitz
  {
    id: 'blitz-3-0',
    name: '3 daqiqa',
    type: 'blitz',
    initialSeconds: 180,
    incrementSeconds: 0,
    badge: '3 daq',
    description: 'Klassik tezkor Blitz (3 daqiqa)'
  },
  {
    id: 'blitz-3-2',
    name: '3 | 2',
    type: 'blitz',
    initialSeconds: 180,
    incrementSeconds: 2,
    badge: '3+2',
    description: '3 daqiqa + har bir yurish uchun 2 soniya qo\'shimcha'
  },
  {
    id: 'blitz-5-0',
    name: '5 daqiqa',
    type: 'blitz',
    initialSeconds: 300,
    incrementSeconds: 0,
    badge: '5 daq',
    description: 'Eng mashhur 5 daqiqalik Blitz bellashuvi'
  },
  {
    id: 'blitz-5-3',
    name: '5 | 3',
    type: 'blitz',
    initialSeconds: 300,
    incrementSeconds: 3,
    badge: '5+3',
    description: '5 daqiqa + har bir yurish uchun 3 soniya qo\'shimcha'
  },

  // Rapid
  {
    id: 'rapid-10-0',
    name: '10 daqiqa',
    type: 'rapid',
    initialSeconds: 600,
    incrementSeconds: 0,
    badge: '10 daq',
    description: 'Standart Rapid (chuqurroq o\'ylash uchun 10 daqiqa)'
  },
  {
    id: 'rapid-15-10',
    name: '15 | 10',
    type: 'rapid',
    initialSeconds: 900,
    incrementSeconds: 10,
    badge: '15+10',
    description: 'FIDE Rapid formati: 15 daqiqa + har yurishga 10 soniya'
  },
  {
    id: 'rapid-30-0',
    name: '30 daqiqa',
    type: 'rapid',
    initialSeconds: 1800,
    incrementSeconds: 0,
    badge: '30 daq',
    description: 'Klassik xotirjam Rapid partiyasi'
  },

  // Unlimited / Casual
  {
    id: 'unlimited',
    name: 'Cheksiz vaqt',
    type: 'classical',
    initialSeconds: 0,
    incrementSeconds: 0,
    badge: 'Vaqtsiz',
    description: 'Soatsiz, xotirjam mashg\'ulot va tahlil uchun'
  }
];
