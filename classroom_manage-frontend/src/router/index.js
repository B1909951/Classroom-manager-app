import { createWebHistory, createRouter, createWebHashHistory } from "vue-router";
import Classroom from "@/views/Classroom.vue";
import Student from "@/views/Student.vue";
import Teacher from "@/views/Teacher.vue";

const routes = [
    {
        path: "/",
        name: "classroom",
        component: Classroom,
    },
    { 
        path: "/:pathMatch(.*)*",
        name: "notfound",
        component: () => import("@/views/NotFound.vue"),
    },
    {
        path: "/classrooms/:id",
        name: "classroom.edit",
        component: () => import("@/views/ClassroomEdit.vue"),
        props: true // Truyền các biến trong $route.params vào làm props
    },
    {
        path: "/classrooms",
        name: "classroom.add",
        component: () => import("@/views/ClassroomAdd.vue"),
        props: true // Truyền các biến trong $route.params vào làm props
    },
    {
        path: "/student",
        name: "student",
        component: Student,
    },
    {
        path: "/students/:id",
        name: "student.edit",
        component: () => import("@/views/StudentEdit.vue"),
        props: true // Truyền các biến trong $route.params vào làm props
    },
    
    {
        path: "/students",
        name: "student.add",
        component: () => import("@/views/StudentAdd.vue"),
        props: true // Truyền các biến trong $route.params vào làm props
    },
     {
        path: "/teacher",
        name: "teacher",
        component: Teacher,
    },
    {
        path: "/teachers/:id",
        name: "teacher.edit",
        component: () => import("@/views/TeacherEdit.vue"),
        props: true // Truyền các biến trong $route.params vào làm props
    },
    
    {
        path: "/teachers",
        name: "teacher.add",
        component: () => import("@/views/TeacherAdd.vue"),
        props: true // Truyền các biến trong $route.params vào làm props
    },
    
];
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    linkActiveClass: 'active-link',
    linkExactActiveClass: 'text-dark',
});
export default router;