<script>
    export default {
        props: {
            teachers: { type: Array, default: [] },
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
                        <th scope="col"><b>Giáo viên</b></th>
                        <th scope="col"><b>Ảnh</b></th>

                        <th scope="col"><b>Giới tính</b></th>
                        <th scope="col"><b>Ngày sinh</b></th>

                        <th scope="col"><b>SDT</b></th>
                        <th scope="col"><b>Địa chỉ</b></th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr class=""
            v-for="(teacher, index) in teachers"
            :key="teacher._id"
            :class="{ active: index === activeIndex }"
            @click="updateActiveIndex(index)">
                        <th scope="row">{{ teacher.name }}</th>                    
                        <!-- <td><img src="smiley.gif"  height="100" width="100"></td> -->
                       <td><img v-bind:src="'http://localhost:3000/images/' + teacher.avatar" height="100" width="75"> 
                       </td>
                        <td>{{ teacher.sex }}</td>
                        <td>{{ teacher.birthday }}</td>
                        <td>{{ teacher.phone }}</td>
                        <td>{{ teacher.address }}</td>

                        <td>
                        <router-link
                            :to="{
                                name: 'teacher.edit',
                                params: { id: teacher._id },
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