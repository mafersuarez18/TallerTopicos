import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Project } from './project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { LogAction } from '../common/decorators/log-action.decorator';

/**
 * @class ProjectsService
 * @description Service responsible for all business logic related to projects.
 * Uses an in-memory store for data persistence during the server session.
 * The @LogAction decorator applies AOP logging as a cross-cutting concern.
 */
@Injectable()
export class ProjectsService {
  /** @private In-memory storage for projects */
  private readonly projects: Project[] = [];

  /**
   * Retrieves all projects in the system.
   *
   * @returns {Project[]} Array of all registered projects
   */
  @LogAction('ProjectsService')
  findAll(): Project[] {
    return this.projects;
  }

  /**
   * Finds a single project by its unique identifier.
   *
   * @param {string} id - The UUID of the project to find
   * @returns {Project} The found project
   * @throws {NotFoundException} When no project exists with the given id
   */
  @LogAction('ProjectsService')
  findOne(id: string): Project {
    const project = this.projects.find((p) => p.id === id);
    if (!project) {
      throw new NotFoundException(`Project with id "${id}" not found`);
    }
    return project;
  }

  /**
   * Creates a new project in the system.
   *
   * @param {CreateProjectInput} input - The data required to create the project
   * @returns {Project} The newly created project with generated id and timestamps
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
   * Updates an existing project's information.
   *
   * @param {UpdateProjectInput} input - The updated fields for the project
   * @returns {Project} The updated project object
   * @throws {NotFoundException} When no project exists with the given id
   */
  @LogAction('ProjectsService')
  update(input: UpdateProjectInput): Project {
    const project = this.findOne(input.id);
    if (input.name !== undefined) project.name = input.name;
    if (input.description !== undefined) project.description = input.description;
    return project;
  }

  /**
   * Removes a project from the system by its id.
   *
   * @param {string} id - The UUID of the project to delete
   * @returns {boolean} True if the project was successfully removed
   * @throws {NotFoundException} When no project exists with the given id
   */
  @LogAction('ProjectsService')
  remove(id: string): boolean {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Project with id "${id}" not found`);
    }
    this.projects.splice(index, 1);
    return true;
  }
}
