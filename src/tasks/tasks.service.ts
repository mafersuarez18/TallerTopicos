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
 *
 * Servicio principal de la aplicación: maneja toda la lógica de negocio de las tareas.
 * Para crear o actualizar una tarea, necesita acceso a UsersService y ProjectsService
 * para verificar que el usuario y el proyecto existan antes de asignarlos.
 *
 * Como en los otros servicios, el decorador @LogAction aplica AOP:
 * agrega logs automáticamente a cada método sin contaminar la lógica de negocio.
 */
@Injectable()
export class TasksService {
  // Almacenamiento en memoria de las tareas
  private readonly tasks: Task[] = [];

  /**
   * @constructor
   * @param {UsersService} usersService - Para verificar/obtener usuarios al asignar tareas
   * @param {ProjectsService} projectsService - Para verificar/obtener proyectos al crear tareas
   */
  constructor(
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
  ) {}

  /**
   * Retorna todas las tareas del sistema.
   *
   * @returns {Task[]} Lista completa de tareas con usuario y proyecto ya resueltos
   */
  @LogAction('TasksService')
  findAll(): Task[] {
    return this.tasks;
  }

  /**
   * Busca una tarea por su ID.
   *
   * @param {string} id - UUID de la tarea
   * @returns {Task} La tarea encontrada
   * @throws {NotFoundException} Si no existe ninguna tarea con ese ID
   */
  @LogAction('TasksService')
  findOne(id: string): Task {
    const task = this.tasks.find((t) => t.id === id);

    if (!task) {
      throw new NotFoundException(`Tarea con id "${id}" no encontrada`);
    }

    return task;
  }

  /**
   * Filtra las tareas que pertenecen a un proyecto específico.
   *
   * @param {string} projectId - UUID del proyecto
   * @returns {Task[]} Tareas del proyecto indicado
   */
  @LogAction('TasksService')
  findByProject(projectId: string): Task[] {
    return this.tasks.filter((t) => t.project.id === projectId);
  }

  /**
   * Filtra las tareas asignadas a un usuario específico.
   *
   * @param {string} userId - UUID del usuario
   * @returns {Task[]} Tareas asignadas al usuario indicado
   */
  @LogAction('TasksService')
  findByUser(userId: string): Task[] {
    return this.tasks.filter((t) => t.assignedUser.id === userId);
  }

  /**
   * Crea una nueva tarea en el sistema.
   * Antes de crear, verifica que el usuario y el proyecto existan.
   * Si alguno no existe, los servicios correspondientes lanzarán NotFoundException.
   *
   * @param {CreateTaskInput} input - Datos de la nueva tarea
   * @returns {Task} La tarea creada con el usuario y proyecto resueltos
   * @throws {NotFoundException} Si el usuario o el proyecto no existen
   */
  @LogAction('TasksService')
  create(input: CreateTaskInput): Task {
    // Verificamos que existan el usuario y el proyecto antes de crear la tarea.
    // Si no existen, findOne lanza NotFoundException automáticamente.
    const assignedUser = this.usersService.findOne(input.assignedUserId);
    const project = this.projectsService.findOne(input.projectId);

    const newTask: Task = {
      id: uuidv4(),
      title: input.title,
      description: input.description,
      // Si no mandan status, la tarea empieza en BACKLOG por defecto
      status: input.status ?? TaskStatus.BACKLOG,
      // Si no mandan tags, arrancamos con arreglo vacío
      tags: input.tags ?? [],
      createdAt: new Date().toISOString(),
      assignedUser,  // guardamos el objeto completo del usuario
      project,       // guardamos el objeto completo del proyecto
    };

    this.tasks.push(newTask);
    return newTask;
  }

  /**
   * Actualiza los campos de una tarea existente.
   * Permite actualizaciones parciales: solo se modifican los campos enviados.
   * También permite reasignar el usuario o mover la tarea a otro proyecto.
   *
   * @param {UpdateTaskInput} input - Campos a actualizar
   * @returns {Task} La tarea con los cambios aplicados
   * @throws {NotFoundException} Si la tarea, el usuario o el proyecto no existen
   */
  @LogAction('TasksService')
  update(input: UpdateTaskInput): Task {
    const task = this.findOne(input.id);

    // Actualizamos solo los campos que llegaron en el input
    if (input.title !== undefined) task.title = input.title;
    if (input.description !== undefined) task.description = input.description;
    if (input.status !== undefined) task.status = input.status;
    if (input.tags !== undefined) task.tags = input.tags;

    // Si cambia el usuario asignado, lo buscamos para validar que exista
    if (input.assignedUserId !== undefined) {
      task.assignedUser = this.usersService.findOne(input.assignedUserId);
    }

    // Si cambia el proyecto, también lo validamos
    if (input.projectId !== undefined) {
      task.project = this.projectsService.findOne(input.projectId);
    }

    return task;
  }

  /**
   * Elimina una tarea por su ID.
   *
   * @param {string} id - UUID de la tarea a eliminar
   * @returns {boolean} true si se eliminó correctamente
   * @throws {NotFoundException} Si la tarea no existe
   */
  @LogAction('TasksService')
  remove(id: string): boolean {
    const index = this.tasks.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new NotFoundException(`Tarea con id "${id}" no encontrada`);
    }

    this.tasks.splice(index, 1);
    return true;
  }
}
