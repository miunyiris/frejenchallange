const express = require('express');
const app = express();
const { sequelize, connectDatabase } = require('./db');  // Importando o sequelize aqui também
const User = require('./models/User');
const Tickets = require('./models/Tickets');
const { QueryTypes,Op } = require('sequelize');
const Department = require('./models/Departments');
const State = require('./models/States');

// Middleware para aceitar JSON
app.use(express.json());

// Middleware para aceitar dados codificados por URL
app.use(express.urlencoded({ extended: true }));

function formatDate(date) {
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}

// Rota para testar a conexão e listar todos os usuários
app.get('/api/users', async (req, res) => {
    try {
        const users = await sequelize.query(`
            SELECT 
                u.id, 
                u.name, 
                u.email, 
                u.password, 
                u.admin, 
                d.title AS department_title
            FROM users u
            INNER JOIN departements d ON u.id_department = d.id 
        `, {
            type: QueryTypes.SELECT, //tirar o e de departments
        });

        res.status(200).json(users);  // Retorna os dados no formato esperado
    } catch (error) {
        console.error(error);  // Imprime o erro no console para diagnóstico
        res.status(500).json({ error: 'Erro ao buscar usuários', details: error.message });
    }
});

app.post('/api/users', async (req, res) => {
    const admin = 0;
    const { username, email, password, id_department } = req.body;
    try {
        const newUser = await User.create({
            name: username,
            email: email,
            password: password,
            id_department: id_department,
            admin: admin
        });

        res.status(201).json({ message: 'Usuário criado com sucesso!', userId: newUser.id });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro ao criar usuário', details: error.message });
    }
});


app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { username, email, password, id_department} = req.body;

    try {
        // Verifica se o usuário existe
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }

        await user.update({
            name: username,
            email: email,
            password: password,
            id_department: id_department
        });

        res.status(200).json({ message: 'Usuário atualizado com sucesso!', userId: user.id });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ error: 'Erro ao atualizar usuário', details: error.message });
    }
});

app.get('/api/alltickets', async (req, res) => {
    try {
        const tickets = await Tickets.findAll();

        res.status(200).json(tickets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar usuários', details: error.message });
    }
});//ja nao é necessario

app.post('/api/tickets', async (req, res) => {
    const { title, description, created_by, id_department } = req.body;
    try {
        const newUser = await Tickets.create({
            title: title,
            description: description,
            created_by: created_by,
            updated_by: created_by,
            id_department: id_department,
        });

        res.status(201).json({ message: 'Usuário criado com sucesso!', userId: newUser.id });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro ao criar usuário', details: error.message });
    }
});

// app.get('/api/tickets', async (req, res) => {
//     const { created_id, department_id } = req.query;
//     try {
//         const tickets = await Tickets.findAll({
//             where: {
//                 created_by: created_id, 
//                 id_department: department_id, 
//             }
//         });

//         res.json(tickets);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Erro ao buscar usuários', details: error.message });
//     }
// });

app.put('/api/tickets/:ticketId', async (req, res) => {
    const { ticketId } = req.params;
    const { userId, idState, observations} = req.body;

    try {
        const ticket = await Tickets.findByPk(ticketId);

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found!' });
        }

        await ticket.update({
            updated_by: userId,
            id_state: idState,
            observacoes: observations,
        });

        res.status(200).json({ message: 'Usuário atualizado com sucesso!', Ticket: ticket });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ error: 'Erro ao atualizar usuário', details: error.message });
    }
});

app.get('/api/tickets/:ticketId', async (req, res) => {
    const { ticketId } = req.params;
    try {
        const tickets = await Tickets.findAll({
            where: {
                id: ticketId,
            },
            attributes: ['title', 'description', 'createdAt', 'updatedAt', 'created_by', 'updated_by', 'id_department', 'id_state', 'observacoes'],
        });

        // const ticket = await Tickets.findByPk(ticketId, {
        //     attributes: ['title', 'description', 'createdAt', 'updatedAt', 'created_by', 'updated_by', 'id_department', 'id_state', 'observacoes'],
        // });

        if (tickets.length === 0) {
            return res.status(404).json({ error: 'Ticket não encontrado' });
        }

        const ticket = tickets[0]; // Acessando o primeiro item do array retornado

        const formattedTicket = (ticket) => {
            return {
                title: ticket.title,
                id_department: ticket.id_department,
                id_state: ticket.id_state,
                createdAt: formatDate(new Date(ticket.createdAt)),
                updatedAt: formatDate(new Date(ticket.updatedAt)),
                description: ticket.description,
                created_by: ticket.created_by,
                updated_by: ticket.updated_by,
                observacoes: ticket.observacoes
            };
        };

        res.status(200).json(formattedTicket(ticket));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar ticket', details: error.message });
    }
});

