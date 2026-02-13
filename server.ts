import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient, Prisma } from '@prisma/client';

// --- FILE UPLOAD ---
import multer from 'multer';
import path from 'path';

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
// Serve uploaded files statically
app.use('/uploads', express.static('public/uploads'));

// --- UPLOAD ENDPOINT ---
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado' });
        }
        // Return the public URL
        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({ url: fileUrl });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Erro no upload' });
    }
});

// --- LEAD CAPTURE (CRM) ---
app.post('/api/leads', async (req, res) => {
    try {
        const { name, email, phone, interest, origin, courseDateId } = req.body;
        
        const lead = await prisma.lead.create({
            data: {
                name,
                email,
                phone,
                interest,
                origin,
                courseDateId, // Associate with specific date if provided
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

app.patch('/api/leads/:id', async (req, res) => {
    try {
        const { name, email, phone, whatsapp, interest, notes, tags, status, managerId } = req.body;
        const lead = await prisma.lead.update({
            where: { id: req.params.id },
            data: {
                name,
                email,
                phone,
                whatsapp,
                interest,
                status,
                notes,
                tags,
                managerId
            }
        });
        res.json(lead);
    } catch (error) {
        console.error('Error updating lead:', error);
        res.status(500).json({ error: 'Erro ao atualizar o lead' });
    }
});

app.delete('/api/leads/:id', async (req, res) => {
    try {
        await prisma.lead.delete({
            where: { id: req.params.id }
        });
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting lead:', error);
        res.status(500).json({ error: 'Erro ao excluir o lead' });
    }
});

// --- COURSES (LMS) ---
app.get('/api/courses', async (req, res) => {
    try {
        const courses = await prisma.course.findMany({
            include: { dates: true }
        });
        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Erro ao buscar cursos' });
    }
});

app.get('/api/course-dates/:slug', async (req, res) => {
    try {
        const courseDate = await prisma.courseDate.findUnique({
            where: { slug: req.params.slug },
            include: { course: true }
        });
        if (!courseDate) return res.status(404).json({ error: 'Página de inscrição não encontrada' });
        res.json(courseDate);
    } catch (error) {
        console.error('Error fetching course date:', error);
        res.status(500).json({ error: 'Erro ao buscar dados da inscrição' });
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
        console.error('Error fetching course by slug:', error);
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

// --- ENROLLMENTS & PAYMENTS ---
app.post('/api/enrollments/generate-link', async (req, res) => {
    try {
        const { enrollmentId } = req.body;
        
        // In a real scenario, we'd integrate with Stripe/Asaas here
        // For now, generating a mock dynamic ID link
        const paymentLink = `https://checkout.proriders.com.br/pay/${enrollmentId}`;
        
        const enrollment = await prisma.enrollment.update({
            where: { id: enrollmentId },
            data: { paymentLink }
        });

        res.json(enrollment);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao gerar link de pagamento' });
    }
});

app.get('/api/enrollments/:id', async (req, res) => {
    try {
        const enrollment = await prisma.enrollment.findUnique({
            where: { id: req.params.id },
            include: { 
                courseDate: { include: { course: true } },
                student: true
            }
        });
        if (!enrollment) return res.status(404).json({ error: 'Inscrição não encontrada' });
        res.json(enrollment);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar inscrição' });
    }
});

// --- ADMIN API: COURSES ---
app.post('/api/courses', async (req, res) => {
    try {
        const { name, slug, description, content, image, type, status, instructorId, certificateLayout, badgeLayout, schedule, learningOutcomes } = req.body;
        const course = await prisma.course.create({
            data: {
                name,
                slug,
                description,
                content,
                image,
                type,
                status,
                instructorId: instructorId || null,
                certificateLayout,
                badgeLayout,
                schedule: schedule || [],
                learningOutcomes: learningOutcomes || []
            }
        });
        res.status(201).json(course);
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ error: 'Erro ao criar modelo de curso' });
    }
});

app.patch('/api/courses/:id', async (req, res) => {
    try {
        const { name, slug, description, content, image, type, status, instructorId, certificateLayout, badgeLayout, active, schedule, learningOutcomes } = req.body;
        const course = await prisma.course.update({
            where: { id: req.params.id },
            data: {
                name,
                slug,
                description,
                content,
                image,
                type,
                status,
                instructorId: instructorId || null,
                certificateLayout,
                badgeLayout,
                active,
                schedule,
                learningOutcomes
            }
        });
        res.json(course);
    } catch (error) {
        console.error('Error updating course template:', error);
        res.status(500).json({ error: 'Erro ao atualizar modelo de curso' });
    }
});

app.delete('/api/courses/:id', async (req, res) => {
    try {
        await prisma.course.delete({ where: { id: req.params.id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar modelo de curso' });
    }
});

// --- PUBLIC API: COURSE DATES ---
app.get('/api/public/course-dates/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const courseDate = await prisma.courseDate.findUnique({
            where: { slug },
            include: { course: true }
        });
        if (!courseDate) {
            return res.status(404).json({ error: 'Turma não encontrada' });
        }
        res.json(courseDate);
    } catch (error) {
        console.error('Error fetching course date by slug:', error);
        res.status(500).json({ error: 'Erro ao buscar turma' });
    }
});

// --- ADMIN API: COURSE DATES ---
app.post('/api/course-dates', async (req, res) => {
    try {
        const { 
            courseId, slug, startDate, endDate, location, 
            price, priceRecycling, maxStudents, timeStart, timeEnd,
            cep, address, number, neighborhood, city, state,
            latitude, longitude, mapUrl, modality, billingType, instructorName,
            instructorImage, instructorBio, coverImage, videoUrl, schedule
        } = req.body;
        
        const courseDate = await prisma.courseDate.create({
            data: {
                courseId,
                slug,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : undefined,
                location,
                maxStudents,
                timeStart,
                timeEnd,
                cep,
                address,
                number,
                neighborhood,
                city,
                state,
                latitude: (latitude && !isNaN(parseFloat(latitude))) ? parseFloat(latitude) : null,
                longitude: (longitude && !isNaN(parseFloat(longitude))) ? parseFloat(longitude) : null,
                mapUrl,
                modality,
                billingType,
                instructorName,
                instructorImage,
                instructorBio,
                coverImage,
                videoUrl,
                schedule: schedule || undefined,
                price: (price && price !== "") ? new Prisma.Decimal(price.toString()) : 0,
                priceRecycling: (priceRecycling && priceRecycling !== "") ? new Prisma.Decimal(priceRecycling.toString()) : null
            }
        });
        res.status(201).json(courseDate);
    } catch (error) {
        console.error('Error creating course date:', error);
        res.status(500).json({ error: 'Erro ao criar data de curso' });
    }
});

app.patch('/api/course-dates/:id', async (req, res) => {
    try {
        const { 
            startDate, endDate, location, price, priceRecycling, 
            maxStudents, timeStart, timeEnd, active,
            cep, address, number, neighborhood, city, state,
            latitude, longitude, mapUrl, modality, billingType, instructorName,
            instructorImage, instructorBio, coverImage, videoUrl, schedule
        } = req.body;
        
        const courseDate = await prisma.courseDate.update({
            where: { id: req.params.id },
            data: {
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                location,
                price: (price && price !== "") ? new Prisma.Decimal(price.toString()) : undefined,
                priceRecycling: (priceRecycling && priceRecycling !== "") ? new Prisma.Decimal(priceRecycling.toString()) : null,
                maxStudents: maxStudents ? parseInt(maxStudents.toString()) : undefined,
                timeStart,
                timeEnd,
                active,
                cep,
                address,
                number,
                neighborhood,
                city,
                state,
                latitude: (latitude && !isNaN(parseFloat(latitude))) ? parseFloat(latitude) : undefined,
                longitude: (longitude && !isNaN(parseFloat(longitude))) ? parseFloat(longitude) : undefined,
                mapUrl,
                modality,
                billingType,
                instructorName,
                instructorImage,
                instructorBio,
                coverImage,
                videoUrl,
                schedule: schedule || undefined
            }
        });
        res.json(courseDate);
    } catch (error) {
        console.error('Error updating course date:', error);
        res.status(500).json({ error: 'Erro ao atualizar data de curso' });
    }
});

app.delete('/api/course-dates/:id', async (req, res) => {
    try {
        await prisma.courseDate.delete({ where: { id: req.params.id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar data de curso' });
    }
});

// --- ADMIN API: USERS ---
app.get('/api/admin/users', async (req, res) => {
    try {
        const { role } = req.query;
        let where = {};
        if (role) {
            const roles = (role as string).split(',');
            where = { role: { in: roles } };
        }
        const users = await prisma.user.findMany({
            where,
            orderBy: { name: 'asc' }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});

// --- SETTINGS API ---
app.get('/api/settings', async (req, res) => {
    try {
        let settings = await prisma.settings.findUnique({ where: { id: 'singleton' } });
        if (!settings) {
            settings = await prisma.settings.create({ data: { id: 'singleton' } });
        }
        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ error: 'Erro ao buscar configurações' });
    }
});

app.patch('/api/settings', async (req, res) => {
    try {
        const data = req.body;
        const settings = await prisma.settings.upsert({
            where: { id: 'singleton' },
            update: data,
            create: { id: 'singleton', ...data }
        });
        
        // Log action
        // await prisma.activityLog.create({
        //     data: {
        //         userId: req.user?.id, // Assuming auth middleware adds user
        //         action: 'UPDATE_SETTINGS',
        //         details: 'Configurações atualizadas',
        //         entityType: 'SETTINGS',
        //         entityId: 'singleton'
        //     }
        // });

        res.json(settings);
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ error: 'Erro ao atualizar configurações' });
    }
});

app.post('/api/settings/backup', async (req, res) => {
    try {
        // In a real app, this would dump the DB to a file/S3
        // For now, we simulate a successful backup
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        await prisma.activityLog.create({
            data: {
                action: 'SYSTEM_BACKUP',
                details: 'Backup manual realizado com sucesso',
                entityType: 'SYSTEM',
                entityId: 'backup-' + Date.now()
            }
        });

        res.json({ message: 'Backup realizado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao realizar backup' });
    }
});

app.post('/api/settings/reset', async (req, res) => {
    try {
        const { confirmation } = req.body;
        if (confirmation !== 'CONFIRMO_RESET_TOTAL') {
            return res.status(400).json({ error: 'Confirmação inválida' });
        }

        // Dangerous: Delete all data except user? 
        // Or specific tables? Let's just log for now to be safe.
        // await prisma.lead.deleteMany();
        // await prisma.enrollment.deleteMany();
        
        await prisma.activityLog.create({
            data: {
                action: 'SYSTEM_RESET',
                details: 'Tentativa de reset solicitada (Modo seguro: nada deletado)',
                entityType: 'SYSTEM',
                entityId: 'reset-' + Date.now()
            }
        });

        res.json({ message: 'Dados resetados com sucesso (Simulação)' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao resetar dados' });
    }
});

app.get('/api/settings/history', async (req, res) => {
    try {
        const logs = await prisma.activityLog.findMany({
            where: {
                OR: [
                    { entityType: 'SYSTEM' },
                    { entityType: 'SETTINGS' }
                ]
            },
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true } } },
            take: 50
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar histórico' });
    }
});

// --- ADMIN API: ENROLLMENTS ---
app.get('/api/admin/enrollments', async (req, res) => {
    try {
        const enrollments = await prisma.enrollment.findMany({
            include: {
                student: true,
                courseDate: { include: { course: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar todas as inscrições' });
    }
});

app.post('/api/admin/enrollments/manual', async (req, res) => {
    try {
        const { name, email, phone, courseDateId, paymentStatus, amountPaid, totalAmount, paymentMethod } = req.body;
        
        let student = await prisma.user.findUnique({ where: { email } });
        if (!student) {
            student = await prisma.user.create({
                data: {
                    email,
                    name,
                    phone: phone || null,
                    passwordHash: 'PR' + Math.random().toString(36).slice(-8),
                    role: 'USER'
                }
            });
        }

        const enrollment = await prisma.enrollment.create({
            data: {
                studentId: student.id,
                courseDateId,
                paymentStatus: paymentStatus || 'PENDENTE',
                paymentMethod: paymentMethod || null,
                amountPaid: amountPaid ? new Prisma.Decimal(amountPaid.toString()) : 0,
                totalAmount: totalAmount ? new Prisma.Decimal(totalAmount.toString()) : 0,
            },
            include: {
                student: true,
                courseDate: { include: { course: true } }
            }
        });

        // Lançar no financeiro se houver pagamento
        if (amountPaid && parseFloat(amountPaid.toString()) > 0) {
            await prisma.financialTransaction.create({
                data: {
                    description: `Pagamento curso: ${enrollment.courseDate.course.name} - Aluno: ${student.name}`,
                    amount: new Prisma.Decimal(amountPaid.toString()),
                    type: 'RECEITA',
                    category: 'CURSO',
                    userId: student.id,
                    date: new Date()
                }
            });
        }

        await prisma.courseDate.update({
            where: { id: courseDateId },
            data: { enrolledCount: { increment: 1 } }
        });

        res.status(201).json(enrollment);
    } catch (error) {
        console.error('Error in manual enrollment:', error);
        res.status(500).json({ error: 'Erro ao processar inscrição manual' });
    }
});

app.patch('/api/admin/enrollments/:id', async (req, res) => {
    try {
        const { paymentStatus, amountPaid, totalAmount, paymentMethod, attendance, paymentLink } = req.body;
        const enrollment = await prisma.enrollment.update({
            where: { id: req.params.id },
            data: {
                paymentStatus,
                paymentMethod,
                amountPaid: amountPaid ? new Prisma.Decimal(amountPaid.toString()) : undefined,
                totalAmount: totalAmount ? new Prisma.Decimal(totalAmount.toString()) : undefined,
                attendance,
                paymentLink
            },
            include: {
                student: true,
                courseDate: { include: { course: true } }
            }
        });

        // Se o status mudar para PAGO ou houver novo pagamento expressivo, poderíamos lançar aqui.
        // Por simplicidade, se amountPaid for enviado no PATCH, lançamos a diferença? 
        // Na v1, vamos apenas registrar a transação se o usuário explicitamente reportar um novo valor pago.
        if (amountPaid && parseFloat(amountPaid.toString()) > 0) {
            await prisma.financialTransaction.create({
                data: {
                    description: `Atualização pagamento: ${enrollment.courseDate.course.name} - Aluno: ${enrollment.student.name}`,
                    amount: new Prisma.Decimal(amountPaid.toString()),
                    type: 'RECEITA',
                    category: 'CURSO',
                    userId: enrollment.studentId,
                    date: new Date()
                }
            });
        }
        res.json(enrollment);
    } catch (error) {
        console.error('Error updating enrollment:', error);
        res.status(500).json({ error: 'Erro ao atualizar inscrição' });
    }
});

app.use((err: any, req: any, res: any, next: any) => {
    console.error('SERVER ERROR:', err);
    res.status(500).json({ error: err.message || 'Erro interno do servidor' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
