import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Project } from './project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { LogAction } from '../common/decorators/log-action.decorator';

/**
 * @class ProjectsService
 *
 * Contiene toda la lógica de negocio relacionada con proyectos.
 * Guarda los proyectos en memoria (se pierden al reiniciar el servidor).
 *
 * Cada método tiene el decorador @LogAction que, siguiendo el principio de AOP,
 * agrega logging automático sin mezclar esa responsabilidad con la lógica del servicio.
 */
@Injectable()
export class ProjectsService {
  // Lista de proyectos en memoria
  private readonly projects: Project[] = [];

  /**
   * Retorna todos los proyectos registrados en el sistema.
   *
   * @returns {Project[]} Lista de proyectos
   */
  @LogAction('ProjectsService')
  findAll(): Project[] {
    return this.projects;
  }

  /**
   * Busca un proyecto por su ID.
   *
   * @param {string} id - UUID del proyecto
   * @returns {Project} El proyecto encontrado
   * @throws {NotFoundException} Si no existe un proyecto con ese ID
   */
  @LogAction('ProjectsService')
  findOne(id: string): Project {
    const project = this.projects.find((p) => p.id === id);

    if (!project) {
      throw new NotFoundException(`Proyecto con id "${id}" no encontrado`);
    }

    return project;
  }

  /**
   * Crea un proyecto nuevo con ID generado automáticamente.
   *
   * @param {CreateProjectInput} input - Datos del proyecto
   * @returns {Project} El proyecto creado
   */
  @LogAction('ProjectsService')
  create(input: CreateProjectInput): Project {
    const newProject: Project = {
      id: uuidv4(),
      name: input.name,
      description: input.description,
      createdAt: new Date().toISOString(),
    };

    this.projects.push(newProject);
    return newProject;
  }

  /**
   * Actualiza un proyecto existente.
   * Solo modifica los campos que se envíen en el input.
   *
   * @param {UpdateProjectInput} input - Campos a actualizar
   * @returns {Project} El proyecto con los datos actualizados
   * @throws {NotFoundException} Si el proyecto no existe
   */
  @LogAction('ProjectsService')
  update(input: UpdateProjectInput): Project {
    const project = this.findOne(input.id);

    // Actualizamos solo los campos que llegaron
    if (input.name !== undefined) project.name = input.name;
    if (input.description !== undefined) project.description = input.description;

    return project;
  }

  /**
   * Elimina un proyecto del sistema por su ID.
   *
   * @param {string} id - UUID del proyecto a eliminar
   * @returns {boolean} true si se eliminó correctamente
   * @throws {NotFoundException} Si el proyecto no existe
   */
  @LogAction('ProjectsService')
  remove(id: string): boolean {
    const index = this.projects.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new NotFoundException(`Proyecto con id "${id}" no encontrado`);
    }

    this.projects.splice(index, 1);
    return true;
  }
}
