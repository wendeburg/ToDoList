import Project from './Project.js';
import Task from './Task.js';
import app from './App';
import { isToday, startOfToday, compareAsc, addDays, parseISO} from 'date-fns';

export default class ToDo {
    #projects;
    #tasks;

    constructor() {
        this.#projects = [];
        this.#tasks = [];
    }

    static withJSONData(jsonData) {
        let todo = new ToDo();

        todo.#setProjects(jsonData.projects.map(project => Object.assign(new Project(), project)));
        todo.#setTasks(jsonData.tasks.map(task => Object.assign(new Task(), task)));

        return todo;
    }

    #setProjects(projects) {
        this.#projects = projects;
    }

    #setTasks(tasks) {
        this.#tasks = tasks;
    }

    addNewProject(project) {
        this.#projects.push(project);
    }

    addNewTask(task) {
        this.#tasks.push(task);
    }

    #getTaskIndex(taskId) {
        let index = -1;

        for (let i = 0; i < this.#tasks.length; i++) {
            if (taskId == this.#tasks[i].getId()) {
                index = i;
            }
        }
        
        return index;
    }

    changeTaskStatus(taskId) {
        let index = this.#getTaskIndex(taskId);

        if (index != -1) {
            this.#tasks[index].toggleTaskStatus(taskId);
        }
    }

    deleteTask(taskId) {
        let taskIndex = this.#getTaskIndex(taskId)
        
        if (taskIndex != -1) {
            this.#tasks.splice(this.#getTaskIndex(taskId), 1);
        }
    }

    updateTaskInfo(taskId, name, desc, dueDate, priority, project) {
        let taskIndex = this.#getTaskIndex(taskId)
        
        if (taskIndex != -1) {
            this.#tasks[taskIndex].setProperties(name, desc, dueDate, priority, project);
        }
    }

    getTasks() {
        return this.#tasks;
    }

    getProjects() {
        return this.#projects;
    }

    #getProjectIndex(projectId) {
        let index = -1;

        for (let i = 0; i < this.#projects.length; i++) {
            if (this.#projects[i].getId() === projectId) {
                index = i;
                break;
            }
        }

        return index;
    }

    getProjectNames() {
        return this.#projects.map(project => project.getName());
    }

    getProjectByName(projName) {
        for (let i = 0; i < this.#projects.length; i++) {
            if (this.#projects[i].getName() === projName) {
                return this.#projects[i];
            }
        }

        return null;
    }

    getProjectById(projId) {
        for (let i = 0; i < this.#projects.length; i++) {
            if (this.#projects[i].getId() === projId) {
                return this.#projects[i];
            }
        }

        return null;
    }

    getTasksByProject(projectName) {
        let projectId = this.getProjectByName(projectName).getId();

        let tasks = [];

        for (let i = 0; i < this.#tasks.length; i++) {
            if (this.#tasks[i].getProject() == projectId) {
                tasks.push(this.#tasks[i]);
            }
        }

        return tasks;
    }

    getDueTodayTasks() {
        let tasks = [];

        for (let i = 0; i < this.#tasks.length; i++) {
            if (this.#tasks[i].getDueDate() === '') {
                continue;
            }

            if (isToday(parseISO(this.#tasks[i].getDueDate()))) {
                tasks.push(this.#tasks[i]);
            }
        }

        return tasks;
    }

    getDueThisWeekTasks = () => {
        let tasks = [];
        let nextWeek = addDays(startOfToday(), 7);

        for (let i = 0; i < this.#tasks.length; i++) {
            if (this.#tasks[i].getDueDate() === '') {
                continue;
            }

            if (compareAsc(parseISO(this.#tasks[i].getDueDate()), nextWeek) != 1) {
                tasks.push(this.#tasks[i]);
            }
        }

        return tasks;
    }

    getTask(taskId) {
        return this.#tasks[this.#getTaskIndex(taskId)];
    }

    toJSONObject() {
        return {
            projects: this.#projects,
            tasks: this.#tasks
        }
    }
}