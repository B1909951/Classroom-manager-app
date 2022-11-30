<template>
     
    <div class="page row">
        <div class="col-md-6">
            
            <div class=" row justify-content-around align-items-center">
                <button class="btn btn-sm btn-primary" @click="refreshList()">
                    Làm mới
                </button>
                <router-link
                    :to="{
                         name: 'student.add',
                         params: {},
                    }"
                >
                    <button class="btn btn-sm btn-success" @click="goToAddStudent">
                        Thêm mới
                    </button>
                </router-link>
                <button
                    class="btn btn-sm btn-danger"
                    @click="removeAllStudents"
                >
                     Xóa tất cả
                </button>
            </div>
        </div>
        <div class="col-md-6">
            <InputSearch v-model="searchText" />
        </div>
        <div class="col-md-12 mt-5">
            <StudentList
                v-if="filteredStudentsCount > 0"
                :students="filteredStudents"
                v-model:activeIndex="activeIndex"
            />
            <p v-else>Không có học sinh nào.</p>
            

        </div>
        
    </div>
</template>
<script>
    import InputSearch from "@/components/InputSearch.vue";
    import StudentList from "@/components/StudentList.vue";
    import StudentService from "@/services/student.service";
    export default {
        components: {
            InputSearch,
            StudentList,
        },
        // Đoạn mã xử lý đầy đủ sẽ trình bày bên dưới

        data() {
            return {
                students: [],
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
            // Chuyển các đối tượng student thành chuỗi để tiện cho tìm kiếm.
            studentStrings() {
                return this.students.map((student) => {
                    const { name, birthday, pphone, class_name, sex } = student;
                    return [name, birthday, pphone, class_name, sex].join("");
                });
            },
                // Trả về các student có chứa thông tin cần tìm kiếm.
            filteredStudents() {
                if (!this.searchText) return this.students;
                return this.students.filter((_student, index) =>
                    this.studentStrings[index].includes(this.searchText)
                );
            },
            activeStudent() {
                if (this.activeIndex < 0) return null;
                return this.filteredStudents[this.activeIndex];
            },
            filteredStudentsCount() {
                return this.filteredStudents.length;
            },
        },
        methods: {
            async retrieveStudents() {
                try {
                    this.students = await StudentService.getAll();
                } catch (error) {
                    console.log(error);
                }
            },
            refreshList() {
                this.retrieveStudents();
                this.activeIndex = -1;
            },
            async removeAllStudents() {
                if (confirm("Bạn muốn xóa tất cả Học sinh?")) {
                    try {
                        await StudentService.deleteAll();
                        this.refreshList();
                    } catch (error) {
                        console.log(error);
                    }
                }
            },
            goToAddStudent() {
                this.$router.push({ name: "student.add" });
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