app.get('/api/tickets', async (req, res) => {
    const { status, search,created_id, department_id,pagenumber,pagesize } = req.query;
    console.log(req.query);
    const pageNumber =  Number(pagenumber);
    const pageSize = Number(pagesize);
    let hasMore= true;

    let whereConditions = {};

    
    if (!pagenumber) {
        return res.status(400).json({ error: 'Parâmetro de estado é necessário.' });
    }

    if (!pagesize) {
        return res.status(400).json({ error: 'Parâmetro de estado é necessário.' });
    }

    if (!status) {
        return res.status(400).json({ error: 'Parâmetro de estado é necessário.' });
    }
    
    const statusArray = status.split(',').map(s => parseInt(s));

    if (!statusArray.every(s => [1, 2, 3, 4].includes(s))) {
        return res.status(400).json({
            error: 'Estado inválido. Valores válidos: 1 (Pendente), 2 (Recusado), 3 (Em tratamento), 4 (Finalizado).'
        });
    }

    whereConditions.id_state = statusArray;


// Construção das condições de pesquisa
let andConditions = [];  // Para armazenar todas as condições agrupadas com Op.and

// Se created_id ou department_id forem fornecidos, adicionamos essas condições
if (created_id || department_id) {
    let orConditions = [];  // Para as condições "OR" relacionadas a created_id e department_id
    
    if (created_id) {
        orConditions.push({ created_by: created_id });
    }

    if (department_id) {
        orConditions.push({ id_department: department_id });
    }

    if (orConditions.length > 0) {
        andConditions.push({ [Op.or]: orConditions });
    }
}

// Se search for fornecido e não estiver vazio, adicionamos as condições de pesquisa
if (search && search.trim() !== '') {
    let orSearchConditions = [
        { observacoes: { [Op.like]: `%${search.toLocaleLowerCase()}%` } },
        { title: { [Op.like]: `%${search.toLocaleLowerCase()}%` } },
        { description: { [Op.like]: `%${search.toLocaleLowerCase()}%` } }
    ];

    andConditions.push({ [Op.or]: orSearchConditions });
}

// Verifica se temos condições para aplicar no whereConditions
if (andConditions.length > 0) {
    whereConditions[Op.and] = andConditions;
}
        
    console.log(whereConditions);

    try {
        const tickets = await Tickets.findAll({
            where: whereConditions,
            //attributes: ['title', 'createdAt', 'updatedAt', 'id_department', 'id_state'],
            attributes: ['id','title', 'createdAt', 'updatedAt', 'id_state','created_by','updated_by'],
            limit: pageSize,
            offset: (pageNumber - 1) * pageSize,
            order: [
                ['updatedAt', 'DESC'],  // Ordena pela coluna 'updatedAt' em ordem decrescente
            ],
        });

    const totalCount = await Tickets.count();

    const totalPages = Math.ceil(totalCount / pageSize);

    if(pageNumber >= totalPages)
    {
        hasMore = false;
    }

        if (tickets.length === 0) {
            return res.status(404).json({ message: 'Nenhum ticket encontrado para os estados fornecidos.' });
        }

        const formattedTickets = tickets.map(ticket => {
            return {
                id: ticket.id,
                title: ticket.title,
                id_department:ticket.id_department,
                id_state: ticket.id_state,
                createdAt: formatDate(new Date(ticket.createdAt)),
                updateAt:formatDate(new Date(ticket.updatedAt))
            };
        });

        const response = {
            "tickets":formattedTickets,
            "hasMore":hasMore
        }

        res.status(200).json(response);
    } catch (error) {
        console.error('Erro ao buscar tickets:', error);
        res.status(500).json({ error: 'Erro ao buscar tickets', details: error.message });
    }
});


app.get('/api/departments', async (req, res) => {
    try {
        const department = await Department.findAll({
            attributes: ['id','title'],
        });

        //const titles = department.map(d => d.title);

        res.status(200).json(department);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar ticket', details: error.message });
    }
});

app.get('/api/asd', async (req, res) => {
    const { pagenumber,pagesize } = req.query;
    const pageNumber =  Number(pagenumber);
    const pageSize = Number(pagesize);
    let hasMore= true;
    try {
        const department = await Department.findAll({
            attributes: ['id','title'],
            limit: pageSize,
            offset: (pageNumber - 1) * pageSize,
        });

        const totalCount = await Department.count();

        const totalPages = Math.ceil(totalCount / pageSize);

        if(pageNumber >= totalPages)
        {
            hasMore = false;
        }

        //const titles = department.map(d => d.title);

        // let object = {
        //     "tickets": [
        //       { "id": 1 + page, "title": "teste12", "description": "teste12" },
        //       { "id": 2 + page, "title": "teste21", "description": "teste12"  },
        //       { "id": 3 + page, "title": "teste123", "description": "teste12"  },
        //       { "id": 4 + page, "title": "teste321", "description": "teste12"  },
        //       { "id": 5 + page, "title": "teste124", "description": "teste12"  },
        //       { "id": 6 + page, "title": "teste421", "description": "teste12"  },
        //       { "id": 7 + page, "title": "teste125", "description": "teste12"  },
        //       { "id": 8 + page, "title": "teste521", "description": "teste12"  },
        //       { "id": 9 + page, "title": "teste521", "description": "teste12"  },
        //       { "id": 10 + page, "title": "teste521", "description": "teste12"  },
        //     ],
        //     "hasMore": true
        //   };

        res.status(200).json(hasMore);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar ticket', details: error.message });
    }
});

connectDatabase().then(async () => {
    await sequelize.sync();
    app.listen(1880, () => {
        console.log('Server running on port 1880');
    });
});