<template>
    <div class="page">
        <h4>Hiệu chỉnh Học sinh</h4>
        <StudentForm
            :student="student"
            @submit:student="updateStudent"
            @delete:student="deleteStudent"
            :classrooms="filteredClassrooms"

        />
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
    props: {
        id: { type: String, required: true },
    },
    data() {
        return {

            student: null,
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
        
        async getStudent(id) {
            try {
                this.student = await StudentService.get(id);
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
        
        async updateStudent(data) {
            try {
                await StudentService.update(this.student._id, data);
                this.message = "Học sinh được cập nhật thành công.";
            } catch (error) {
                console.log(error);
            }
        },
        async deleteStudent() {
            if (confirm("Bạn muốn xóa Học sinh này?")) {
                try {
                    await StudentService.delete(this.student._id);
                    this.$router.push({ name: "student" });
                } catch (error) {
                    console.log(error);
                }
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
    created() {
        this.getStudent(this.id);
        this.message = "";
    },
    mounted() {
            this.refreshList();
        },
};
</script>