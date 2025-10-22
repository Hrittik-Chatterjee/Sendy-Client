import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Package,
  MapPin,
  Clock,
  Shield,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Search,
  Truck,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

const Home = () => {
  const [trackingId, setTrackingId] = useState("");
  const navigate = useNavigate();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      navigate(`/track/${trackingId}`);
    }
  };

  const features = [
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "Express shipping options to get your parcels delivered quickly and efficiently.",
    },
    {
      icon: Shield,
      title: "Secure & Safe",
      description: "Your parcels are insured and handled with maximum care throughout delivery.",
    },
    {
      icon: MapPin,
      title: "Real-time Tracking",
      description: "Track your parcel's journey in real-time from pickup to delivery.",
    },
    {
      icon: Package,
      title: "Easy Booking",
      description: "Simple and intuitive booking process to send your parcels hassle-free.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Book Your Delivery",
      description: "Enter pickup and delivery details with just a few clicks.",
      icon: Package,
    },
    {
      number: "02",
      title: "We Pick It Up",
      description: "Our courier collects your parcel from your doorstep.",
      icon: Truck,
    },
    {
      number: "03",
      title: "Track in Real-time",
      description: "Monitor your parcel's journey with live updates.",
      icon: MapPin,
    },
    {
      number: "04",
      title: "Safe Delivery",
      description: "Your parcel arrives safely at the destination.",
      icon: CheckCircle2,
    },
  ];

  const stats = [
    { icon: Package, value: "10,000+", label: "Parcels Delivered" },
    { icon: Users, value: "5,000+", label: "Happy Customers" },
    { icon: Truck, value: "50+", label: "Active Couriers" },
    { icon: TrendingUp, value: "99%", label: "Success Rate" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 md:space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                  Fast & Reliable{" "}
                  <span className="text-primary">Parcel Delivery</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                  Send and receive parcels with ease. Track in real-time,
                  delivered with care. Your trusted logistics partner.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Button
                  size="lg"
                  className="text-base md:text-lg h-12 md:h-14 px-6 md:px-8"
                  onClick={() => navigate("/register")}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base md:text-lg h-12 md:h-14 px-6 md:px-8"
                  onClick={() => navigate("/about")}
                >
                  Learn More
                </Button>
              </div>

              {/* Quick Track */}
              <Card className="max-w-xl">
                <CardContent className="pt-6">
                  <form onSubmit={handleTrack} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-semibold">Track Your Parcel</h3>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter tracking ID..."
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit">Track</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right Content - Illustration/Image Area */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-primary/5 rounded-full blur-3xl" />
                <div className="relative grid grid-cols-2 gap-4">
                  <Card className="hover:shadow-lg transition-all hover:-translate-y-2">
                    <CardContent className="pt-6 text-center space-y-2">
                      <Clock className="h-10 w-10 mx-auto text-primary" />
                      <p className="font-semibold">Fast Delivery</p>
                      <p className="text-2xl font-bold">24hrs</p>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-lg transition-all hover:-translate-y-2 mt-8">
                    <CardContent className="pt-6 text-center space-y-2">
                      <Shield className="h-10 w-10 mx-auto text-primary" />
                      <p className="font-semibold">Secure</p>
                      <p className="text-2xl font-bold">100%</p>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-lg transition-all hover:-translate-y-2">
                    <CardContent className="pt-6 text-center space-y-2">
                      <MapPin className="h-10 w-10 mx-auto text-primary" />
                      <p className="font-semibold">Tracking</p>
                      <p className="text-2xl font-bold">Live</p>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-lg transition-all hover:-translate-y-2 mt-8">
                    <CardContent className="pt-6 text-center space-y-2">
                      <Package className="h-10 w-10 mx-auto text-primary" />
                      <p className="font-semibold">Parcels</p>
                      <p className="text-2xl font-bold">10k+</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center space-y-2 p-4 rounded-lg hover:bg-background transition-colors"
                >
                  <Icon className="h-8 w-8 md:h-10 md:w-10 mx-auto text-primary" />
                  <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Why Choose Sendy?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience hassle-free parcel delivery with our comprehensive
              features
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple steps to send your parcel
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-5xl md:text-6xl font-bold text-primary/20">
                          {step.number}
                        </span>
                        <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary-foreground" />
                        </div>
                      </div>
                      <CardTitle className="text-lg md:text-xl">
                        {step.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm md:text-base">
                        {step.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="h-8 w-8 text-primary/30" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
            <CardContent className="py-12 md:py-16 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                Ready to Send Your First Parcel?
              </h2>
              <p className="text-base md:text-lg opacity-90 max-w-2xl mx-auto">
                Join thousands of satisfied customers and experience seamless
                parcel delivery today
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-base md:text-lg h-12 md:h-14 px-6 md:px-8"
                  onClick={() => navigate("/register")}
                >
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base md:text-lg h-12 md:h-14 px-6 md:px-8 bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={() => navigate("/track")}
                >
                  Track Parcel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
