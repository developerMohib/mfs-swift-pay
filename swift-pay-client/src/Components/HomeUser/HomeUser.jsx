
const HomeUser = () => {
    const services = [
        {
            title: "পেমেন্ট",
            description: "সারা দেশে অনলাইন এবং QR স্ক্যান করে, সবচেয়ে দ্রুত পেমেন্ট করুন বিকাশ-এ",
            image: "https://www.bkash.com/uploaded_contents/services/home_images/04-payment_1675164341242.webp", // Replace with actual image path
        },
        {
            title: "মোবাইল রিচার্জ",
            description: "রিচার্জ করুন যেকোনো নাম্বারে, সেরা অফারের সাথে",
            image: "https://www.bkash.com/uploaded_contents/services/home_images/02-MR_1675164134643.webp", // Replace with actual image path
        },
        {
            title: "সেন্ড মানি",
            description: "টাকা পাঠান বিকাশ থেকে যেকোনো নাম্বারে, মুহূর্তেই",
            image: "https://www.bkash.com/uploaded_contents/services/home_images/01-send-money_1675164089657.webp", // Replace with actual image path
        },
        {
            title: "ক্যাশ আউট",
            description: "টাকা তুলুন দেশের সবচেয়ে বড় এজেন্ট এবং এটিএম নেটওয়ার্কে",
            image: "https://www.bkash.com/uploaded_contents/services/home_images/03-cashout_1675164155438.webp", // Replace with actual image path
        },
    ];
console.log(services)
    return (
        <div className="bg-pink-50 py-10">
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                
                {/* Card 1 */}
                <div
                    className="bg-white p-6 rounded-2xl shadow-md text-center transition-transform duration-300 hover:scale-105"
                >
                    <img src="https://www.bkash.com/uploaded_contents/services/home_images/04-payment_1675164341242.webp" className="mx-auto mb-4 w-28" />
                    <h3 className="text-xl font-bold text-gray-900">সেন্ড মানি</h3>
                    <p className="text-gray-600 mt-2 text-sm">টাকা পাঠান বিকাশ থেকে যেকোনো নাম্বারে, মুহূর্তেই</p>
                    <button className="mt-4 text-pink-600 font-semibold hover:underline">
                        বিস্তারিত জানুন
                    </button>
                </div>

                {/* Card 2 */}
                <div
                    className="bg-white p-6 rounded-2xl shadow-md text-center transition-transform duration-300 hover:scale-105"
                >
                    <img src="https://www.bkash.com/uploaded_contents/services/home_images/04-payment_1675164341242.webp" className="mx-auto mb-4 w-28" />
                    <h3 className="text-xl font-bold text-gray-900">সেন্ড মানি</h3>
                    <p className="text-gray-600 mt-2 text-sm">টাকা পাঠান বিকাশ থেকে যেকোনো নাম্বারে, মুহূর্তেই</p>
                    <button className="mt-4 text-pink-600 font-semibold hover:underline">
                        বিস্তারিত জানুন
                    </button>
                </div>
                
                {/* Card 3 */}
                <div
                    className="bg-white p-6 rounded-2xl shadow-md text-center transition-transform duration-300 hover:scale-105"
                >
                    <img src="https://www.bkash.com/uploaded_contents/services/home_images/04-payment_1675164341242.webp" className="mx-auto mb-4 w-28" />
                    <h3 className="text-xl font-bold text-gray-900">সেন্ড মানি</h3>
                    <p className="text-gray-600 mt-2 text-sm">টাকা পাঠান বিকাশ থেকে যেকোনো নাম্বারে, মুহূর্তেই</p>
                    <button className="mt-4 text-pink-600 font-semibold hover:underline">
                        বিস্তারিত জানুন
                    </button>
                </div>

                {/* Card 4 */}
                <div
                    className="bg-white p-6 rounded-2xl shadow-md text-center transition-transform duration-300 hover:scale-105"
                >
                    <img src="https://www.bkash.com/uploaded_contents/services/home_images/04-payment_1675164341242.webp" className="mx-auto mb-4 w-28" />
                    <h3 className="text-xl font-bold text-gray-900">সেন্ড মানি</h3>
                    <p className="text-gray-600 mt-2 text-sm">টাকা পাঠান বিকাশ থেকে যেকোনো নাম্বারে, মুহূর্তেই</p>
                    <button className="mt-4 text-pink-600 font-semibold hover:underline">
                        বিস্তারিত জানুন
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomeUser;
