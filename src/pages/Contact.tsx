import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("Message sent successfully!", {
        description: "We'll get back to you within 24 hours.",
      });

      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        setIsSubmitted(false);
      }, 3000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "support@sendy.com",
      subtitle: "Send us an email anytime",
    },
    {
      icon: Phone,
      title: "Phone",
      details: "+1 (555) 123-4567",
      subtitle: "Mon-Fri from 8am to 6pm",
    },
    {
      icon: MapPin,
      title: "Office",
      details: "123 Delivery Street, City, ST 12345",
      subtitle: "Visit our office",
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: "Mon - Fri: 8am - 6pm",
      subtitle: "Sat - Sun: 10am - 4pm",
    },
  ];

  const faqs = [
    {
      question: "How long does delivery take?",
      answer:
        "Standard delivery takes 2-3 business days. Express delivery is available for next-day service.",
    },
    {
      question: "How can I track my parcel?",
      answer:
        "Use your tracking ID on our Track Parcel page to get real-time updates on your delivery.",
    },
    {
      question: "What if my parcel is damaged?",
      answer:
        "We offer insurance on all parcels. Contact us immediately and we'll assist with your claim.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Get In <span className="text-primary">Touch</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Have questions? We're here to help. Reach out to us and we'll
            respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12 md:pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <CardContent className="pt-6 space-y-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm text-muted-foreground">
                      {info.title}
                    </h3>
                    <p className="font-medium text-sm md:text-base">
                      {info.details}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {info.subtitle}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12 md:pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  Send Us a Message
                </CardTitle>
                <CardDescription className="text-base">
                  Fill out the form below and we'll get back to you within 24
                  hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting || isSubmitted}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting || isSubmitted}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={isSubmitting || isSubmitted}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="How can we help?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting || isSubmitted}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting || isSubmitted}
                      className="resize-none"
                    />
                  </div>

                  {isSubmitted ? (
                    <div className="flex items-center justify-center gap-2 p-4 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-lg">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-medium">
                        Message sent successfully!
                      </span>
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full sm:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">�</span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>
                  Quick answers to common questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-semibold text-sm md:text-base">
                      {faq.question}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {faq.answer}
                    </p>
                    {index < faqs.length - 1 && (
                      <div className="border-b pt-2" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardContent className="pt-6 space-y-3">
                <h3 className="font-semibold text-lg">Need Immediate Help?</h3>
                <p className="text-sm opacity-90">
                  For urgent inquiries, please call our support line during
                  business hours.
                </p>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() =>
                    toast.info("This is a demo - no actual call will be made")
                  }
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12 md:pb-16">
        <Card className="overflow-hidden">
          <div className="bg-muted/50 h-64 md:h-80 flex items-center justify-center">
            <div className="text-center space-y-2">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground font-medium">
                Map Placeholder
              </p>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto px-4">
                123 Delivery Street, City, ST 12345
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
