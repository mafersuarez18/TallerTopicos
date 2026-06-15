import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { LogAction } from '../common/decorators/log-action.decorator';

/**
 * @class UsersService
 * @description Service responsible for all business logic related to users.
 * Uses an in-memory store for data persistence during the server session.
 * The @LogAction decorator applies AOP logging as a cross-cutting concern.
 */
@Injectable()
export class UsersService {
  /** @private In-memory storage for users */
  private readonly users: User[] = [];

  /**
   * Retrieves all users in the system.
   *
   * @returns {User[]} Array of all registered users
   */
  @LogAction('UsersService')
  findAll(): User[] {
    return this.users;
  }

  /**
   * Finds a single user by their unique identifier.
   *
   * @param {string} id - The UUID of the user to find
   * @returns {User} The found user
   * @throws {NotFoundException} When no user exists with the given id
   */
  @LogAction('UsersService')
  findOne(id: string): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    return user;
  }

  /**
   * Creates a new user in the system.
   *
   * @param {CreateUserInput} input - The data required to create the user
   * @returns {User} The newly created user with generated id and timestamps
   */
  @LogAction('UsersService')
  create(input: CreateUserInput): User {
    const newUser: User = {
      id: uuidv4(),
      name: input.name,
      email: input.email,
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  /**
   * Updates an existing user's information.
   *
   * @param {UpdateUserInput} input - The updated fields for the user
   * @returns {User} The updated user object
   * @throws {NotFoundException} When no user exists with the given id
   */
  @LogAction('UsersService')
  update(input: UpdateUserInput): User {
    const user = this.findOne(input.id);
    if (input.name !== undefined) user.name = input.name;
    if (input.email !== undefined) user.email = input.email;
    return user;
  }

  /**
   * Removes a user from the system by their id.
   *
   * @param {string} id - The UUID of the user to delete
   * @returns {boolean} True if the user was successfully removed
   * @throws {NotFoundException} When no user exists with the given id
   */
  @LogAction('UsersService')
  remove(id: string): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    this.users.splice(index, 1);
    return true;
  }
}
