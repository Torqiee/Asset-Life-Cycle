import BoqHardware from '../views/Project/BoqHardware.vue';
import BoqSoftware from '../views/Project/BoqSoftware.vue';
import BoqService from '../views/Project/BoqService.vue';

const projectRouter = [
  {
    path: '/hardware-boq',
    name: 'Hardware BoQ',
    component: BoqHardware,
  },
  {
    path: '/software-boq',
    name: 'Software BoQ',
    component: BoqSoftware,
  },
  {
    path: '/service-boq',
    name: 'Service BoQ',
    component: BoqService,
  },
]

export default projectRouter;