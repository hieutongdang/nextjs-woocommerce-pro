export default function HeroBanner() {
  return (
    <section className="w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* Main Banner */}
      <div className="lg:col-span-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl flex flex-col md:flex-row items-center p-8 min-h-[320px] relative overflow-hidden shadow-sm">
        <div className="flex-1 z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Pure Coffee<br />Big discount</h2>
          <p className="text-lg text-gray-700 mb-6">Save up to 50% on your first order</p>
          <form className="flex max-w-md">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-2 rounded-l-md border border-gray-200 focus:outline-none"
            />
            <button type="submit" className="px-6 py-2 bg-primary text-white rounded-r-md font-semibold hover:bg-primary/90 transition">Subscribe</button>
          </form>
        </div>
        <div className="flex-1 flex justify-end items-end z-10">
          <img
            src="/mock/coffee-banner.png"
            alt="Coffee Promo"
            className="w-48 md:w-64 lg:w-80 object-contain drop-shadow-xl"
          />
        </div>
        {/* Decorative BG */}
        <div className="absolute inset-0 bg-[url('/mock/hero-bg.svg')] bg-no-repeat bg-right-bottom opacity-10 pointer-events-none" />
      </div>

      {/* Side Banners */}
      <div className="flex flex-col gap-6">
        <div className="bg-yellow-50 rounded-2xl flex items-center p-6 min-h-[150px] shadow-sm">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-yellow-900 mb-2">Delivered to your home</h3>
            <a href="/products" className="text-primary font-semibold hover:underline">Shop now</a>
          </div>
          <img src="/mock/juice.png" alt="Juice" className="w-20 h-20 object-contain" />
        </div>
        <div className="bg-orange-50 rounded-2xl flex items-center p-6 min-h-[150px] shadow-sm">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-orange-900 mb-2">Fresh & Organic</h3>
            <a href="/products" className="text-primary font-semibold hover:underline">Shop now</a>
          </div>
          <img src="/mock/orange.png" alt="Orange" className="w-20 h-20 object-contain" />
        </div>
      </div>
    </section>
  );
} 