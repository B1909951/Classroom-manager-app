<template>
    <div class="page">
        <h4>Thêm lớp học</h4>
        <ClassroomForm
            :classroom="classroom"
            @submit:classroom="addClassroom"
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
    data() {
        return {
            classroom: {},
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
        
        async addClassroom(data) {
            try {
                if(await ClassroomService.create(data)){
                    this.message = "Thêm lớp học thành công.";
                }else{
                    this.message = "Lớp học đã tồn tại.";
                }
            } catch (error) {
                console.log('Xin chào',error);
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
    mounted() {
            this.refreshList();
        },
};

</script>
