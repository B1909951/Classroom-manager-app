<template>
    <div class="page">
        <h4>Thêm học sinh</h4>
        <StudentForm
            :student="student"
            @submit:student="addStudent"
            v-if="filteredClassroomsCount > 0"
                :classrooms="filteredClassrooms"
                v-model:activeIndex="activeIndex"  
        /> 
            <p v-else>Không có lớp học nào.</p>

        <p>{{ message }}</p>
    </div>
    
    
</template>
<script>
import StudentForm from "@/components/StudentForm.vue";
import StudentService from "@/services/student.service";
import ClassroomService from "@/services/classroom.service";

export default {
    components: {
        StudentForm,
    },
    data() {
        return {
            student: {},
            message: "",
            classrooms: [],
        };
    },
    computed: {
            // Chuyển các đối tượng classroom thành chuỗi để tiện cho tìm kiếm.
            classroomStrings() {
                return this.classrooms.map((classroom) => {
                    const { name, teacher, phone } = classroom;
                    return [name, teacher, phone].join("");
                });
            },
                // Trả về các classroom có chứa thông tin cần tìm kiếm.
            filteredClassrooms() {
                if (!this.searchText) return this.classrooms;
                return this.classrooms.filter((_classroom, index) =>
                    this.classroomStrings[index].includes(this.searchText)
                );
            },
            activeClassroom() {
                if (this.activeIndex < 0) return null;
                return this.filteredClassrooms[this.activeIndex];
            },
            filteredClassroomsCount() {
                return this.filteredClassrooms.length;
            },
        },
    methods: {
        
        async addStudent(data) {
            try {
                await StudentService.create(data);
                this.message = "Thêm học sinh thành công.";
                console.log('Xin chào');
            } catch (error) {
                console.log('Xin chào',error);
            }
        },
        async retrieveClassrooms() {
                try {
                    this.classrooms = await ClassroomService.getAll();
                } catch (error) {
                    console.log(error);
                }
        },
        refreshList() {
                this.retrieveClassrooms();
                this.activeIndex = -1;
        },
        
    },
    mounted() {
            this.refreshList();
        },
};

</script>