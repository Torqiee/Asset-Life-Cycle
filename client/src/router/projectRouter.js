import BoqHardware from '../views/Project/Boq/BoqHardware.vue';
import BoqSoftware from '../views/Project/Boq/BoqSoftware.vue';
import BoqService from '../views/Project/Boq/BoqService.vue';
import BoqMain from '../views/Project/Boq/BoqMain.vue';
import AddFolder from '../views/Project/Boq/AddFolder.vue';
import UserManage from '../views/User/UserManage.vue';
import Approval from '../views/Project/Boq/Approval.vue';
import Rejection from '../views/Project/Boq/Rejection.vue';
import Submit from '../views/Project/Boq/Submit.vue';

import ProjectMain from '../views/Project/Project/ProjectMain.vue';
import AddProject from '../views/Project/Project/AddProject.vue';
import Order from '../views/Project/Project/Order.vue';
import ApprovalProject from '../views/Project/Project/Approval.vue';
import RejectionProject from '../views/Project/Project/Rejection.vue';
import SubmitProject from '../views/Project/Project/Submit.vue';

import MainActivity from '../views/Project/Activity/MainActivity.vue';

import { checkAdminRole } from '../router/authGuard';

const projectRouter = [
  {
    path: '/users',
    name: 'User Management',
    component: UserManage,
    beforeEnter: checkAdminRole
  },

  // Boq Management Router
  {
    path: '/boq',
    name: 'Main BoQ',
    component: BoqMain,
    beforeEnter: checkAdminRole
  },
  {
    path: '/add-folder',
    name: 'Add Folder BoQ',
    component: AddFolder,
    beforeEnter: checkAdminRole
  },
  {
    path: '/hardware/:folderId',
    name: 'Hardware in BoQ',
    component: BoqHardware,
    beforeEnter: checkAdminRole
  },  
  {
    path: '/software/:folderId',
    name: 'Software in BoQ',
    component: BoqSoftware,
    beforeEnter: checkAdminRole
  },
  {
    path: '/service/:folderId',
    name: 'Service in BoQ',
    component: BoqService,
    beforeEnter: checkAdminRole
  },
  {
    path: '/submit/:folderId',
    name: 'Submit in BoQ',
    component: Submit,
    beforeEnter: checkAdminRole
  },  
  {
    path: '/approval/:folderId',
    name: 'Approval in BoQ',
    component: Approval,
    beforeEnter: checkAdminRole
  },  
  {
    path: '/rejection/:folderId',
    name: 'Rejection in BoQ',
    component: Rejection,
    beforeEnter: checkAdminRole
  },

  // Project Management Router
  {
    path: '/project',
    name: 'Main Project',
    component: ProjectMain,
    beforeEnter: checkAdminRole
  },
  {
    path: '/add-project',
    name: 'Add Project',
    component: AddProject,
    beforeEnter: checkAdminRole
  },
  {
    path: '/order/:projectId',
    name: 'Purchase Order',
    component: Order,
    beforeEnter: checkAdminRole
  },  
  {
    path: '/approval-project/:projectId',
    name: 'Approval in Project',
    component: ApprovalProject,
    beforeEnter: checkAdminRole
  },  
  {
    path: '/rejection-project/:projectId',
    name: 'Rejection in Project',
    component: RejectionProject,
    beforeEnter: checkAdminRole
  },  
  {
    path: '/submit-project/:projectId/:orderId?',
    name: 'Submit in Project',
    component: SubmitProject,
    beforeEnter: checkAdminRole
  },

  //  Activity Management
  {
    path: '/activity',
    name: 'Activity in Project',
    component: MainActivity,
    beforeEnter: checkAdminRole
  },
]

export default projectRouter;