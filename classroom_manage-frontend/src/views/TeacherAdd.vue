<template>
    <div class="page">
        
        <h4>Thêm giáo viên</h4>
        <TeacherForm
            :teacher="teacher"
            @submit:teacher="addTeacher"
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
    data() {
        return {
            teacher: {},
            message: "",
        };
    },
    methods: {
        async addTeacher(data) {
            try {
                if(await TeacherService.create(data)){
                    this.message = "Thêm giáo viên thành công.";
                }else{
                    this.message = "Giáo viên đã tồn tại.";
                }
                
            } catch (error) {
                console.log(error);
            }
        },
        
    },
};
</script>