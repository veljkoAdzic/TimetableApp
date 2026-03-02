/*
    Constants for enviormental and internal settings.
*/

export const DEVELOPER_MODE = false;

export const API_MAP = {
    classList: {
        path:'/classes?',
        paramaters: ["year", "name"]
    },
    lessons: {
        path:'/timetable?',
        paramaters: ['id', 'name']
    },
    teachers: {
        path: '/teachers?',
        paramaters: ['name']
    }
}