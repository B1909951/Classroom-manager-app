<template>
    <Form
        @submit="submitClassroom"
        :validation-schema="classroomFormSchema"
    >
        <div class="form-group">
            <label for="name">Mã lớp</label>
            <Field
                name="name"
                type="text"
                class="form-control"
                v-model="classroomLocal.name"
            />
            <ErrorMessage name="name" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="max">Sỉ số tối đa</label>
            <Field
                name="max"
                type="number"
                class="form-control"
                v-model="classroomLocal.max"
            />
            <ErrorMessage name="max" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="teacher">Giáo viên chủ nhiệm</label>
            <select class="form-control" id="teacher" name="teacher" v-model = "classroomLocal.teacher">
                <option v-for="teacher in teachers" :value="teacher.name">
                    {{ teacher.name}}
                </option>
            </select>
            <ErrorMessage name="teacher" class="error-feedback" />
        </div>
        <div class="form-group">
            <button class="btn btn-primary">Lưu</button>
            <button
                v-if="classroomLocal._id"
                type="button"
                class="ml-2 btn btn-danger"
                @click="deleteClassroom"
            >
                Xóa
            </button>
            <router-link
                            :to="{
                                name: 'classroom',
                                
                            }"
                        >
            <button class="btn btn-success ml-2">Quay lại</button>
            </router-link>

        </div>

    </Form>
</template>
<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    emits: ["submit:classroom", "delete:classroom"],
    props: {
        classroom: { type: Object, required: true },
        teachers: { type: Array, default: [] },
        activeIndex: { type: Number, default: -1 },
    },
    data() {
        const classroomFormSchema = yup.object().shape({
            name: yup
                .string()
                .required("Mã lớp phải có giá trị.")
                .min(2, "Mã lớp phải ít nhất 2 ký tự.")
                .max(50, "Mã lớp có nhiều nhất 50 ký tự."),
            
            max: yup
                .number()
                .required("Chọn sỉ số")
                .min(1, "Sỉ số tối thiểu là 1.")
                .max(120, "Sỉ số tối đa là 120."),
            
        });
        return {
            // Chúng ta sẽ không muốn hiệu chỉnh props, nên tạo biến cục bộ
            // classroomLocal để liên kết với các input trên form
            classroomLocal: this.classroom,
            classroomFormSchema,
        };
    },
    methods: {
        submitClassroom() {
            this.$emit("submit:classroom", this.classroomLocal);
        },
        deleteClassroom() {
            this.$emit("delete:classroom", this.classroomLocal.id);
        },
    },
};
</script>
<style scoped>
@import "@/assets/form.css";
</style>