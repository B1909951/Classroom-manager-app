<template>
     
    <div class="page row">
        <div class="col-md-6">
            
            <div class=" row justify-content-around align-items-center">
                <button class="btn btn-sm btn-primary" @click="refreshList()">
                    Làm mới
                </button>
                <router-link
                    :to="{
                         name: 'teacher.add',
                         params: {},
                    }"
                >
                    <button class="btn btn-sm btn-success" @click="goToAddTeacher">
                        Thêm mới
                    </button>
                </router-link>
                <button
                    class="btn btn-sm btn-danger"
                    @click="removeAllTeachers"
                >
                     Xóa tất cả
                </button>
            </div>
        </div>
        <div class="col-md-6">
            <InputSearch v-model="searchText" />
        </div>
        <div class="col-md-12 mt-5">
            <TeacherList
                v-if="filteredTeachersCount > 0"
                :teachers="filteredTeachers"
                v-model:activeIndex="activeIndex"
            />
            <p v-else>Không có giáo viên nào.</p>
            

        </div>
        
    </div>
</template>
<script>
    import InputSearch from "@/components/InputSearch.vue";
    import TeacherList from "@/components/TeacherList.vue";
    import TeacherService from "@/services/teacher.service";
    export default {
        components: {
            InputSearch,
            TeacherList,
        },
        // Đoạn mã xử lý đầy đủ sẽ trình bày bên dưới

        data() {
            return {
                teachers: [],
                activeIndex: -1,
                searchText: "",
            };
        },
        watch: {
        // Giám sát các thay đổi của biến searchText.
        // Bỏ chọn phần tử đang được chọn trong danh sách.
            searchText() {
                this.activeIndex = -1;
            },
        },
        computed: {
            // Chuyển các đối tượng classroom thành chuỗi để tiện cho tìm kiếm.
            teacherStrings() {
                return this.teachers.map((teacher) => {
                    const { name, phone } = teacher;
                    return [name, phone].join("");
                });
            },
                // Trả về các classroom có chứa thông tin cần tìm kiếm.
            filteredTeachers() {
                if (!this.searchText) return this.teachers;
                return this.teachers.filter((_teacher, index) =>
                    this.teacherStrings[index].includes(this.searchText)
                );
            },
            activeTeacher() {
                if (this.activeIndex < 0) return null;
                return this.filteredTeachers[this.activeIndex];
            },
            filteredTeachersCount() {
                return this.filteredTeachers.length;
            },
        },
        methods: {
            async retrieveTeachers() {
                try {
                    this.teachers = await TeacherService.getAll();
                } catch (error) {
                    console.log(error);
                }
            },
            refreshList() {
                this.retrieveTeachers();
                this.activeIndex = -1;
            },
            async removeAllTeachers() {
                if (confirm("Bạn muốn xóa tất cả Lớp học?")) {
                    try {
                        await TeacherService.deleteAll();
                        this.refreshList();
                    } catch (error) {
                        console.log(error);
                    }
                }
            },
            goToAddTeacher() {
                this.$router.push({ name: "teacher.add" });
            },
        },
        mounted() {
            this.refreshList();
        },
    };
</script>
<style scoped>
    .page {
        text-align: left;
        width: 100%;
    }
</style>