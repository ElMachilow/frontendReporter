import { CoreMenu } from '@core/types'

export const menu: CoreMenu[] = [
  {

    id: 'dashboard',
    title: 'Dashboard',
    translate: '',
    type: 'item',
    role: ['User', 'Admin'], //? To set multiple role: ['Admin', 'Client']
    icon: 'bar-chart',
    url: 'main/dashboard/home'

  },
  {

    id: '2',
    title: 'Horas',
    translate: '',
    type: 'item',
    role: ['User'],
    icon: 'clock',
    url: 'main/horas'

  },
  {

    id: '3',
    title: 'Reportes',
    translate: '',
    type: 'item',
    role: ['Admin'],
    icon: 'file-text',
    url: 'main/reportes'

  },
  {
    id: '4',
    title: 'Horas',
    translate: '',
    type: 'item',
    role: ['Admin'],
    icon: 'clock',
    url: 'main/horas/todos'

  },  {
    id: '5',
    title: 'Colaboradores',
    translate: '',
    type: 'item',
    role: ['Admin'],
    icon: 'file',
    url: 'main/profile/list'

  },
]
