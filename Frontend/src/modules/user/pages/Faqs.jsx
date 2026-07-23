import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

const Faqs = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(0); // first item open by default

  const faqs = [
    {
      question: "How long does delivery take?",
      answer: "Standard delivery usually takes 2-3 business days. For express delivery, you will receive your order within 24 hours depending on your location."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is dispatched, you can track it via the 'My Orders' section in your profile. You will also receive an SMS with the tracking link."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 7-day hassle-free return policy for unused and sealed grocery items. Perishable items cannot be returned unless delivered damaged."
    },
    {
      question: "Are there any delivery charges?",
      answer: "Delivery is free for orders above ₹500. For orders below this amount, a standard delivery fee of ₹40 applies."
    },
    {
      question: "How do I cancel my order?",
      answer: "Orders can only be cancelled before they are dispatched. Go to 'My Orders', select the order, and tap the Cancel button if it's available."
    }
  ];

  return (
    <div className="h-[100dvh] bg-[#f8fafc] font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center py-5 px-5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] z-10 sticky top-0">
        <button className="bg-transparent border-none cursor-pointer p-0 flex items-center" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-slate-900" />
        </button>
        <h2 className="text-[17px] font-extrabold m-0 text-slate-900 tracking-tight">Browse FAQs</h2>
        <div className="w-6"></div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-6 pb-24 [&::-webkit-scrollbar]:hidden flex flex-col gap-4">
        
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className={`bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.03)] border transition-colors overflow-hidden ${isOpen ? 'border-[#ea580c]/30 bg-[#fffaf8]' : 'border-slate-100'}`}
            >
              <div 
                className="px-5 py-4 flex justify-between items-center cursor-pointer"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
              >
                <h3 className={`text-[14px] font-bold m-0 ${isOpen ? 'text-[#ea580c]' : 'text-slate-800'}`}>
                  {faq.question}
                </h3>
                <div className={`shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#ea580c]' : 'text-slate-400'}`}>
                  <ChevronDown size={18} />
                </div>
              </div>
              
              {isOpen && (
                <div className="px-5 pb-5 pt-1">
                  <p className="text-[13px] text-slate-600 font-medium leading-relaxed m-0">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
};

export default Faqs;
