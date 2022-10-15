import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasOneRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Pedidos, PedidosRelations, Persona, Producto} from '../models';
import {PersonaRepository} from './persona.repository';
import {ProductoRepository} from './producto.repository';

export class PedidosRepository extends DefaultCrudRepository<
  Pedidos,
  typeof Pedidos.prototype.id,
  PedidosRelations
> {

  public readonly persona: BelongsToAccessor<Persona, typeof Pedidos.prototype.id>;

  public readonly producto: HasOneRepositoryFactory<Producto, typeof Pedidos.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('PersonaRepository') protected personaRepositoryGetter: Getter<PersonaRepository>, @repository.getter('ProductoRepository') protected productoRepositoryGetter: Getter<ProductoRepository>,
  ) {
    super(Pedidos, dataSource);
    this.producto = this.createHasOneRepositoryFactoryFor('producto', productoRepositoryGetter);
    this.registerInclusionResolver('producto', this.producto.inclusionResolver);
    this.persona = this.createBelongsToAccessorFor('persona', personaRepositoryGetter,);
    this.registerInclusionResolver('persona', this.persona.inclusionResolver);
  }
}
