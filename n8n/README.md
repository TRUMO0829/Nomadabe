# Nomadabe n8n workflow

`nomadabe-verification-code.workflow.json` нь шинэ хэрэглэгчийн и-мэйл эсвэл утас руу баталгаажуулах код илгээх workflow.

## Import хийх

1. n8n рүү нэвтэрнэ.
2. Workflows -> Import from file.
3. `n8n/nomadabe-verification-code.workflow.json` файлыг сонгоно.
4. Environment variables тохируулна:

```env
NOMADABE_WEBHOOK_SECRET=ижил-нууц
RESEND_API_KEY=...
MAIL_FROM=Nomadabe Travel <hello@domain.mn>
SMS_API_URL=...
SMS_API_KEY=...
```

5. Workflow-г active болгоно.
6. Nomadabe `.env.local` дээр:

```env
N8N_VERIFICATION_WEBHOOK_URL=https://n8n.srv1143150.hstgr.cloud/webhook/nomadabe-verification-code
N8N_VERIFICATION_WEBHOOK_SECRET=ижил-нууц
```

n8n API key өгвөл энэ файлыг API-аар шууд server дээр үүсгэж болно.
