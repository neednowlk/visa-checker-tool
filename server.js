const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    }
});

const visaDatabase = {
    'LM-2024-12345': { status: 'approved', message: 'Your visa application has been approved!' },
    'LM-2024-12346': { status: 'pending', message: 'Your application is currently under review.' },
    'LM-2024-12347': { status: 'denied', message: 'Unfortunately, your application was not approved.' },
    'LM-2024-12348': { status: 'approved', message: 'Congratulations! Your visa has been approved.' },
    'LM-2024-12349': { status: 'pending', message: 'Documents received. Review in progress.' },
};

const leadsFile = path.join(__dirname, 'leads.json');
if (!fs.existsSync(leadsFile)) {
    fs.writeFileSync(leadsFile, JSON.stringify([], null, 2));
}

app.post('/api/check-visa', (req, res) => {
    const { refNumber } = req.body;
    if (!refNumber) return res.status(400).json({ error: 'Reference number required' });
    
    const visaInfo = visaDatabase[refNumber];
    return res.json({
        found: !!visaInfo,
        status: visaInfo?.status || 'pending',
        message: visaInfo?.message || 'Application status: Pending verification.'
    });
});

app.post('/api/leads', async (req, res) => {
    try {
        const { refNumber, fullName, email, phone, visaType, country, status } = req.body;
        
        if (!refNumber || !fullName || !email || !phone || !visaType || !country) {
            return res.status(400).json({ error: 'All fields required' });
        }
        
        const lead = {
            id: Date.now(),
            refNumber, fullName, email, phone, visaType, country,
            status: status || 'pending',
            timestamp: new Date().toISOString(),
            contacted: false
        };
        
        const leads = JSON.parse(fs.readFileSync(leadsFile, 'utf8'));
        leads.push(lead);
        fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));
        
        await sendLeadEmails(lead);
        
        return res.json({ success: true, message: 'Lead captured', lead });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Failed to capture lead' });
    }
});

app.get('/api/leads', (req, res) => {
    try {
        const leads = JSON.parse(fs.readFileSync(leadsFile, 'utf8'));
        return res.json({ success: true, count: leads.length, leads });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch leads' });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Visa Checker API is running' });
});

async function sendLeadEmails(lead) {
    const emailContent = `
        <h2>New Visa Checker Lead</h2>
        <p><strong>Name:</strong> ${lead.fullName}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Phone:</strong> ${lead.phone}</p>
        <p><strong>Reference:</strong> ${lead.refNumber}</p>
        <p><strong>Visa Type:</strong> ${lead.visaType}</p>
        <p><strong>Country:</strong> ${lead.country}</p>
        <p><strong>Status:</strong> ${lead.status}</p>
        <hr>
        <p>Follow up with this lead to convert them into a customer!</p>
    `;
    
    try {
        const emails = [process.env.PERSONAL_EMAIL || 'georgevinoth@hotmail.com'];
        if (process.env.TEAM_EMAIL) emails.push(process.env.TEAM_EMAIL);
        
        for (const email of emails) {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: `🎯 New Visa Checker Lead - ${lead.fullName}`,
                html: emailContent
            });
        }
        console.log('✉️ Emails sent for lead:', lead.id);
    } catch (error) {
        console.error('Error sending emails:', error);
    }
}

app.listen(PORT, () => {
    console.log(`🚀 Visa Checker API running on port ${PORT}`);
});