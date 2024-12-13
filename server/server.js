const express = require('express');
const app = express();
const { sequelize, connectDatabase } = require('./db');
const User = require('./models/User');
const Tickets = require('./models/Tickets');
const { Op } = require('sequelize');
const Department = require('./models/Departments');
const cors = require('cors');

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

function formatDate(date) {
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}

function formatTicket(newTicket) {
    return {
        id: newTicket.id,
        title: newTicket.title,
        department: newTicket.Department.title,
        id_state: newTicket.id_state,
        createdAt: formatDate(new Date(newTicket.createdAt)),
        updatedAt: formatDate(new Date(newTicket.updatedAt)),
        observacoes: newTicket.observacoes,
        createdByName: newTicket.createdBy.name,
        updatedByName: newTicket.updatedBy.name,
        observations: newTicket.observacoes
    };
}

app.post('/api/authenticate', async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        const user = await User.findOne({
            where: { email, password },
            attributes: ['id', 'name', 'admin'],
            include: [{
                model: Department,
                attributes: ['id','title'],
            }],
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado ou credenciais inválidas' });
        }

        const userInfo = {
            id:user.id,
            name: user.name,
            id_department: user.Department.id,
            department:user.Department.title,
            admin: user.admin,
        };

        res.status(200).json(userInfo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao autenticar usuário', details: error.message });
    }
});

app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, password, id_department } = req.body;

    console.log(req.body);

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }

        const updatedFields = {
            name: name,
            id_department: id_department,
        };

        if (password && password.trim() !== '') {
            updatedFields.password = password;
        }

        await user.update(updatedFields);

        const newUserInfo = await User.findByPk(id);

        res.status(200).json(newUserInfo);
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ error: 'Erro ao atualizar usuário', details: error.message });
    }
});

app.get('/api/tickets', async (req, res) => {
    const { status, search,created_id, department_id,pagenumber,pagesize } = req.query;
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

let andConditions = [];  
if (created_id || department_id) {
    let orConditions = [];
    
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

if (search && search.trim() !== '') {
    let orSearchConditions = [
        { observacoes: { [Op.like]: `%${search.toLocaleLowerCase()}%` } },
        { title: { [Op.like]: `%${search.toLocaleLowerCase()}%` } },
        { description: { [Op.like]: `%${search.toLocaleLowerCase()}%` } }
    ];

    andConditions.push({ [Op.or]: orSearchConditions });
}

if (andConditions.length > 0) {
    whereConditions[Op.and] = andConditions;
}

    try {
        const tickets = await Tickets.findAll({
            where: whereConditions,
            attributes: ['id','title','description', 'createdAt', 'updatedAt', 'id_state','created_by','updated_by','observacoes','id_department'],
            limit: pageSize,
            offset: (pageNumber - 1) * pageSize,
            order: [
                ['updatedAt', 'DESC'],
                ['id', 'ASC'] 
            ],
            include:  [
                {
                    model: Department,
                    attributes: ['title'],
                    required: true,
                },
                {
                    model: User,
                    as: 'createdBy',
                    attributes: ['name'],
                    foreignKey: 'created_by',
                },
                {
                    model: User,
                    as: 'updatedBy',
                    attributes: ['name'],
                    foreignKey: 'updated_by',
                }
            ]
        });

        const totalCount = await Tickets.count({
            where: whereConditions,
          });

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
                id:ticket.id,
                title:ticket.title,
                department:ticket.Department.title,
                id_state:ticket.id_state,
                createdAt: formatDate(new Date(ticket.createdAt)),
                updatedAt:formatDate(new Date(ticket.updatedAt)),
                observacoes:ticket.observacoes,
                createdByName:ticket.createdBy.name,
                updatedByName:ticket.updatedBy.name,
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

        const newTicket = await Tickets.findByPk(newUser.id, {
            attributes: ['id', 'title', 'description', 'createdAt', 'updatedAt', 'id_state', 'created_by', 'updated_by', 'observacoes', 'id_department'],
            include: [
              {
                model: Department,
                attributes: ['title'],
                required: true,
              },
              {
                model: User,
                as: 'createdBy',
                attributes: ['name'],
                foreignKey: 'created_by',
              },
              {
                model: User,
                as: 'updatedBy',
                attributes: ['name'],
                foreignKey: 'updated_by',
              }
            ]
          });

        res.status(200).json(formatTicket(newTicket));
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro ao criar usuário', details: error.message });
    }
});

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

        const ticketUpdated = await Tickets.findByPk(ticketId, {
            attributes: ['id', 'title', 'description', 'createdAt', 'updatedAt', 'id_state', 'created_by', 'updated_by', 'observacoes', 'id_department'],
            include: [
              {
                model: Department,
                attributes: ['title'],
                required: true,
              },
              {
                model: User,
                as: 'createdBy',
                attributes: ['name'],
                foreignKey: 'created_by',
              },
              {
                model: User,
                as: 'updatedBy',
                attributes: ['name'],
                foreignKey: 'updated_by',
              }
            ]
          });

        res.status(200).json(formatTicket(ticketUpdated));
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ error: 'Erro ao atualizar usuário', details: error.message });
    }
});

app.get('/api/departments', async (req, res) => {
    try {
        const department = await Department.findAll({
            attributes: ['id','title'],
        });

        res.status(200).json(department);
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