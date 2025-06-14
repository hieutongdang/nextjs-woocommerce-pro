import PromoCard from './PromoCard';
import { FaLeaf, FaUtensils, FaShoppingBasket } from 'react-icons/fa';

export default function PromoCardsSection() {
  return (
    <section className="w-full max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-8">
      <PromoCard
        title="Everyday Fresh & Clean"
        description="With Our Products"
        buttonText="Shop now"
        href="/products"
        icon={<FaLeaf className="text-primary" />}
        bgColor="bg-primary/10"
      />
      <PromoCard
        title="Make your Breakfast Healthy and Easy"
        description="Start your day with our best picks."
        buttonText="Shop now"
        href="/products"
        icon={<FaUtensils className="text-yellow-500" />}
        bgColor="bg-yellow-50"
      />
      <PromoCard
        title="The best Organic Products Online"
        description="Fresh, organic, and delivered to your door."
        buttonText="Shop now"
        href="/products"
        icon={<FaShoppingBasket className="text-orange-500" />}
        bgColor="bg-orange-50"
      />
    </section>
  );
} 