<template>
    <nav id="nav" class="navbar navbar-expand navbar-danger bg-primary d-flex justify-content-between">
        <router-link to="/" class="nav-link navbar-brand text-light" >Danh sách lớp học</router-link>
        <router-link to="student" class="nav-link navbar-brand text-light ">Danh sách học sinh</router-link>
        <router-link to="teacher" class="nav-link navbar-brand text-light ">Danh sách giáo viên</router-link>

        
        
        
        <!-- <div class="mr-auto navbar-nav">
            <li class="nav-item">
                <router-link :to="{ name: 'student' }" class="nav-link">
                    Danh sách học sinh
                    <i class="fas fa-user"></i>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'classroom' }" class="nav-link">
                    Danh sách giảng viên
                    <i class="fa fa-id-card" aria-hidden="true"></i>
                </router-link> 
            </li>
        </div> -->
    </nav>  
</template>
<style lang="css">
.text-dark {
    font-weight: 600;
    border-left: 2px solid;
    border-right: 2px solid;
}
</style>
