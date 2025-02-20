<template>
    <div class="sidebar collapsed position-fixed top-0 bottom-0 border-end m-md-2 rounded-4" style="background-color: #EFEDEF;">
        <div class="d-flex align-items-center px-3 pt-4">
            <a href="#" class="sidebar-logo fw-bold text-decoration-none fs-4" style="text-wrap: nowrap; color: #133E87;">Data Center</a>
            <i class="sidebar-toggle ri-arrow-left-circle-line ms-auto fs-5 d-none d-md-block"></i>
        </div>
        <ul class="sidebar-menu py-3 px-3 m-0 mb-0" style="text-wrap: nowrap;">
            <li class="sidebar-menu-divider mt-3 mb-2 fw-semibold">Main Navigation</li>
            <li class="sidebar-menu-item">
                <a href="#">
                    <img src="../assets/grid.svg" class="sidebar-menu-item-icon" style="width: 30px;" />
                    <span class="fw-semibold ps-2">Dashboard</span>
                    
                </a>
            </li>
            <li class="sidebar-menu-item has-dropdown">
                <a href="#">
                    <img src="../assets/construct.svg" class="sidebar-menu-item-icon" style="width: 30px;" />
                    <span class="fw-semibold ps-2">Project</span>

                    <img src="../assets/arrow-down.svg" class="sidebar-menu-item-accordion ms-auto" style="width: 20px;" />
                </a>
                <ul class="sidebar-dropdown-menu py-2">
                    <li class="sidebar-dropdown-menu-item border-start">
                        <router-link :to="'/boq'">
                            <span class="fw-semibold ms-1">BoQ Management</span>
                        </router-link>
                    </li>
                    <li class="sidebar-dropdown-menu-item">
                        <router-link :to="'/project'">
                            <span class="fw-semibold ms-1">Project Management</span>
                        </router-link>
                    </li>
                </ul>
            </li>
            <li class="sidebar-menu-item">
                <router-link :to="'/activity'">
                    <img src="../assets/tray.svg" class="sidebar-menu-item-icon" style="width: 30px;" />
                    <span class="fw-semibold ps-2">Activity</span>
                </router-link>
            </li>
            <li class="sidebar-menu-item">
                <router-link :to="'/users'">
                    <img src="../assets/person.svg" class="sidebar-menu-item-icon" style="width: 30px;" />
                    <span class="fw-semibold ps-2">User Management</span>
                </router-link>
            </li>

            <li class="sidebar-menu-divider mt-5 mb-2 fw-semibold">Settings</li>
            <li class="sidebar-menu-item">
                <router-link :to="'/account'">
                    <img src="../assets/profile.svg" class="sidebar-menu-item-icon" style="width: 30px;" />
                    <span class="fw-semibold ps-2">Account</span>
                    
                </router-link>
            </li>
        </ul>
    </div>
    <div class="sidebar-overlay"></div>
</template>