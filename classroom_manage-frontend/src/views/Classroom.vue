<template>
     
    <div class="page row">
        <div class="col-md-6">
            
            <div class=" row justify-content-around align-items-center">
                <button class="btn btn-sm btn-primary" @click="refreshList()">
                    Làm mới
                </button>
                <router-link
                    :to="{
                         name: 'classroom.add',
                         params: {},
                    }"
                >
                    <button class="btn btn-sm btn-success" @click="goToAddClassroom">
                        Thêm mới
                    </button>
                </router-link>
                <button
                    class="btn btn-sm btn-danger"
                    @click="removeAllClassrooms"
                >
                     Xóa tất cả
                </button>
            </div>
        </div>
        <div class="col-md-6">
            <InputSearch v-model="searchText" />
        </div>
        <div class="col-md-12 mt-5">
            <ClassroomList
                v-if="filteredClassroomsCount > 0"
                :classrooms="filteredClassrooms"
                v-model:activeIndex="activeIndex"
            />
            <p v-else>Không có lớp học nào.</p>
            

        </div>
        
    </div>
</template>
<script>
    import InputSearch from "@/components/InputSearch.vue";
    import ClassroomList from "@/components/ClassroomList.vue";
    import ClassroomService from "@/services/classroom.service";
    export default {
        components: {
            InputSearch,
            ClassroomList,
        },
        // Đoạn mã xử lý đầy đủ sẽ trình bày bên dưới

        data() {
            return {
                classrooms: [],
                activeIndex: -1,
                searchText: "",
            };
        },
        watch: {
        // Giám sát các thay đổi của biến searchText.
        // Bỏ chọn phần tử đang được chọn trong danh sách.
            searchText() {
                this.activeIndex = -1;
            },
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
            async removeAllClassrooms() {
                if (confirm("Bạn muốn xóa tất cả Lớp học?")) {
                    try {
                        await ClassroomService.deleteAll();
                        this.refreshList();
                    } catch (error) {
                        console.log(error);
                    }
                }
            },
            goToAddClassroom() {
                this.$router.push({ name: "classroom.add" });
            },
        },
        mounted() {
            this.refreshList();
        },
    };
</script>
<style scoped>
    .page {
        text-align: left;
        width: 100%;
    }
</style>