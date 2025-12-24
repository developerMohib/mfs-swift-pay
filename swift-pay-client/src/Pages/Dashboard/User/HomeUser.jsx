const cardData = [
  {
    title: "সেন্ড মানি",
    description: "টাকা পাঠান বিকাশ থেকে যেকোনো নাম্বারে, মুহূর্তেই",
    image: "https://www.bkash.com/uploaded_contents/services/home_images/04-payment_1675164341242.webp",
    linkText: "বিস্তারিত জানুন",
  },
  {
    title: "মোবাইল রিচার্জ",
    description: "সব অপারেটরে মোবাইল রিচার্জ করুন সহজেই",
    image: "https://www.bkash.com/uploaded_contents/services/home_images/04-payment_1675164341242.webp",
    linkText: "বিস্তারিত জানুন",
  },
  {
    title: "পেমেন্ট",
    description: "পে করুন হাজারো মার্চেন্টে, নিরাপদে এবং দ্রুত",
    image: "https://www.bkash.com/uploaded_contents/services/home_images/04-payment_1675164341242.webp",
    linkText: "বিস্তারিত জানুন",
  },
  {
    title: "ক্যাশ আউট",
    description: "যেকোনো এজেন্ট থেকে টাকা তুলুন সহজেই",
    image: "https://www.bkash.com/uploaded_contents/services/home_images/04-payment_1675164341242.webp",
    linkText: "বিস্তারিত জানুন",
  },
];

const HomeUser = () => {
  return (
    <section>
    <div className="py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {cardData?.map((card, index) => (
          <div
            key={index}
            className="p-6 rounded-2xl shadow-md text-center transition-transform duration-300 hover:scale-105"
          >
            <img src={card.image} alt={card.title} className="mx-auto mb-4 w-28" />
            <h3 className="text-xl font-bold text-gray-900">{card.title}</h3>
            <p className="text-gray-600 mt-2 text-sm">{card.description}</p>
            <button className="mt-4 text-pink-600 font-semibold hover:underline">
              {card.linkText}
            </button>
          </div>
        ))}
      </div>
    </div>
    </section>
  );
};

export default HomeUser;

