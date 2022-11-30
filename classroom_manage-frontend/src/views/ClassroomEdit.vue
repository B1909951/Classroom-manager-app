<template>
    <div class="page">
        <h4>Hiệu chỉnh Lớp học</h4>
        <ClassroomForm
            :classroom="classroom"
            @submit:classroom="updateClassroom"
            @delete:classroom="deleteClassroom"
             v-if="filteredTeachersCount > 0"
                :teachers="filteredTeachers"
                v-model:activeIndex="activeIndex"  
        /> 
            <p v-else>Không có giáo viên nào.</p>
        <p>{{ message }}</p>
    </div>
</template>
<script>
import ClassroomForm from "@/components/ClassroomForm.vue";
import ClassroomService from "@/services/classroom.service";
import TeacherService from "@/services/teacher.service";

export default {
    components: {
        ClassroomForm,
    },
    props: {
        id: { type: String, required: true },
    },
    data() {
        return {

            classroom: null,
            message: "",
            teachers: [],

        };
    },
    computed: {
            // Chuyển các đối tượng teacher thành chuỗi để tiện cho tìm kiếm.
            teacherStrings() {
                return this.teachers.map((teacher) => {
                    const { name, phone } = teacher;
                    return [name, phone].join("");
                });
            },
                // Trả về các teacher có chứa thông tin cần tìm kiếm.
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
        
        async getClassroom(id) {
            try {
                this.classroom = await ClassroomService.get(id);
            } catch (error) {
                console.log(error);
                // Chuyển sang trang NotFound đồng thời giữ cho URL không đổi
                this.$router.push({
                    name: "notfound",
                    params: {
                        pathMatch: this.$route.path.split("/").slice(1)
                    },
                    query: this.$route.query,
                    hash: this.$route.hash,
                });
            }
        },
        
        async updateClassroom(data) {
            try {
                var x = await ClassroomService.update(this.classroom._id, data)
                if(x.message==1){
                    this.message = "Lớp học được cập nhật thành công.";
                }else{
                    this.message = "Tên lớp học bạn muốn đổi đã tồn tại.";
                }           
            } catch (error) {
                console.log(error);
            }
        },
        async deleteClassroom() {
            if (confirm("Bạn muốn xóa Lớp học này?")) {
                try {
                    await ClassroomService.delete(this.classroom._id);
                    this.$router.push({ name: "classroom" });
                } catch (error) {
                    console.log(error);
                }
            }
        },
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
    },
    created() {
        this.getClassroom(this.id);
        this.message = "";
    },
    mounted() {
            this.refreshList();
        },
};
</script>
<!-- <template>
    <div class="page">
        <h4>Hiệu chỉnh Lớp học</h4>
        <TeacherForm
            :teacher="teacher"
            @submit:teacher="updateTeacher"
            @delete:teacher="deleteTeacher"
        />
        <p>{{ message }}</p>
    </div>
</template>
<script>
import TeacherForm from "@/components/TeacherForm.vue";
import TeacherService from "@/services/teacher.service";
export default {
    components: {
        TeacherForm,
    },
    props: {
        id: { type: String, required: true },
    },
    data() {
        return {
            teacher: null,
            message: "",
        };
    },
    methods: {
        async getTeacher(id) {
            try {
                this.teacher = await TeacherService.get(id);
            } catch (error) {
                console.log(error);
                // Chuyển sang trang NotFound đồng thời giữ cho URL không đổi
                this.$router.push({
                    name: "notfound",
                    params: {
                        pathMatch: this.$route.path.split("/").slice(1)
                    },
                    query: this.$route.query,
                    hash: this.$route.hash,
                });
            }
        },
        async updateTeacher(data) {
            try {
                var x = await TeacherService.update(this.teacher._id, data)
                if(x.message==1){
                    this.message = "Lớp học được cập nhật thành công.";
                }else{
                    this.message = "Tên lớp học bạn muốn đổi đã tồn tại.";
                }
            } catch (error) {
                console.log(error);
            }
        },
        async deleteTeacher() {
            if (confirm("Bạn muốn xóa Lớp học này?")) {
                try {
                    await TeacherService.delete(this.teacher._id);
                    this.$router.push({ name: "teacher" });
                } catch (error) {
                    console.log(error);
                }
            }
        },
    },
    created() {
        this.getTeacher(this.id);
        this.message = "";
    },
};
</script> -->