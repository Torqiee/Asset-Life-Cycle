<template>
    <Sidebar />
    <!-- start: Main -->
    <main class="ms-md-2">
        <div class="p-2">
            <!-- start: Navbar -->
            <nav class="px-5 pb-4 rounded-top-4" style="background-color: #EFEDEF; padding-top: 2.5rem;">
                <i class="ri-menu-line sidebar-toggle me-3 d-block d-md-none"></i>
                <div class="d-flex flex-column">
                    <h3 class="fw-bold fs-3 me-auto mb-md-2" style="color: #133E87;">Bill of Quantity</h3>
                    <div class="d-md-block d-none">
                        <ol class="breadcrumb fw-semibold mb-0">
                            <li class="breadcrumb-item"><a href="#">Hardware</a></li>
                            <li class="breadcrumb-item"><a href="#">Software</a></li>
                            <li class="breadcrumb-item" style="color: #133E87;"><a href="#">Service</a></li>
                        </ol>
                    </div>
                </div>
                <div class="dropdown ms-auto">
                    <div class="d-flex align-items-center cursor-pointer">
                    <span class="me-3 d-none d-sm-block fs-5 fw-semibold">John Doe</span>
                    <img class="navbar-profile-image border border-3 rounded-5 border-secondary"
                        src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGVyc29ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
                        alt="Image"
                    >
                    </div>
                </div>
            </nav>
            <!-- end: Navbar -->
  
            <!-- start: Content -->
            <div class="py-4 px-4 rounded-bottom-4" style="background-color: #EFEDEF;">
                <!-- start: Summary -->
                <div class="row g-3 mx-3 px-4 pb-4 rounded-4" style="background-color: #EAE8EA;">
                    <div class="d-flex align-items-center py-2 mb-md-2">
                        <img src="../assets/reader.png" alt="logo" style="width: 40px;" />
                        <h1 class="fs-4 fw-bold mb-md-1 ms-3">Service</h1>
                        <a href="" class="btn text-white fw-medium ms-auto px-3 py-1" style="background-color: #133E87;">Add data +</a>
                    </div>
                    <div class="d-md-none d-block">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="#">Hardware</a></li>
                            <li class="breadcrumb-item"><a href="#">Software</a></li>
                            <li class="breadcrumb-item" style="color: #133E87;"><a href="#">Service</a></li>
                        </ol>
                    </div>
                    
                    <div class="table-responsive  px-2">
                        <table class="table align-middle">
                            <thead class="text-white align-middle" style="background-color: #133E87;">
                                <tr>
                                    <th class="fw-semibold px-3 rounded-start-3" scope="col">Category</th>
                                    <th class="fw-semibold px-3" scope="col">Quantity</th>
                                    <th class="fw-semibold px-3" scope="col">License Length</th>
                                    <th class="fw-semibold px-3" scope="col">Site TTC</th>
                                    <th class="fw-semibold px-3 rounded-end-3" scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="px-3">Service</td>
                                    <td class="px-3"></td>
                                    <td class="px-3"></td>
                                    <td class="px-3"></td>
                                    <td class="px-3">
                                        <a href="" class="btn text-white px-3 py-1 me-2" style="background-color: #133E87;">Edit</a>
                                        <a href="" class="btn btn-danger px-3 py-1">Delete</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!-- end: Content -->
        </div>
    </main>
</template>
  
<script>
import Sidebar from '../components/Sidebar.vue';
  
export default {
  name: "App",
    components: {
      Sidebar,
    },
};
</script>