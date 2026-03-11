import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/UI/button';
import { Input } from '@/UI/input';
import { Textarea } from '@/UI/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/UI/select';
import { toast } from 'sonner';
import { appConfig } from '@/Lib/config';

const services = [
  "Brand Identity & Graphic Design",
  "Digital & Media Design",
  "Data Analysis & Visual Insights",
  "Web & Digital Solutions",
  "AI-Assisted Solutions"
];

export default function BookingModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    preferredDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const safeData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        service: formData.service,
        message: formData.message.trim(),
        preferredDate: formData.preferredDate,
      };

      if (!safeData.name || !safeData.email || !safeData.service || !safeData.message) {
        toast.error('Please fill in all required fields.');
        return;
      }

      if (!appConfig.api.bookings) {
        console.warn('No bookings API configured. Running in demo mode.');
      } else {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(appConfig.api.bookings, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(safeData),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('Failed to submit booking');
      }

      setIsSubmitted(true);
      toast.success("Booking request submitted! We'll contact you shortly.");
      
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', phone: '', service: '', message: '', preferredDate: '' });
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error("Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#111118] rounded-3xl border border-white/10 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-purple-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Book a Service</h2>
                  <p className="text-gray-400">Tell us about your project and we'll get back to you soon</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Full Name *</label>
                      <Input
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Email Address *</label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Phone Number</label>
                      <Input
                        type="tel"
                        placeholder="+234 800 000 0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Preferred Date</label>
                      <Input
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Service Type *</label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) => setFormData({ ...formData, service: value })}
                      required
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Project Details *</label>
                    <Textarea
                      placeholder="Tell us about your project, goals, timeline, etc..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[120px] rounded-xl resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || isSubmitted}
                    className={`w-full h-14 rounded-xl text-lg font-medium transition-all duration-300 ${
                      isSubmitted
                        ? 'bg-green-600 hover:bg-green-600'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </div>
                    ) : isSubmitted ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Request Submitted!
                      </div>
                    ) : (
                      <>
                        <Calendar className="w-5 h-5 mr-2" />
                        Submit Booking Request
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

BookingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
