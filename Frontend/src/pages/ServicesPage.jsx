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
      title: "Dhiyeesi mana",
      description:"Dhiyeesi safisa fi amanama hanga manati ni kenina. Nuti ajaja keessan kara of eegano qabu fi yeroo isaa eegateen ni raawana.",
      features: [
        
      ]
    },
    {
      icon: PackageSearchIcon,
      title: "Ajaja keessan to'achu",
      description:"Haala mijaata maamiltoni keenya bakka jiran ta'ani ajaja isaani to'achu akka danda'an waan haala mijeesineef bakkuma jirtan teesani ajaja keessan to'achu fi hordofu dandeesu.",
      features: [
        // "Real-time status updates",
        // "SMS and email notifications",
        // "Live location tracking",
        // "Estimated delivery time"
      ]
    },
    {
      icon: HeadphonesIcon,
      title: "Maamiltoota gargaaru",
      description:"Mani daldala meeshalee mana charu maamiltoota isaa guyyaa guutu kallati maraan kan gargaaru fi gargaaru irrati kan argamuudha.",
      features: [
        "Taajajila guuyya guutu ni kenina",
        "Kaaralee qunaamti garagara qabna", 
        "Gaafi keessanif deebi aaritin keenina",
       
      ]
    },
    {
      icon: PackageIcon,
      title: "Ajaaja jilma/Baay'ina",
      description: "Mani daldala meeshalee mana charu namoota dhuunfanis ta'ee gurmuun meeshalee mana fi kanneen biro baay'inaan barbaadaniif dhiyeesu irrati argama.",
      features: [
        // "Volume discounts",
        // "Priority processing",
        // "Flexible payment terms",
        // "Dedicated account manager"
      ]
    },
    {
      icon: UsersIcon,
      title: "Dhiyeesi meeshalee Afoosha",
      description: "Mani daldala meeshalee mana charu Meeshalee guutuu qulqulina isaani eegatan gatii madalawaadhan Afooshalee hawaasa magaala keenya fi naanawa ishee jiraatanif kennu irrati ergamna. Kanaaf haala mijata kanneen armaan gadi uumne ",
      features: [
        "Qooqodani kafalti rawaachuu",
        "Dhiyeesi gatii madalaawa",
        "Meeshalee guutuu iddoo tokkoti ajajachuu",
        "Meeshalee guutuu bakka tokkoti dhiyeesu"
      ]
    },
    {
      icon: RefreshCwIcon,
      title: "Salphaati argachu fi Jijirachu",
      description: "Nuti fedhi maamiltoota keenya  giddu galeessa godhachuun jijiraa meeshalee bilisaan guyyaa 2 keessati taasisna .",
      features: [
        "Jijiraa bilisa guuya 2 keessati ni rawana",
        "Jijiraa meesha meeshaadhan guyyaa 2 keessati ni goona",
        
      ]
    },
    {
      icon: TrendingUpIcon,
      title: "Daldaltoota Biroof",
      description: "Mani daldala meeshalee keenya daldaaltootaf meeshalee mana fi kanneen biro gati madalaawadhan dhiyeesu irrati kan argamuudha.",
      features: [
        // "Competitive commission rates",
        // "Marketing and promotional support",
        // "Dedicated seller dashboard",
        // "Easy product listing",
        // "Secure payment processing",
        // "Business analytics & insights"
      ]
    },
    {
      icon: CreditCardIcon,
      title: "Kafalti qoqoodinsa ",
      description: "Feedhi maamitoota dursa kan godhaate hojatu mani daldala meeshalee mana keenya maamiltootni kafalti isaani qoqoodani akka kafalanif haala mijata uume jira. kafalti guutuu erga rawantani booda meesha akka fudhaatan haala mijata uume jira. ",
      features: [
        // "0% interest available",
        // "Flexible payment terms",
        // "Instant approval process",
        // "No hidden charges",
        // "Pay in 3, 6, or 12 months",
        // "Manage payments easily"
      ]
    },
    {
      icon: GiftIcon,
      title: "Beeksisaati badhafama",
      description: "maati , hiriyootan fi namoota naannoo keessanif oomisha keenya beeksisun badhaafama ta'a.",
      features: [
        
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Tajaajila Keenya</h1>
        <p className="text-lg text-base-content/70">
               Mani daldala meeshalee mana charu tajajila cima mijata hundagaleessa maamiltoota keenya maraaf kenurati kan argamuudha. Kananis hawaasa magaala leemai fi naanawa ishee birati beekamti guddaa kan argatedha. Maaree isinis dhuftani/bakkuma jirtani meeshalee gaha ofi keessanifis ta'ee kennadhaaf nu bira argachuu dandeeesu isinin jedha mani daldala meeshalee mana charu. 
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
    </div>
  );
}

export default ServicesPage;
