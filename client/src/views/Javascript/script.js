function initializeSidebar() {
    // Ensure sidebar starts collapsed on mobile
    if (window.innerWidth < 768) {
        $('.sidebar').addClass('collapsed');
    }

    // Sidebar Toggle
    $('.sidebar-toggle').off('click').on('click', function () {
        let sidebar = $('.sidebar');

        if (sidebar.hasClass('collapsed')) {
            sidebar.removeClass('collapsed');
        } else {
            sidebar.addClass('collapsed');
            $('.sidebar-dropdown-menu').slideUp('fast');
            $('.sidebar-menu-item.has-dropdown, .sidebar-dropdown-menu-item.has-dropdown').removeClass('focused');
        }
    });

    // Dropdown Menu Toggle
    $('.sidebar-menu-item.has-dropdown > a, .sidebar-dropdown-menu-item.has-dropdown > a').off('click').on('click', function (e) {
        e.preventDefault();

        if (!$(this).parent().hasClass('focused')) {
            $(this).closest('.sidebar').find('.sidebar-dropdown-menu').slideUp('fast');
            $(this).closest('.sidebar').find('.has-dropdown').removeClass('focused');
        }

        $(this).next('.sidebar-dropdown-menu').slideToggle('fast');
        $(this).parent().toggleClass('focused');
    });

    // Sidebar Overlay (for closing sidebar on mobile)
    $('.sidebar-overlay').off('click').on('click', function () {
        $('.sidebar').addClass('collapsed');
        $('.sidebar-dropdown-menu').slideUp('fast');
        $('.sidebar-menu-item.has-dropdown, .sidebar-dropdown-menu-item.has-dropdown').removeClass('focused');
    });
}

// Initialize Sidebar on Page Load
$(document).ready(function () {
    initializeSidebar();

    // Reinitialize when navigating in AJAX/Vue Router
    $(document).on('page:load turbolinks:load ajaxComplete', function () {
        initializeSidebar();
    });
});
