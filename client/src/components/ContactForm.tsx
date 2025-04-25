import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill out all fields.",
        variant: "destructive"
      });
      return;
    }

    // Here you would normally send the data to the server
    // For now, we'll just show a success toast
    toast({
      title: "Message Sent",
      description: "Thank you for your message. We will get back to you soon!",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };

  return (
    <div className="bg-white p-8 shadow-lg">
      <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-2">Your Name</label>
          <input 
            type="text" 
            id="name" 
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-[#FF0000]" 
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
          <input 
            type="email" 
            id="email" 
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-[#FF0000]" 
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="subject" className="block text-gray-700 mb-2">Subject</label>
          <select 
            id="subject" 
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-[#FF0000]"
          >
            <option value="" disabled>Please select</option>
            <option value="inquiry">Product Inquiry</option>
            <option value="order">Place an Order</option>
            <option value="custom">Custom Fabrication</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label htmlFor="message" className="block text-gray-700 mb-2">Your Message</label>
          <textarea 
            id="message" 
            rows={5} 
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-[#FF0000]"
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-black text-white py-3 hover:bg-[#FF0000] transition-colors duration-300"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
