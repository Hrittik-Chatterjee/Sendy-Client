import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Users,
  Globe,
  Shield,
  Clock,
  TrendingUp,
  Target,
  Award,
  Heart,
  Zap,
} from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Package,
      title: "Reliable Delivery",
      description:
        "Track your parcels in real-time from pickup to delivery with our advanced tracking system.",
    },
    {
      icon: Clock,
      title: "Fast & Efficient",
      description:
        "Quick turnaround times with optimized routes ensuring your parcels arrive on schedule.",
    },
    {
      icon: Shield,
      title: "Secure Handling",
      description:
        "Your parcels are handled with care and protected throughout the entire delivery process.",
    },
    {
      icon: Globe,
      title: "Wide Coverage",
      description:
        "Extensive delivery network covering multiple locations to serve you better.",
    },
  ];

  const stats = [
    { icon: Package, label: "Parcels Delivered", value: "10,000+" },
    { icon: Users, label: "Happy Customers", value: "5,000+" },
    { icon: Award, label: "Years Experience", value: "5+" },
    { icon: TrendingUp, label: "Success Rate", value: "99%" },
  ];

  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To provide fast, reliable, and affordable parcel delivery services that connect people and businesses seamlessly.",
    },
    {
      icon: Heart,
      title: "Customer First",
      description:
        "We prioritize customer satisfaction by ensuring every parcel is handled with care and delivered with precision.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description:
        "Leveraging cutting-edge technology to streamline the delivery process and enhance user experience.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="outline" className="mb-2">
            About Sendy
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Delivering Excellence,{" "}
            <span className="text-primary">One Parcel at a Time</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Your trusted partner in fast, secure, and reliable parcel delivery
            services. We're committed to connecting people and businesses with
            seamless logistics solutions.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 space-y-2">
                  <Icon className="h-8 w-8 md:h-10 md:w-10 mx-auto text-primary" />
                  <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Why Choose Sendy?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We provide comprehensive parcel delivery solutions tailored to meet
            your needs
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg md:text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm md:text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Values Section */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Our Core Values</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Principles that guide everything we do
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg md:text-xl">{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm md:text-base">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Story Section */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-center">Our Story</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6 text-sm md:text-base">
            <p className="text-muted-foreground leading-relaxed">
              Sendy was founded with a simple yet powerful vision: to make parcel
              delivery accessible, reliable, and stress-free for everyone. What
              started as a small local delivery service has grown into a trusted
              logistics partner serving thousands of customers.
            </p>

            <Separator />

            <div className="space-y-3 md:space-y-4">
              <h3 className="font-semibold text-lg md:text-xl">What We Do</h3>
              <p className="text-muted-foreground leading-relaxed">
                We specialize in providing end-to-end parcel delivery solutions
                for individuals and businesses. Our platform allows you to easily
                send and track parcels, manage deliveries, and ensure your items
                reach their destination safely and on time.
              </p>
            </div>

            <Separator />

            <div className="space-y-3 md:space-y-4">
              <h3 className="font-semibold text-lg md:text-xl">Our Commitment</h3>
              <p className="text-muted-foreground leading-relaxed">
                We're committed to continuous improvement and innovation. By
                investing in technology and training our team, we ensure that
                every parcel receives the attention it deserves. Your trust is our
                most valuable asset, and we work hard every day to earn it.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <Card className="max-w-3xl mx-auto bg-primary text-primary-foreground">
          <CardContent className="py-8 md:py-12 text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              Ready to Send Your Parcel?
            </h2>
            <p className="text-sm md:text-base opacity-90">
              Join thousands of satisfied customers who trust Sendy for their
              delivery needs
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <a
                href="/send-parcel"
                className="inline-flex items-center justify-center rounded-md bg-background text-foreground px-6 py-3 font-medium hover:bg-background/90 transition-colors"
              >
                Send a Parcel
              </a>
              <a
                href="/track"
                className="inline-flex items-center justify-center rounded-md border border-primary-foreground/20 bg-transparent px-6 py-3 font-medium hover:bg-primary-foreground/10 transition-colors"
              >
                Track Parcel
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
