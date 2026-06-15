import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';

/**
 * @class TasksResolver
 * @description GraphQL resolver for task-related queries and mutations.
 * Provides full CRUD operations and additional filtered queries.
 * Delegates all business logic to TasksService following the resolver pattern.
 */
@Resolver(() => Task)
export class TasksResolver {
  /**
   * @constructor
   * @param {TasksService} tasksService - Injected service for task operations
   */
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Query to retrieve all tasks in the system.
   *
   * @returns {Task[]} List of all tasks with their resolved relationships
   */
  @Query(() => [Task], { name: 'tasks' })
  findAll(): Task[] {
    return this.tasksService.findAll();
  }

  /**
   * Query to find a specific task by its unique identifier.
   *
   * @param {string} id - The UUID of the task to retrieve
   * @returns {Task} The found task with resolved relationships
   */
  @Query(() => Task, { name: 'task' })
  findOne(@Args('id', { type: () => ID }) id: string): Task {
    return this.tasksService.findOne(id);
  }

  /**
   * Query to retrieve all tasks belonging to a specific project.
   *
   * @param {string} projectId - The UUID of the project to filter by
   * @returns {Task[]} List of tasks in the given project
   */
  @Query(() => [Task], { name: 'tasksByProject' })
  findByProject(
    @Args('projectId', { type: () => ID }) projectId: string,
  ): Task[] {
    return this.tasksService.findByProject(projectId);
  }

  /**
   * Query to retrieve all tasks assigned to a specific user.
   *
   * @param {string} userId - The UUID of the user to filter by
   * @returns {Task[]} List of tasks assigned to the given user
   */
  @Query(() => [Task], { name: 'tasksByUser' })
  findByUser(@Args('userId', { type: () => ID }) userId: string): Task[] {
    return this.tasksService.findByUser(userId);
  }

  /**
   * Mutation to create a new task in the system.
   *
   * @param {CreateTaskInput} createTaskInput - The input data for the new task
   * @returns {Task} The newly created task with resolved relationships
   */
  @Mutation(() => Task)
  createTask(
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
  ): Task {
    return this.tasksService.create(createTaskInput);
  }

  /**
   * Mutation to update an existing task.
   * Supports partial updates: status, tags, assigned user and other fields
   * can all be changed independently.
   *
   * @param {UpdateTaskInput} updateTaskInput - The input data with updated fields
   * @returns {Task} The updated task
   */
  @Mutation(() => Task)
  updateTask(
    @Args('updateTaskInput') updateTaskInput: UpdateTaskInput,
  ): Task {
    return this.tasksService.update(updateTaskInput);
  }

  /**
   * Mutation to delete a task from the system.
   *
   * @param {string} id - The UUID of the task to remove
   * @returns {boolean} True if deletion was successful
   */
  @Mutation(() => Boolean)
  removeTask(@Args('id', { type: () => ID }) id: string): boolean {
    return this.tasksService.remove(id);
  }
}
