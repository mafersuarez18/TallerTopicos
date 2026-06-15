import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

/**
 * @class UsersResolver
 *
 * Resolver de GraphQL para todo lo relacionado con usuarios.
 * Los resolvers son como los controllers de REST: reciben las peticiones
 * de GraphQL y las delegan al servicio correspondiente.
 *
 * No ponemos lógica de negocio aquí, solo delegamos al UsersService.
 */
@Resolver(() => User)
export class UsersResolver {
  /**
   * @constructor
   * @param {UsersService} usersService - Servicio inyectado con la lógica de usuarios
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Query para obtener todos los usuarios del sistema.
   *
   * @returns {User[]} Lista completa de usuarios
   */
  @Query(() => [User], { name: 'users' })
  findAll(): User[] {
    return this.usersService.findAll();
  }

  /**
   * Query para obtener un usuario específico por su ID.
   *
   * @param {string} id - UUID del usuario
   * @returns {User} El usuario encontrado
   */
  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => ID }) id: string): User {
    return this.usersService.findOne(id);
  }

  /**
   * Mutation para crear un nuevo usuario.
   *
   * @param {CreateUserInput} createUserInput - Datos del usuario a crear
   * @returns {User} El usuario creado con su ID y fecha de creación
   */
  @Mutation(() => User)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): User {
    return this.usersService.create(createUserInput);
  }

  /**
   * Mutation para editar un usuario existente.
   * Solo se actualizan los campos que se envíen.
   *
   * @param {UpdateUserInput} updateUserInput - Campos a modificar
   * @returns {User} El usuario con los datos actualizados
   */
  @Mutation(() => User)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): User {
    return this.usersService.update(updateUserInput);
  }

  /**
   * Mutation para eliminar un usuario del sistema.
   *
   * @param {string} id - UUID del usuario a eliminar
   * @returns {boolean} true si se eliminó, lanza error si no existe
   */
  @Mutation(() => Boolean)
  removeUser(@Args('id', { type: () => ID }) id: string): boolean {
    return this.usersService.remove(id);
  }
}
