import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Task } from './task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { TaskStatus } from './enums/task-status.enum';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { LogAction } from '../common/decorators/log-action.decorator';

/**
 * @class TasksService
 * @description Service responsible for all business logic related to tasks.
 * Coordinates with UsersService and ProjectsService to resolve relationships.
 * Uses an in-memory store for data persistence during the server session.
 * The @LogAction decorator applies AOP logging as a cross-cutting concern.
 */
@Injectable()
export class TasksService {
  /** @private In-memory storage for tasks */
  private readonly tasks: Task[] = [];

  /**
   * @constructor
   * @param {UsersService} usersService - Service for resolving user references
   * @param {ProjectsService} projectsService - Service for resolving project references
   */
  constructor(
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
  ) {}

  /**
   * Retrieves all tasks in the system.
   *
   * @returns {Task[]} Array of all tasks with resolved user and project references
   */
  @LogAction('TasksService')
  findAll(): Task[] {
    return this.tasks;
  }

  /**
   * Finds a single task by its unique identifier.
   *
   * @param {string} id - The UUID of the task to find
   * @returns {Task} The found task with resolved relationships
   * @throws {NotFoundException} When no task exists with the given id
   */
  @LogAction('TasksService')
  findOne(id: string): Task {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }
    return task;
  }

  /**
   * Retrieves all tasks that belong to a specific project.
   *
   * @param {string} projectId - The UUID of the project
   * @returns {Task[]} Array of tasks belonging to the project
   */
  @LogAction('TasksService')
  findByProject(projectId: string): Task[] {
    return this.tasks.filter((t) => t.project.id === projectId);
  }

  /**
   * Retrieves all tasks assigned to a specific user.
   *
   * @param {string} userId - The UUID of the user
   * @returns {Task[]} Array of tasks assigned to the user
   */
  @LogAction('TasksService')
  findByUser(userId: string): Task[] {
    return this.tasks.filter((t) => t.assignedUser.id === userId);
  }

  /**
   * Creates a new task in the system.
   * Resolves the user and project references from their respective services.
   *
   * @param {CreateTaskInput} input - The data required to create the task
   * @returns {Task} The newly created task with resolved relationships
   * @throws {NotFoundException} When the specified user or project does not exist
   */
  @LogAction('TasksService')
  create(input: CreateTaskInput): Task {
    const assignedUser = this.usersService.findOne(input.assignedUserId);
    const project = this.projectsService.findOne(input.projectId);

    const newTask: Task = {
      id: uuidv4(),
      title: input.title,
      description: input.description,
      status: input.status ?? TaskStatus.BACKLOG,
      tags: input.tags ?? [],
      createdAt: new Date().toISOString(),
      assignedUser,
      project,
    };

    this.tasks.push(newTask);
    return newTask;
  }

  /**
   * Updates an existing task's fields.
   * Supports partial updates: any combination of fields can be changed.
   *
   * @param {UpdateTaskInput} input - The fields to update on the task
   * @returns {Task} The updated task object
   * @throws {NotFoundException} When the task, user, or project cannot be found
   */
  @LogAction('TasksService')
  update(input: UpdateTaskInput): Task {
    const task = this.findOne(input.id);

    if (input.title !== undefined) task.title = input.title;
    if (input.description !== undefined) task.description = input.description;
    if (input.status !== undefined) task.status = input.status;
    if (input.tags !== undefined) task.tags = input.tags;

    if (input.assignedUserId !== undefined) {
      task.assignedUser = this.usersService.findOne(input.assignedUserId);
    }

    if (input.projectId !== undefined) {
      task.project = this.projectsService.findOne(input.projectId);
    }

    return task;
  }

  /**
   * Removes a task from the system by its id.
   *
   * @param {string} id - The UUID of the task to delete
   * @returns {boolean} True if the task was successfully removed
   * @throws {NotFoundException} When no task exists with the given id
   */
  @LogAction('TasksService')
  remove(id: string): boolean {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }
    this.tasks.splice(index, 1);
    return true;
  }
}
