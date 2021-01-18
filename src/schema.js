const { nexusPrisma } = require('nexus-plugin-prisma')
const { idArg, makeSchema, objectType, stringArg, queryType, mutationType } = require('nexus')

const Item = objectType({
  name: 'Item',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.list_id()
  },
})

const List = objectType({
  name: 'List',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.items()
  },
})

const Query = queryType({
  definition(t) {
    t.crud.list()
    t.crud.lists()
  },
})

const Mutation = mutationType({
  definition(t) {
    t.crud.createOneList()
    t.crud.createOneItem()
    t.crud.deleteOneItem()
    t.crud.deleteOneList()
  }
})

const schema = makeSchema({
  types: [Query, Mutation, List, Item],
  plugins: [nexusPrisma({ experimentalCRUD: true })],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  typegenAutoConfig: {
    contextType: 'Context.Context',
    sources: [
      {
        source: '@prisma/client',
        alias: 'prisma',
      },
      {
        source: require.resolve('./context'),
        alias: 'Context',
      },
    ],
  },
})

module.exports = {
  schema,
}
