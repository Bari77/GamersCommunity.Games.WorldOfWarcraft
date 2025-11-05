
using GamersCommunity.Core.Services;
using WorldOfWarcraft.Database.Context;
using WorldOfWarcraft.Database.Models;

namespace WorldOfWarcraft.Consumer.Services.Data
{
    /// <summary>
    /// Specialized table service for handling <see cref="Class"/> entities.
    /// </summary>
    /// <remarks>
    /// <para>
    /// This service inherits from <see cref="GenericTableService{TContext, TEntity}"/>,
    /// binding it to the <see cref="WorldOfWarcraftDbContext"/> database context and the <see cref="Class"/> entity type.
    /// </para>
    /// <para>
    /// It exposes all generic CRUD operations (List, Get, Update, Delete, etc.) implemented
    /// in <see cref="GenericTableService{TContext, TEntity}"/>, while associating them with the logical table name <c>"Classes"</c>.
    /// </para>
    /// </remarks>
    public class ClassesService : GenericTableService<WorldOfWarcraftDbContext, Class>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ClassesService"/> class.
        /// </summary>
        /// <param name="context">
        /// The database context used to access the <c>Classes</c> table.
        /// Typically injected by dependency injection.
        /// </param>
        public ClassesService(WorldOfWarcraftDbContext context)
            : base(context, "Classes")
        {
        }
    }
}
