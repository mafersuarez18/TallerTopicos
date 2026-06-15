import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';

/**
 * @class TasksResolver
 *
 * Resolver de GraphQL para las operaciones de tareas.
 * Expone todas las queries y mutations relacionadas con tareas.
 * Incluye operaciones de CRUD básico más consultas filtradas
 * (por proyecto y por usuario) que son útiles para dashboards.
 *
 * Como siempre, la lógica real está en el TasksService.
 */
@Resolver(() => Task)
export class TasksResolver {
  /**
   * @constructor
   * @param {TasksService} tasksService - Servicio inyectado con la lógica de tareas
   */
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Query que retorna todas las tareas del sistema.
   *
   * @returns {Task[]} Lista de tareas con usuario y proyecto resueltos
   */
  @Query(() => [Task], { name: 'tasks' })
  findAll(): Task[] {
    return this.tasksService.findAll();
  }

  /**
   * Query para obtener una tarea específica por ID.
   *
   * @param {string} id - UUID de la tarea
   * @returns {Task} La tarea encontrada
   */
  @Query(() => Task, { name: 'task' })
  findOne(@Args('id', { type: () => ID }) id: string): Task {
    return this.tasksService.findOne(id);
  }

  /**
   * Query para obtener todas las tareas de un proyecto específico.
   * Útil para mostrar el tablero de tareas de un proyecto.
   *
   * @param {string} projectId - UUID del proyecto
   * @returns {Task[]} Tareas que pertenecen a ese proyecto
   */
  @Query(() => [Task], { name: 'tasksByProject' })
  findByProject(
    @Args('projectId', { type: () => ID }) projectId: string,
  ): Task[] {
    return this.tasksService.findByProject(projectId);
  }

  /**
   * Query para obtener todas las tareas asignadas a un usuario.
   * Útil para que cada desarrollador vea su lista de trabajo pendiente.
   *
   * @param {string} userId - UUID del usuario
   * @returns {Task[]} Tareas asignadas a ese usuario
   */
  @Query(() => [Task], { name: 'tasksByUser' })
  findByUser(@Args('userId', { type: () => ID }) userId: string): Task[] {
    return this.tasksService.findByUser(userId);
  }

  /**
   * Mutation para crear una tarea nueva.
   *
   * @param {CreateTaskInput} createTaskInput - Datos de la nueva tarea
   * @returns {Task} La tarea creada
   */
  @Mutation(() => Task)
  createTask(
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
  ): Task {
    return this.tasksService.create(createTaskInput);
  }

  /**
   * Mutation para actualizar una tarea existente.
   * Permite cambiar el estado, etiquetas, usuario asignado o cualquier otro campo.
   *
   * @param {UpdateTaskInput} updateTaskInput - Campos a modificar
   * @returns {Task} La tarea con los cambios aplicados
   */
  @Mutation(() => Task)
  updateTask(
    @Args('updateTaskInput') updateTaskInput: UpdateTaskInput,
  ): Task {
    return this.tasksService.update(updateTaskInput);
  }

  /**
   * Mutation para eliminar una tarea.
   *
   * @param {string} id - UUID de la tarea a eliminar
   * @returns {boolean} true si se eliminó, error si no existía
   */
  @Mutation(() => Boolean)
  removeTask(@Args('id', { type: () => ID }) id: string): boolean {
    return this.tasksService.remove(id);
  }
}
