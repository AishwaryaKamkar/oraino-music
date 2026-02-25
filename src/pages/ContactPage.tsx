import React, { useState } from 'react';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner';

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you soon.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Contact Us</h1>
      <p className="text-muted-foreground mb-8">We'd love to hear from you. Reach out with questions, feedback, or partnership inquiries.</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <Mail className="w-6 h-6 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-1">Email</h3>
            <p className="text-sm text-muted-foreground">support@oraino-music.com</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <MessageSquare className="w-6 h-6 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-1">Social Media</h3>
            <p className="text-sm text-muted-foreground">Follow us on Twitter, Instagram, and Facebook for updates.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Message</label>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:ring-2 focus:ring-primary focus:outline-none resize-none"
            />
          </div>
          <button type="submit" className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity">
            <Send className="w-4 h-4" /> Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
