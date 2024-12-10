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
    const { status, search,created_id, department_id } = req.query;

    let whereConditions = {};

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


    if (created_id) {
        whereConditions.created_by = created_id;
    }

    if (department_id) {
        whereConditions.id_department = department_id;
    }

    if (search) {
        whereConditions = {
            ...whereConditions,
            [Op.or]: [
                { observacoes: { [Op.like]: `%${search}%` } },
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ]
        };
    }
        
    try {
        const tickets = await Tickets.findAll({
            where: whereConditions,
            attributes: ['title', 'createdAt', 'updatedAt', 'id_department', 'id_state'],
        });

        if (tickets.length === 0) {
            return res.status(404).json({ message: 'Nenhum ticket encontrado para os estados fornecidos.' });
        }

        const formattedTickets = tickets.map(ticket => {
            return {
                title: ticket.title,
                id_department:ticket.id_department,
                id_state: ticket.id_state,
                createdAt: formatDate(new Date(ticket.createdAt)),
                updateAt:formatDate(new Date(ticket.updatedAt))
            };
        });

        res.status(200).json(formattedTickets);
    } catch (error) {
        console.error('Erro ao buscar tickets:', error);
        res.status(500).json({ error: 'Erro ao buscar tickets', details: error.message });
    }
});


app.get('/api/departments', async (req, res) => {
    try {
        const department = await Department.findAll({
            attributes: ['title'],
        });

        const titles = department.map(d => d.title);

        res.status(200).json(titles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar ticket', details: error.message });
    }
});

connectDatabase().then(async () => {
    await sequelize.sync();
    app.listen(5000, () => {
        console.log('Server running on port 5000');
    });
});