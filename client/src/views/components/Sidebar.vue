<template>
    <div class="sidebar position-fixed top-0 bottom-0 border-end m-md-2 rounded-4" style="background-color: #EFEDEF;">
        <div class="d-flex align-items-center px-4 pt-4">
            <a href="#" class="sidebar-logo fw-bold text-decoration-none fs-4" style="text-wrap: nowrap; color: #133E87;">Data Center</a>
            <i class="sidebar-toggle ri-arrow-left-circle-line ms-auto fs-5 d-none d-md-block"></i>
        </div>
        <ul class="sidebar-menu py-3 px-3 m-0 mb-0" style="text-wrap: nowrap;">
            <li class="sidebar-menu-divider mt-3 mb-1 fw-semibold">Main Navigation</li>
            <li class="sidebar-menu-item">
                <a href="#">
                    <img src="../assets/grid.svg" class="sidebar-menu-item-icon" style="width: 30px;" />
                    <span class="fw-semibold">Dashboard</span>
                    
                </a>
            </li>
            <li class="sidebar-menu-item has-dropdown">
                <a href="#">
                    <img src="../assets/construct.svg" class="sidebar-menu-item-icon" style="width: 30px;" />
                    <span class="fw-semibold">Project</span>

                    <i class="ri-arrow-down-s-line sidebar-menu-item-accordion ms-auto"></i>
                </a>
                <ul class="sidebar-dropdown-menu">
                    <li class="sidebar-dropdown-menu-item">
                        <a href="#">
                            User Profile
                        </a>
                    </li>
                    <li class="sidebar-dropdown-menu-item">
                        <a href="#">
                            Pricing
                        </a>
                    </li>
                    <li class="sidebar-dropdown-menu-item">
                        <a href="#">
                            About Us
                        </a>
                    </li>
                    <li class="sidebar-dropdown-menu-item">
                        <a href="#">
                            Contact Us
                        </a>
                    </li>
                    <li class="sidebar-dropdown-menu-item">
                        <a href="#">
                            Our Team
                        </a>
                    </li>
                </ul>
            </li>
            <li class="sidebar-menu-item has-dropdown">
                <a href="#">
                    <i class="ri-user-line sidebar-menu-item-icon"></i>
                    Authentication
                    <i class="ri-arrow-down-s-line sidebar-menu-item-accordion ms-auto"></i>
                </a>
                <ul class="sidebar-dropdown-menu">
                    <li class="sidebar-dropdown-menu-item">
                        <a href="#">
                            Login
                        </a>
                    </li>
                    <li class="sidebar-dropdown-menu-item">
                        <a href="#">
                            Registration
                        </a>
                    </li>
                    <li class="sidebar-dropdown-menu-item">
                        <a href="#">
                            Reset Password
                        </a>
                    </li>
                    <li class="sidebar-dropdown-menu-item">
                        <a href="#">
                            Change Password
                        </a>
                    </li>
                    <li class="sidebar-dropdown-menu-item">
                        <a href="#">
                            Confirm Password
                        </a>
                    </li>
                    <li class="sidebar-dropdown-menu-item">
                        <a href="#">
                            Deactivate Account
                        </a>
                    </li>
                </ul>
            </li>
            <li class="sidebar-menu-item has-dropdown">
                <a href="#">
                    <i class="ri-window-line sidebar-menu-item-icon"></i>
                    Widgets
                    <i class="ri-arrow-down-s-line sidebar-menu-item-accordion ms-auto"></i>
                </a>
                <ul class="sidebar-dropdown-menu">
                    <li class="sidebar-dropdown-menu-item">
                        <a href="#">
                            Charts
                        </a>
                    </li>
                    <li class="sidebar-dropdown-menu-item">
                        <a href="#">
                            Tables
                        </a>
                    </li>
                </ul>
            </li>
            <li class="sidebar-menu-divider mt-3 mb-1 text-uppercase">Apps</li>
            <li class="sidebar-menu-item has-dropdown">
                <a href="#">
                    <i class="ri-shopping-cart-2-line sidebar-menu-item-icon"></i>
                    eCommerce
                    <i class="ri-arrow-down-s-line sidebar-menu-item-accordion ms-auto"></i>
                </a>
                <ul class="sidebar-dropdown-menu">
                    <li class="sidebar-dropdown-menu-item">
                        <a href="#">
                            Shop
                        </a>
                    </li>
                    <li class="sidebar-dropdown-menu-item">
                        <a href="#">
                            Checkout
                        </a>
                    </li>
                    <li class="sidebar-dropdown-menu-item">
                        <a href="#">
                            Details
                        </a>
                    </li>
                    <li class="sidebar-dropdown-menu-item">
                        <a href="#">
                            Wishlist
                        </a>
                    </li>
                </ul>
            </li>
            <li class="sidebar-menu-item">
                <a href="#">
                    <i class="ri-mail-line sidebar-menu-item-icon"></i>
                    Email
                </a>
            </li>
            <li class="sidebar-menu-item">
                <a href="#">
                    <i class="ri-calendar-line sidebar-menu-item-icon"></i>
                    Calendar
                </a>
            </li>
        </ul>
    </div>
    <div class="sidebar-overlay"></div>
</template>