<template>
    <div class="page">
        <h4>Hiệu chỉnh Giáo viên</h4>
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
                    this.message = "Giáo viên được cập nhật thành công.";
                }else{
                    this.message = "Tên giáo viên bạn muốn đổi đã tồn tại.";
                }
            } catch (error) {
                console.log(error);
            }
        },
        async deleteTeacher() {
            if (confirm("Bạn muốn xóa Giáo viên này?")) {
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
</script>