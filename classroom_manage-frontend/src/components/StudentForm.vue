
<template>
    <Form
        @submit="submitStudent"
        :validation-schema="studentFormSchema"
        enctype="multipart/form-data"
    >
        <div class="form-group">
            <label for="name">Họ và Tên</label>
            <Field
                name="name"
                type="text"
                class="form-control"
                v-model="studentLocal.name"
            />
            <ErrorMessage name="name" class="error-feedback" />
        </div>
        
        <div class="form-group">
            <label for="sex">Giới tính</label>
            <select class="form-control" id="sex" name="sex" v-model="studentLocal.sex">
                <option value="Nam">Nam</option>
                <option valuek="Nữ">Nữ</option>
            </select>
            <ErrorMessage name="sex" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="birthday">Ngày sinh</label>
            <Field
                name="birthday"
                type="date"
                class="form-control"
                min="2005-01-01" max="2010-12-31"
                v-model="studentLocal.birthday"
            />
            <ErrorMessage name="birthday" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="pphone">SDT phụ huynh</label>
            <Field
                name="pphone"
                type="tel"
                class="form-control"
                v-model="studentLocal.pphone"
            />
            <ErrorMessage name="pphone" class="error-feedback" />
        </div>
        <div class="form-group">
            <label for="class_name">Lớp</label>
            <select class="form-control" id="class_name" name="class_name" v-model="studentLocal.class_name">
                <option v-for="classroom in classrooms" :value="classroom.name">
                    {{classroom.name}}({{ classroom.current }}/{{ classroom.max }})
                </option>
            </select>
            <ErrorMessage name="class_name" class="error-feedback" />
        </div>
        
        <div class="form-group" >
            <label   for="avatar">Ảnh đại diện</label>
           
            <Field
                name="avatar"
                type="text"
                class="form-control"
                :value="studentLocal.avatar" 
                @change="studentLocal.avatar = $event.target.value"
            />
            <ErrorMessage name="avatar" class="error-feedback" />
        </div>
        <div class="form-group">
            <div class="file-upload">
            <input type="file" name="avatar" accept="image/*" @change="onFileChange" />
            <img v-if="!path" v-bind:src="'http://localhost:3000/images/' + studentLocal.avatar" src="" alt="">
            <img id="output" src="" >
            
        </div>
        </div>
        <div class="form-group">
            <button class="btn btn-primary ">Lưu</button>
            <button
                v-if="studentLocal._id"
                type="button"
                class="ml-2 btn btn-danger"
                @click="deleteStudent"
            >
                Xóa
            </button>
            <router-link
                            :to="{
                                name: 'student',
                                
                            }"
                        >
            <button class="btn btn-success ml-2">Quay lại</button>
            </router-link>

        </div>
        
    </Form>
</template>
<script>
//load ảnh 
import axios from "axios";

import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    emits: ["submit:student", "delete:student"],
    props: {
        student: { type: Object, required: true },
        classrooms: { type: Array, default: [] },
        activeIndex: { type: Number, default: -1 },

    },
    data() {
        const studentFormSchema = yup.object().shape({
            name: yup
                .string()
                .required("Họ tên phải có giá trị.")
                .min(2, "Họ tên phải ít nhất 2 ký tự.")
                .max(50, "Họ tên có nhiều nhất 50 ký tự."),
              
            
            birthday: yup
                .string(),
            pphone: yup
                .string()
                .matches(
                    /((09|03|07|08|05)+([0-9]{8})\b)/g,
                    "Số điện thoại không hợp lệ."
                ),
                
        });
        
        return {
            // Chúng ta sẽ không muốn hiệu chỉnh props, nên tạo biến cục bộ
            // studentLocal để liên kết với các input trên form
            studentLocal: this.student,
            studentFormSchema,
            selectedFile: "",
            progress: 0,
            path:""
        };
        
    },
    
    methods: {
        
        onFileChange(e) {
            var output = document.getElementById('output');
            output.src = URL.createObjectURL(e.target.files[0]);
            output.onload = function() {
            URL.revokeObjectURL(output.src) // free memory
            }
            const selectedFile = e.target.files[0]; // accessing file
            this.selectedFile = selectedFile;
            this.progress = 0;
            let path = this.selectedFile.name;
            this.path = path;
            console.log('Tìm class');
        },
        
        async submitStudent() {
            const formData = new FormData();
            formData.append("file", this.selectedFile);  // appending file

     // sending file to the backend
            await axios
            .post("http://localhost:3000/api/upload", formData, {
            onUploadProgress: ProgressEvent => {
                let progress =
                  Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100)
                  +"%";
                this.progress = progress;
            }
            })
            .then(res => {
                console.log(res);
                console.log('xinchao',res.data.name);
            })
            .catch(err => {
                console.log(err);
            });
            await this.$emit("submit:student", this.studentLocal);
        },
        
        deleteStudent() {
            this.$emit("delete:student", this.studentLocal.id);
        },
    },
};



</script>
<style scoped>
@import "@/assets/form.css";
img{
    width: 200px;
}
</style>