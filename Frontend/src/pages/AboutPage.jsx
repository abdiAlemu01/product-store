import { 
  BookOpenIcon, 
  TargetIcon, 
  CheckCircleIcon, 
  ShieldCheckIcon,
  UsersIcon,
  TruckIcon,
  CreditCardIcon,
  GiftIcon
} from "lucide-react";

function AboutPage() {
  const sections = [
    {
      icon: BookOpenIcon,
      title: "Our Story",
      description: "We started our business to make quality products accessible to local communities through reliable delivery, fair pricing, and excellent customer service.",
      color: "text-blue-500"
    },
    {
      icon: TargetIcon,
      title: "Our Mission",
      description: "To provide affordable, trusted, and convenient shopping experiences for every customer.",
      color: "text-green-500"
    },
    {
      icon: CheckCircleIcon,
      title: "Why Choose Us",
      features: [
        "Quality-checked products",
        "Fast delivery",
        "Customer-first support",
     
      ],
      color: "text-purple-500"
    },
    {
      icon: ShieldCheckIcon,
      title: "Our Quality Promise",
      description: "Every product is checked before delivery to ensure it meets our quality standards.",
      color: "text-orange-500"
    },
    {
      icon: UsersIcon,
      title: "Community Support",
      description: "We work with local suppliers and businesses to strengthen our community economy.",
      features: [
        "Supporting local producers",
        "Promoting local merchants",
        "Creating opportunities for small businesses"
      ],
      color: "text-teal-500"
    },
    {
      icon: TruckIcon,
      title: "Our Delivery Commitment",
      description: "We strive to deliver orders quickly, safely, and reliably.",
      color: "text-indigo-500"
    },
    {
      icon: CreditCardIcon,
      title: "Flexible Payment Options",
      features: [
        "Cash on Delivery",
        "Installment Plans",
        "Mobile Payments"
      ],
      color: "text-pink-500"
    },
    {
      icon: GiftIcon,
      title: "Loyalty & Rewards",
      description: "Regular customers receive exclusive offers, discounts, and rewards.",
      color: "text-yellow-500"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
        <p className="text-lg text-base-content/70">
          Learn more about our company, mission, and commitment to serving you better
        </p>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <div 
              key={index}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="card-body">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Icon className={`size-10 ${section.color}`} />
                  </div>
                </div>

                {/* Title */}
                <h2 className="card-title text-2xl justify-center mb-3">
                  {section.title}
                </h2>

                {/* Description */}
                {section.description && (
                  <p className="text-center text-base-content/70 mb-4">
                    {section.description}
                  </p>
                )}

                {/* Features List */}
                {section.features && (
                  <>
                    <div className="divider"></div>
                    <ul className="space-y-2">
                      {section.features.map((feature, idx) => (
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
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="text-center mt-16 p-8 bg-base-100 rounded-box shadow-lg max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
        <p className="text-base-content/70 mb-6">
          Experience the difference of shopping with a company that truly cares about quality, 
          community, and customer satisfaction
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/" className="btn btn-primary">
            Start Shopping
          </a>
          <a href="/contact" className="btn btn-outline">
            Contact Us
          </a>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats stats-vertical lg:stats-horizontal shadow mt-16 w-full max-w-4xl mx-auto">
        <div className="stat">
          <div className="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </div>
          <div className="stat-title">Happy Customers</div>
          <div className="stat-value text-primary">10K+</div>
          <div className="stat-desc">Growing every day</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div className="stat-title">Products Delivered</div>
          <div className="stat-value text-secondary">50K+</div>
          <div className="stat-desc">Fast & reliable</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-accent">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
            </svg>
          </div>
          <div className="stat-title">Local Partners</div>
          <div className="stat-value text-accent">100+</div>
          <div className="stat-desc">Supporting community</div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
