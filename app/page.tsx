import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  Store,
  CheckCircle2,
  ArrowRight,
  LayoutGrid,
  MessageSquare,
  Users,
  BarChart3,
  ShieldCheck,
  Smartphone,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Globe,
} from "lucide-react";

export default async function LandingPage() {
  // 1. FETCH PLANS DYNAMICALLY
  const plansRaw = await prisma.subscriptionPlan.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
  });

  // Convert Decimals to Numbers to prevent serialization issues
  const plans = plansRaw.map((plan) => ({
    ...plan,
    price: Number(plan.price),
  }));
  return (
    <div
      className="min-h-screen bg-white font-sans selection:bg-blue-100"
      suppressHydrationWarning
    >
      {/* --- NAVIGATION --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Store className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                ASSAN<span className="text-blue-600">ECOMMERCE</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                About
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                Contact
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden md:inline-flex px-5 py-2.5 text-sm font-medium text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-all"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="relative z-10">
              <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
                #1 Ecommerce SaaS for Pakistan
              </span>
              <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Manage your store <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  smarter
                </span>
                , not harder.
              </h1>
              <p className="text-lg text-gray-500 mb-8 pr-10 leading-relaxed">
                The all-in-one digital companion for modern merchants. Track
                orders, manage inventory, and handle customer accounts via
                WhatsApp with pixel-perfect precision.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-xl hover:bg-blue-700 hover:shadow-blue-300 transition-all transform hover:-translate-y-1"
                >
                  Start Free Trial
                </Link>
                <a
                  href="#features"
                  className="px-8 py-4 bg-white text-gray-700 border border-gray-200 font-bold rounded-xl hover:bg-gray-50 transition-all"
                >
                  View Features
                </a>
              </div>

              <div className="mt-8 flex items-center gap-6 text-sm font-medium text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Cloud Based</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Multi-Tenant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Secure</span>
                </div>
              </div>
            </div>

            {/* Hero Image / Mockup */}
            <div className="relative">
              {/* Decorative Blob */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-full blur-3xl -z-10"></div>

              <div className="relative mx-auto w-full max-w-[500px]">
                {/* Main Dashboard Mockup Representation */}
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden relative aspect-[4/3] group">
                  <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-400 font-medium">
                        Interactive Dashboard Mockup
                      </p>
                    </div>
                  </div>

                  {/* Overlay Content to make it look real */}
                  <div className="absolute top-0 left-0 w-full h-16 border-b border-gray-100 bg-white flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                </div>

                {/* Floating Badge 1 */}
                <div className="absolute -left-8 top-20 bg-white p-4 rounded-xl shadow-xl border border-gray-100 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg text-green-600">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">
                        New Order
                      </p>
                      <p className="font-bold text-gray-900">via WhatsApp</p>
                    </div>
                  </div>
                </div>

                {/* Floating Badge 2 */}
                <div className="absolute -right-8 bottom-20 bg-white p-4 rounded-xl shadow-xl border border-gray-100 animate-float-delayed">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">
                        Revenue
                      </p>
                      <p className="font-bold text-gray-900">+24.5% Today</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-1">
                500+
              </h2>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Stores Powered
              </p>
            </div>
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-1">
                10k+
              </h2>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Orders Processed
              </p>
            </div>
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-1">
                99.9%
              </h2>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                System Uptime
              </p>
            </div>
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-1">
                24/7
              </h2>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Expert Support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">
              Core Capabilities
            </span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4">
              Everything you need to <br /> run a{" "}
              <span className="text-blue-600">Elite Business</span>
            </h2>
            <p className="text-lg text-gray-500">
              Powerful tools designed to help you sell more and manage less.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={LayoutGrid}
              title="Order Management"
              description="Visual grid to monitor incoming, processing, and delivered orders in real-time with one-click actions."
            />
            <FeatureCard
              icon={Smartphone}
              title="Inventory & POS"
              description="Integrated inventory system. Track stock levels automatically as sales happen across channels."
            />
            <FeatureCard
              icon={Users}
              title="Customer CRM"
              description="Go paperless with digital customer profiles, order history, and automated purchase alerts."
            />
            <FeatureCard
              icon={BarChart3}
              title="Business Analytics"
              description="Detailed reports on revenue, peak sales hours, and top-selling products to help you grow faster."
            />
            <FeatureCard
              icon={MessageSquare}
              title="WhatsApp Automation"
              description="Allow customers to order via WhatsApp. Our bot handles the basics so you can focus on fulfillment."
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Staff Control"
              description="Role-based access for Owners, Managers, and Staff. Track every login and action for total accountability."
            />
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-400 font-bold tracking-wider uppercase text-sm">
              Transparent Pricing
            </span>
            <h2 className="text-4xl font-extrabold mt-2 mb-4">
              Simple plans for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                every stage
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              No hidden fees. Scale as your business grows.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
            {plans.map((plan) => {
              const isPopular = plan.isPopular;
              const price = Number(plan.price);

              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-8 border relative ${
                    isPopular
                      ? "bg-white text-gray-900 border-blue-500 transform scale-105 shadow-2xl z-10"
                      : "bg-gray-800 border-gray-700 text-white"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                      Most Popular
                    </div>
                  )}

                  <h5
                    className={`text-lg font-bold uppercase tracking-wider ${isPopular ? "text-blue-600" : "text-gray-400"}`}
                  >
                    {plan.name}
                  </h5>

                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold">
                      {price === 0 ? "Free" : `Rs ${price.toLocaleString()}`}
                    </span>
                    {price > 0 && (
                      <span
                        className={`ml-2 font-medium ${isPopular ? "text-gray-500" : "text-gray-400"}`}
                      >
                        /mo
                      </span>
                    )}
                  </div>

                  <p
                    className={`mt-2 text-sm ${isPopular ? "text-gray-500" : "text-gray-400"}`}
                  >
                    {plan.description}
                  </p>

                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, i) => (
                      <PricingCheck key={i} text={feature} dark={isPopular} />
                    ))}
                  </ul>

                  <Link
                    href="/register"
                    className={`mt-8 block w-full py-3 px-4 rounded-xl font-bold text-center transition-all ${
                      isPopular
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                        : "bg-transparent border border-gray-600 hover:bg-gray-700"
                    }`}
                  >
                    {price === 0 ? "Start Free" : `Choose ${plan.name}`}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-5">
              <div className="bg-blue-900 rounded-3xl p-10 text-white h-full shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <span className="inline-block py-1 px-3 rounded-lg bg-white/10 text-blue-200 text-xs font-bold uppercase tracking-wider mb-6">
                    Get in Touch
                  </span>
                  <h2 className="text-3xl font-extrabold mb-6">
                    Let's Digitalize Your Business
                  </h2>
                  <p className="text-blue-100 mb-10 leading-relaxed">
                    Send us a query and our professional team will contact you
                    within 24 hours.
                  </p>

                  <div className="space-y-6">
                    <ContactItem
                      icon={Phone}
                      label="PHONE"
                      value="+92 300 1234567"
                    />
                    <ContactItem
                      icon={Mail}
                      label="EMAIL"
                      value="support@assan.com"
                    />
                    <ContactItem
                      icon={MapPin}
                      label="OFFICE"
                      value="Blue Area, Islamabad, Pakistan"
                    />
                  </div>
                </div>

                {/* Decor */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600 rounded-full opacity-20 blur-3xl"></div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Send Message
                </h3>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Query
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Tell us more..."
                    ></textarea>
                  </div>
                  <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <Store className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-extrabold text-gray-900">
                  ASSAN
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Empowering Pakistani merchants with advanced ecommerce
                technology. Assan is the future of retail operations.
              </p>
              <div className="flex gap-4">
                <SocialIcon icon={Facebook} />
                <SocialIcon icon={Instagram} />
                <SocialIcon icon={Linkedin} />
                <SocialIcon icon={Globe} />
              </div>
            </div>

            <div>
              <h5 className="font-bold text-gray-900 mb-6">Company</h5>
              <ul className="space-y-4 text-sm text-gray-500">
                <li>
                  <a href="#" className="hover:text-blue-600">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Our Team
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-gray-900 mb-6">Product</h5>
              <ul className="space-y-4 text-sm text-gray-500">
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600">
                    API Status
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-gray-900 mb-6">Contact</h5>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-600 shrink-0" />
                  <span>Blue Area, Islamabad</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-600 shrink-0" />
                  <span>+92 300 1234567</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-600 shrink-0" />
                  <span>info@assan.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} <strong>Assan Ecommerce</strong>
              . All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

function PricingCheck({
  text,
  dark = false,
}: {
  text: string;
  dark?: boolean;
}) {
  return (
    <li className="flex items-center gap-3">
      <CheckCircle2
        className={`h-5 w-5 ${dark ? "text-blue-600" : "text-green-400"}`}
      />
      <span className={dark ? "text-gray-600" : "text-gray-300"}>{text}</span>
    </li>
  );
}

function ContactItem({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs text-blue-300 font-bold opacity-70 mb-0.5">
          {label}
        </div>
        <div className="font-bold text-lg">{value}</div>
      </div>
    </div>
  );
}

function SocialIcon({ icon: Icon }: { icon: any }) {
  return (
    <a
      href="#"
      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-blue-600 hover:text-white transition-all"
    >
      <Icon className="h-5 w-5" />
    </a>
  );
}
