# Email Configuration Setup

To enable email verification functionality, you need to configure the following environment variables in your `.env` file:

## Required Environment Variables

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=EventHub <noreply@eventhub.com>

# Frontend URL (for verification links)
FRONTEND_URL=http://localhost:5173
```

## Gmail Setup Instructions

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password as `EMAIL_PASS`

## Alternative Email Services

You can also use other email services by updating the `EMAIL_HOST` and `EMAIL_PORT`:

- **Outlook**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **Custom SMTP**: Use your provider's settings

## Testing

For development, you can use services like:

- **Ethereal Email** (fake SMTP for testing)
- **Mailtrap** (email testing service)

## Environment File Example

Create a `.env` file in the backend directory with:

```env
MONGODB_URI=mongodb://localhost:27017/eventhub
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=EventHub <noreply@eventhub.com>
FRONTEND_URL=http://localhost:5173
PORT=5000
```
