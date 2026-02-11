import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- LEAD CAPTURE (CRM) ---
app.post('/api/leads', async (req, res) => {
    try {
        const { name, email, phone, interest, origin } = req.body;
        
        const lead = await prisma.lead.create({
            data: {
                name,
                email,
                phone,
                interest,
                origin,
                status: 'NOVO_LEAD'
            }
        });

        // Add activity log
        await prisma.activityLog.create({
            data: {
                action: 'Novo Lead Capturado',
                details: `Lead ${name} (${email}) capturado via ${origin}`,
                entityType: 'LEAD',
                entityId: lead.id
            }
        });

        res.status(201).json(lead);
    } catch (error) {
        console.error('Error creating lead:', error);
        res.status(500).json({ error: 'Erro ao processar o lead' });
    }
});

app.get('/api/leads', async (req, res) => {
    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar leads' });
    }
});

// --- COURSES (LMS) ---
app.get('/api/courses', async (req, res) => {
    try {
        const courses = await prisma.course.findMany({
            include: { enrollments: true }
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar cursos' });
    }
});

app.get('/api/courses/:slug', async (req, res) => {
    try {
        const course = await prisma.course.findUnique({
            where: { slug: req.params.slug }
        });
        if (!course) return res.status(404).json({ error: 'Curso não encontrado' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar curso' });
    }
});

// --- WORKSHOP (OS) ---
app.get('/api/service-orders', async (req, res) => {
    try {
        const orders = await prisma.serviceOrder.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar ordens de serviço' });
    }
});

// --- FINANCIAL (CASH FLOW) ---
app.get('/api/financial/stats', async (req, res) => {
    try {
        const transactions = await prisma.financialTransaction.findMany();
        const totalRevenue = transactions
            .filter(t => t.type === 'RECEITA')
            .reduce((sum, t) => sum + Number(t.amount), 0);
        const totalExpenses = transactions
            .filter(t => t.type === 'DESPESA')
            .reduce((sum, t) => sum + Number(t.amount), 0);
        
        res.json({
            revenue: totalRevenue,
            expenses: totalExpenses,
            balance: totalRevenue - totalExpenses,
            count: transactions.length
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao calcular financeiro' });
    }
});

app.get('/api/financial/transactions', async (req, res) => {
    try {
        const transactions = await prisma.financialTransaction.findMany({
            orderBy: { date: 'desc' },
            take: 20
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar transações' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
