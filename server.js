const express = require('express');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const INQUIRIES = path.join(DATA_DIR, 'inquiries.jsonl');
app.use(express.json({limit:'200kb'}));
app.use(express.static(__dirname));
function clean(v,max=3000){return String(v||'').trim().slice(0,max)}
function validateEmail(email){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
app.post('/api/contact', async (req,res)=>{
 const lead={id:'VD-'+Date.now(),receivedAt:new Date().toISOString(),name:clean(req.body.name,120),businessType:clean(req.body.businessType,160),phone:clean(req.body.phone,80),email:clean(req.body.email,200),service:clean(req.body.service,160),message:clean(req.body.message,3000)};
 if(!lead.name||!lead.businessType||!lead.phone||!validateEmail(lead.email)||!lead.service)return res.status(400).json({error:'Please complete all required fields with a valid email address.'});
 fs.mkdirSync(DATA_DIR,{recursive:true});fs.appendFileSync(INQUIRIES,JSON.stringify(lead)+'\n',{encoding:'utf8'});
 const smtpReady=process.env.SMTP_HOST&&process.env.SMTP_USER&&process.env.SMTP_PASS&&process.env.OWNER_EMAIL;
 if(smtpReady){const transport=nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:String(process.env.SMTP_SECURE)==='true',auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});const from=process.env.FROM_EMAIL||process.env.SMTP_USER;const ownerText=`New Veltro Digital enquiry\n\nID: ${lead.id}\nName: ${lead.name}\nBusiness type: ${lead.businessType}\nPhone: ${lead.phone}\nEmail: ${lead.email}\nService: ${lead.service}\nMessage: ${lead.message||'-'}\nReceived: ${lead.receivedAt}`;await transport.sendMail({from,to:process.env.OWNER_EMAIL,replyTo:lead.email,subject:`New Veltro Digital enquiry — ${lead.name}`,text:ownerText});await transport.sendMail({from,to:lead.email,subject:'We’ve received your Veltro Digital enquiry',text:`Hi ${lead.name},\n\nThanks for getting in touch with Veltro Digital. We’ve received your enquiry about “${lead.service}”. We’ll respond within 24 hours.\n\nYour reference is ${lead.id}.\n\nVeltro Digital`});}
 res.json({ok:true,id:lead.id,emailSent:Boolean(smtpReady)});
});
app.listen(PORT,()=>console.log(`Veltro Digital site running at http://localhost:${PORT}`));
