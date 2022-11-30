<script>
    export default {
        props: {
            classrooms: { type: Array, default: [] },
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
                        <th scope="col"><b>Mã lớp</b></th>
                        <th scope="col"><b>Giáo viên chủ nhiệm</b></th>
                        <th scope="col"><b>Điện thoại</b></th>
                        <th scope="col"><b>Sỉ số</b></th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr class=""
            v-for="(classroom, index) in classrooms"
            :key="classroom._id"
            :class="{ active: index === activeIndex }"
            @click="updateActiveIndex(index)">
                        <th scope="row">{{ classroom.name }}</th>
                      
                        <td>{{ classroom.teacher }}</td>
                        <td>{{ classroom.phone }}</td>
                        <td v-if="classroom.current > classroom.max" class="text-danger">{{ classroom.current }}/{{ classroom.max }}(Quá tải)</td>
                        <td v-else>{{ classroom.current }}/{{ classroom.max }}</td>

                        <td>
                        <router-link
                            :to="{
                                name: 'classroom.edit',
                                params: { id: classroom._id },
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