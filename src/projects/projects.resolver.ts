import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ProjectsService } from './projects.service';
import { Project } from './project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';

/**
 * @class ProjectsResolver
 * @description GraphQL resolver for project-related queries and mutations.
 * Delegates all business logic to ProjectsService following the resolver pattern.
 */
@Resolver(() => Project)
export class ProjectsResolver {
  /**
   * @constructor
   * @param {ProjectsService} projectsService - Injected service for project operations
   */
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * Query to retrieve all projects in the system.
   *
   * @returns {Project[]} List of all projects
   */
  @Query(() => [Project], { name: 'projects' })
  findAll(): Project[] {
    return this.projectsService.findAll();
  }

  /**
   * Query to find a specific project by its unique identifier.
   *
   * @param {string} id - The UUID of the project to retrieve
   * @returns {Project} The found project
   */
  @Query(() => Project, { name: 'project' })
  findOne(@Args('id', { type: () => ID }) id: string): Project {
    return this.projectsService.findOne(id);
  }

  /**
   * Mutation to create a new project in the system.
   *
   * @param {CreateProjectInput} createProjectInput - The input data for the new project
   * @returns {Project} The newly created project
   */
  @Mutation(() => Project)
  createProject(
    @Args('createProjectInput') createProjectInput: CreateProjectInput,
  ): Project {
    return this.projectsService.create(createProjectInput);
  }

  /**
   * Mutation to update an existing project's information.
   *
   * @param {UpdateProjectInput} updateProjectInput - The input data with updated fields
   * @returns {Project} The updated project
   */
  @Mutation(() => Project)
  updateProject(
    @Args('updateProjectInput') updateProjectInput: UpdateProjectInput,
  ): Project {
    return this.projectsService.update(updateProjectInput);
  }

  /**
   * Mutation to delete a project from the system.
   *
   * @param {string} id - The UUID of the project to remove
   * @returns {boolean} True if deletion was successful
   */
  @Mutation(() => Boolean)
  removeProject(@Args('id', { type: () => ID }) id: string): boolean {
    return this.projectsService.remove(id);
  }
}
