import { Asterisk, Banknote, BrushCleaning, Shield } from "lucide-react";
import { SpinningText } from "@/components/common/SpinningText";

const Security = () => {
  const features = [
    {
      title: "Payment System",
      description:
        "The robotic algorithmic payment system automatically validates and performs transactions.",
      icon: <Banknote size={18} />,
    },
    {
      title: "Wallet Protection",
      description:
        "Your money is stored in cold wallets, but withdrawals are instant.",
      icon: <Shield size={18} />,
    },
    {
      title: "Password Protection",
      description:
        "We don't store passwords but automatically check if your password has been compromised.",
      icon: <Asterisk size={18} />,
    },
    {
      title: "Cleanliness check",
      description:
        "All cryptocurrencies available on the exchange undergo cleanliness checks. Suspicious transactions are rejected.",
      icon: <BrushCleaning size={18} />,
    },
  ];

  return (
    <section className="relative rounded-lg py-4 px-6 w-full border border-border">
      <div className="">
        <h3 className="font-bold text-4xl mb-4 my-2">Trade safely with us</h3>
        <h4 className="mb-4 text-current/50">Safety and security is the key</h4>
      </div>
      <div className="flex items-end gap-6 max-md:flex-col max-md:items-center my-8">
        <div className="p-4">
          <div className="relative group size-60 border rounded-full shrink-0 p-8 hover:bg-accent/20 hover:border-accent transition-colors">
            <SpinningText
              duration={30}
              radius={14}
              className="absolute top-1/2 text-xs group-hover:text-accent"
            >
              0 • 10 • 20 • 30 • 40 • 50 • 60 • 70 • 80 • 90 •
            </SpinningText>
            <SpinningText
              duration={30}
              radius={16}
              className="absolute top-1/2 text-xs group-hover:text-accent"
            >
              | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | |
              | | | | | | |
            </SpinningText>
            <div className="relative flex items-center justify-center size-full border rounded-full shrink-0 p-2 bg-background group-hover:border-accent">
              <div className="absolute bg-white -top-1 w-px h-3 group-hover:bg-accent" />
              <div className="flex items-center justify-center size-full border-4 group-hover:border-accent rounded-full shrink-0 group-hover:bg-linear-to-br group-hover:shadow-[0px_0px_30px_0px_#000] group-hover:from-accent group-hover:to-transparent transition-colors">
                <Shield className="size-8" />
              </div>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div className="flex flex-col" key={feature.title}>
              <div className="flex gap-2 items-center">
                {feature.icon}
                <h4 className="font-bold">{feature.title}</h4>
              </div>
              <p className="font-light opacity-80 leading-tight">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Security;
