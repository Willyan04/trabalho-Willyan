const prisma = require('./prisma');

const createUser = (users) => {
    return prisma.users.createMany({
        data: {
            name: users.name,
            email: users.email,
            password: users.password,
        }
    })
}
const findByEmail = (email) => {
    return prisma.users.findUnique({
        where: {
            email
        },
    })
};
const findById = (id) => {
    return prisma.users.findUnique({
        select: {
            id: true,
            name: true,
            email: true,
            password: false,
        },
        where: {
            id
        },
    })
};

module.exports = {
    createUser,
    findByEmail,
    findById,
}