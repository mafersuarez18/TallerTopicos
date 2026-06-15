import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { LogAction } from '../common/decorators/log-action.decorator';

/**
 * @class UsersService
 *
 * Servicio que contiene toda la lógica de negocio relacionada con usuarios.
 * Usamos un arreglo en memoria como base de datos para este proyecto,
 * lo que significa que los datos se pierden al reiniciar el servidor.
 *
 * El decorador @LogAction en cada método es nuestra implementación de AOP:
 * agrega logging automáticamente sin ensuciar el código de negocio.
 */
@Injectable()
export class UsersService {
  // Almacenamiento en memoria de todos los usuarios del sistema
  private readonly users: User[] = [];

  /**
   * Retorna todos los usuarios registrados.
   *
   * @returns {User[]} Lista de usuarios
   */
  @LogAction('UsersService')
  findAll(): User[] {
    return this.users;
  }

  /**
   * Busca un usuario por su ID.
   * Lanza una excepción si no lo encuentra (NestJS la convierte en un error GraphQL).
   *
   * @param {string} id - UUID del usuario a buscar
   * @returns {User} El usuario encontrado
   * @throws {NotFoundException} Si no existe un usuario con ese ID
   */
  @LogAction('UsersService')
  findOne(id: string): User {
    const user = this.users.find((u) => u.id === id);

    // Si no existe, NestJS se encarga de devolver el error al cliente
    if (!user) {
      throw new NotFoundException(`Usuario con id "${id}" no encontrado`);
    }

    return user;
  }

  /**
   * Crea un nuevo usuario con los datos proporcionados.
   * Genera automáticamente el ID y la fecha de creación.
   *
   * @param {CreateUserInput} input - Datos del nuevo usuario
   * @returns {User} El usuario recién creado
   */
  @LogAction('UsersService')
  create(input: CreateUserInput): User {
    const newUser: User = {
      id: uuidv4(),              // generamos un ID único
      name: input.name,
      email: input.email,
      createdAt: new Date().toISOString(), // guardamos la fecha actual en ISO 8601
    };

    this.users.push(newUser);
    return newUser;
  }

  /**
   * Actualiza los datos de un usuario existente.
   * Solo se modifican los campos que se envíen (actualización parcial).
   *
   * @param {UpdateUserInput} input - Campos a actualizar
   * @returns {User} El usuario con los datos actualizados
   * @throws {NotFoundException} Si el usuario no existe
   */
  @LogAction('UsersService')
  update(input: UpdateUserInput): User {
    // Primero verificamos que el usuario exista (findOne lanza error si no)
    const user = this.findOne(input.id);

    // Solo actualizamos los campos que llegaron en el input
    if (input.name !== undefined) user.name = input.name;
    if (input.email !== undefined) user.email = input.email;

    return user;
  }

  /**
   * Elimina un usuario del sistema.
   *
   * @param {string} id - UUID del usuario a eliminar
   * @returns {boolean} true si se eliminó correctamente
   * @throws {NotFoundException} Si el usuario no existe
   */
  @LogAction('UsersService')
  remove(id: string): boolean {
    const index = this.users.findIndex((u) => u.id === id);

    if (index === -1) {
      throw new NotFoundException(`Usuario con id "${id}" no encontrado`);
    }

    // splice elimina el elemento en esa posición del arreglo
    this.users.splice(index, 1);
    return true;
  }
}
