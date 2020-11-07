const { nexusPrisma } = require('nexus-plugin-prisma')
const { idArg, makeSchema, objectType, stringArg, queryType, mutationType } = require('@nexus/schema')

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

// const Query = objectType({
//   name: 'Query',
//   definition(t) {
//     t.crud.item()

//     t.list.field('feed', {
//       type: 'Post',
//       resolve: (_, args, ctx) => {
//         return ctx.prisma.post.findMany({
//           where: { published: true },
//         })
//       },
//     })

//     t.list.field('filterPosts', {
//       type: 'Post',
//       args: {
//         searchString: stringArg({ nullable: true }),
//       },
//       resolve: (_, { searchString }, ctx) => {
//         return ctx.prisma.post.findMany({
//           where: {
//             OR: [
//               { title: { contains: searchString } },
//               { content: { contains: searchString } },
//             ],
//           },
//         })
//       },
//     })
//   },
// })

// const Mutation = objectType({
//   name: 'Mutation',
//   definition(t) {
//     t.crud.createOneUser({ alias: 'signupUser' })
//     t.crud.deleteOnePost()

//     t.field('createDraft', {
//       type: 'Post',
//       args: {
//         title: stringArg({ nullable: false }),
//         content: stringArg(),
//         authorEmail: stringArg(),
//       },
//       resolve: (_, { title, content, authorEmail }, ctx) => {
//         return ctx.prisma.post.create({
//           data: {
//             title,
//             content,
//             published: false,
//             author: {
//               connect: { email: authorEmail },
//             },
//           },
//         })
//       },
//     })

//     t.field('publish', {
//       type: 'Post',
//       nullable: true,
//       args: {
//         id: idArg(),
//       },
//       resolve: (_, { id }, ctx) => {
//         return ctx.prisma.post.update({
//           where: { id: Number(id) },
//           data: { published: true },
//         })
//       },
//     })
//   },
// })

const schema = makeSchema({
  types: [Query, Mutation, List, Item], //[Query, Mutation, Post, User],
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