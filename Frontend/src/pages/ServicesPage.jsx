import { 
  TruckIcon, 
  PackageSearchIcon, 
  HeadphonesIcon, 
  PackageIcon,
  UsersIcon,
  RefreshCwIcon,
  TrendingUpIcon,
  CreditCardIcon,
  GiftIcon
} from "lucide-react";

function ServicesPage() {
  const services = [
    {
      icon: TruckIcon,
      title: "Home Delivery",
      description: "Fast and reliable delivery right to your doorstep. We ensure your orders arrive safely and on time.",
      features: [
        "Same-day delivery available",
        "Track your delivery in real-time",
        "Contactless delivery option",
        "Flexible delivery time slots"
      ]
    },
    {
      icon: PackageSearchIcon,
      title: "Order Tracking",
      description: "Stay updated with real-time tracking of your orders from warehouse to your doorstep.",
      features: [
        "Real-time status updates",
        "SMS and email notifications",
        "Live location tracking",
        "Estimated delivery time"
      ]
    },
    {
      icon: HeadphonesIcon,
      title: "Customer Support",
      description: "Our dedicated support team is here to help you 24/7 with any questions or concerns.",
      features: [
        "24/7 customer service",
        "Multiple contact channels",
        "Quick response time",
        "Expert assistance"
      ]
    },
    {
      icon: PackageIcon,
      title: "Bulk Orders",
      description: "Special pricing and handling for bulk orders. Perfect for businesses and large events.",
      features: [
        "Volume discounts",
        "Priority processing",
        "Flexible payment terms",
        "Dedicated account manager"
      ]
    },
    {
      icon: UsersIcon,
      title: "IDIR / Group Orders",
      description: "Organize group orders easily with friends, family, or colleagues and share the benefits.",
      features: [
        "Split payment options",
        "Group discount benefits",
        "Easy order coordination",
        "Single delivery location"
      ]
    },
    {
      icon: RefreshCwIcon,
      title: "Easy Returns & Exchange",
      description: "Hassle-free returns and exchanges within 30 days. Your satisfaction is our priority.",
      features: [
        "30-day return policy",
        "Free return shipping",
        "Quick refund processing",
        "Easy exchange process"
      ]
    },
    {
      icon: TrendingUpIcon,
      title: "Profit Merchant",
      description: "Join our merchant program and start earning by selling products. Grow your business with our platform.",
      features: [
        "Competitive commission rates",
        "Marketing and promotional support",
        "Dedicated seller dashboard",
        "Easy product listing",
        "Secure payment processing",
        "Business analytics & insights"
      ]
    },
    {
      icon: CreditCardIcon,
      title: "Pay in Small Installments",
      description: "Shop now and pay later with our flexible installment plans. No hidden fees, simple and transparent.",
      features: [
        "0% interest available",
        "Flexible payment terms",
        "Instant approval process",
        "No hidden charges",
        "Pay in 3, 6, or 12 months",
        "Manage payments easily"
      ]
    },
    {
      icon: GiftIcon,
      title: "Refer & Earn Rewards",
      description: "Share the love and earn rewards! Refer friends and family to earn exclusive discounts and cashback.",
      features: [
        "Earn rewards for each referral",
        "Get instant cashback",
        "Unlimited referrals",
        "Track your referral earnings",
        "Exclusive bonus rewards",
        "Redeem rewards easily"
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
        <p className="text-lg text-base-content/70">
          We provide comprehensive services to make your shopping experience seamless and enjoyable
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <div 
              key={index}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="card-body">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Icon className="size-10 text-primary" />
                  </div>
                </div>

                {/* Title */}
                <h2 className="card-title text-2xl justify-center mb-3">
                  {service.title}
                </h2>

                {/* Description */}
                <p className="text-center text-base-content/70 mb-4">
                  {service.description}
                </p>

                {/* Features List */}
                <div className="divider"></div>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <svg 
                        className="size-5 text-success mt-0.5 flex-shrink-0" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M5 13l4 4L19 7" 
                        />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="text-center mt-16 p-8 bg-base-100 rounded-box shadow-lg max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Need More Information?</h2>
        <p className="text-base-content/70 mb-6">
          Our customer support team is always ready to help you with any questions about our services
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/contact" className="btn btn-primary">
            Contact Us
          </a>
          <a href="/" className="btn btn-outline">
            Browse Products
          </a>
        </div>
      </div>
    </div>
  );
}

export default ServicesPage;
