// Mocked Prisma Client for API testing
const prisma = {
    order: {
        create: async (data) => ({ id: 'mock-order-uuid', ...data })
    }
};

module.exports = prisma;
