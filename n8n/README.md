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

## DeepSeek AI чатбот gateway

Website дээр DeepSeek API key хадгалахгүй. Website-ийн `/api/chat` route нь n8n webhook рүү
аяллын context болон хэрэглэгчийн message-ийг илгээнэ. n8n workflow нь DeepSeek credential ашиглаад
хариуг буцаана.

Import хийх файл:

```text
n8n/nomadabe-ai-chat-gateway.workflow.json
```

Webhook URL:

```text
https://n8n.srv1143150.hstgr.cloud/webhook/nomadabe-ai-chat
```

Nomadabe `.env.local`:

```bash
N8N_CHAT_WEBHOOK_URL=https://n8n.srv1143150.hstgr.cloud/webhook/nomadabe-ai-chat
N8N_CHAT_WEBHOOK_SECRET=ижил-нууц
N8N_CHAT_MODEL=deepseek-v4-flash
```

n8n env:

```bash
NOMADABE_CHAT_WEBHOOK_SECRET=ижил-нууц
DEEPSEEK_MODEL=deepseek-v4-flash
```

`DeepSeek chat completion` node дээр n8n дээр өмнө үүсгэсэн DeepSeek/httpHeaderAuth credential-ээ
сонгоод workflow-г activate хийнэ.
