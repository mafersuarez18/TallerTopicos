import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

/**
 * @class UsersResolver
 * @description GraphQL resolver for user-related queries and mutations.
 * Delegates all business logic to UsersService following the resolver pattern.
 */
@Resolver(() => User)
export class UsersResolver {
  /**
   * @constructor
   * @param {UsersService} usersService - Injected service for user operations
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Query to retrieve all users in the system.
   *
   * @returns {User[]} List of all users
   */
  @Query(() => [User], { name: 'users' })
  findAll(): User[] {
    return this.usersService.findAll();
  }

  /**
   * Query to find a specific user by their unique identifier.
   *
   * @param {string} id - The UUID of the user to retrieve
   * @returns {User} The found user
   */
  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => ID }) id: string): User {
    return this.usersService.findOne(id);
  }

  /**
   * Mutation to create a new user in the system.
   *
   * @param {CreateUserInput} createUserInput - The input data for the new user
   * @returns {User} The newly created user
   */
  @Mutation(() => User)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): User {
    return this.usersService.create(createUserInput);
  }

  /**
   * Mutation to update an existing user's information.
   *
   * @param {UpdateUserInput} updateUserInput - The input data with updated fields
   * @returns {User} The updated user
   */
  @Mutation(() => User)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): User {
    return this.usersService.update(updateUserInput);
  }

  /**
   * Mutation to delete a user from the system.
   *
   * @param {string} id - The UUID of the user to remove
   * @returns {boolean} True if deletion was successful
   */
  @Mutation(() => Boolean)
  removeUser(@Args('id', { type: () => ID }) id: string): boolean {
    return this.usersService.remove(id);
  }
}
