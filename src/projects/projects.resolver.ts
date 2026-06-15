import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ProjectsService } from './projects.service';
import { Project } from './project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';

/**
 * @class ProjectsResolver
 *
 * Resolver de GraphQL para las operaciones relacionadas con proyectos.
 * Recibe las queries y mutations del cliente y las pasa al ProjectsService.
 * Toda la lógica real vive en el servicio, aquí solo "enrutamos".
 */
@Resolver(() => Project)
export class ProjectsResolver {
  /**
   * @constructor
   * @param {ProjectsService} projectsService - Servicio con la lógica de proyectos
   */
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * Query que retorna todos los proyectos del sistema.
   *
   * @returns {Project[]} Lista de proyectos
   */
  @Query(() => [Project], { name: 'projects' })
  findAll(): Project[] {
    return this.projectsService.findAll();
  }

  /**
   * Query para obtener un proyecto específico por su ID.
   *
   * @param {string} id - UUID del proyecto
   * @returns {Project} El proyecto encontrado
   */
  @Query(() => Project, { name: 'project' })
  findOne(@Args('id', { type: () => ID }) id: string): Project {
    return this.projectsService.findOne(id);
  }

  /**
   * Mutation para crear un proyecto nuevo.
   *
   * @param {CreateProjectInput} createProjectInput - Datos del nuevo proyecto
   * @returns {Project} El proyecto recién creado
   */
  @Mutation(() => Project)
  createProject(
    @Args('createProjectInput') createProjectInput: CreateProjectInput,
  ): Project {
    return this.projectsService.create(createProjectInput);
  }

  /**
   * Mutation para editar un proyecto existente.
   *
   * @param {UpdateProjectInput} updateProjectInput - Datos a modificar
   * @returns {Project} El proyecto actualizado
   */
  @Mutation(() => Project)
  updateProject(
    @Args('updateProjectInput') updateProjectInput: UpdateProjectInput,
  ): Project {
    return this.projectsService.update(updateProjectInput);
  }

  /**
   * Mutation para eliminar un proyecto.
   *
   * @param {string} id - UUID del proyecto a eliminar
   * @returns {boolean} true si se eliminó correctamente
   */
  @Mutation(() => Boolean)
  removeProject(@Args('id', { type: () => ID }) id: string): boolean {
    return this.projectsService.remove(id);
  }
}
