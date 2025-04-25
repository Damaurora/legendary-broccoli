import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for contact form submission
  app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    
    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    // In a real app, you'd store the message or send an email
    // For now, we'll just return a success response
    return res.status(200).json({ success: true, message: 'Message received successfully' });
  });

  // API route for newsletter subscription
  app.post('/api/subscribe', (req, res) => {
    const { email } = req.body;
    
    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid email is required' });
    }
    
    // In a real app, you'd store the email in a database
    // For now, we'll just return a success response
    return res.status(200).json({ success: true, message: 'Subscribed successfully' });
  });

  const httpServer = createServer(app);

  return httpServer;
}
