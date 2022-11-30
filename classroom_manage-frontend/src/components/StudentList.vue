<script>
    export default {
        props: {
            students: { type: Array, default: [] },
            activeIndex: { type: Number, default: -1 },
        },
        emits: ["update:activeIndex"],
        methods: {
            updateActiveIndex(index) {
                this.$emit("update:activeIndex", index);
            }
        }
    };
</script>
<template>
    <ul class="list-group">
        <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col"><b>Học sinh</b></th>
                        <th scope="col"><b>Ảnh</b></th>

                        <th scope="col"><b>Giới tính</b></th>
                        <th scope="col"><b>Ngày sinh</b></th>

                        <th scope="col"><b>SDT phụ huynh</b></th>
                        <th scope="col"><b>Tên lớp</b></th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr class=""
            v-for="(student, index) in students"
            :key="student._id"
            :class="{ active: index === activeIndex }"
            @click="updateActiveIndex(index)">
                        <th scope="row">{{ student.name }}</th>                    
                        <!-- <td><img src="smiley.gif"  height="100" width="100"></td> -->
                       <td><img v-bind:src="'http://localhost:3000/images/'+student.avatar" height="100" width="75"> 
                       </td>
                        <td>{{ student.sex }}</td>
                        <td>{{ student.birthday }}</td>
                        <td>{{ student.pphone }}</td>
                        <td>{{ student.class_name }}</td>

                        <td>
                        <router-link
                            :to="{
                                name: 'student.edit',
                                params: { id: student._id },
                            }"
                        >
                            <span class="mt-2 button button-warning">
                                <i class="fas fa-edit"></i> Hiệu chỉnh
                            </span>
                        </router-link>
                        </td>
                        
                    </tr>
                </tbody>
            </table>
        
    </ul>
</template>