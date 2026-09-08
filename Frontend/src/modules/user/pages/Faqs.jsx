import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Loader2, HelpCircle } from 'lucide-react';
import faqService from '../../../services/faqService';
import { mockFaqs } from '../../admin/mock/adminMockData';

const Faqs = () => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState(mockFaqs);
  const [loading, setLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState(0); // First item open by default

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const res = await faqService.getPublicFaqs();
        if (res && res.success && Array.isArray(res.faqs) && res.faqs.length > 0) {
          setFaqs(res.faqs);
        }
      } catch (err) {
        console.warn('Using default FAQs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex(prev => (prev === index ? -1 : index));
  };

  const customerFaqs = faqs.filter(f => 
    !f.category || 
    f.category === 'Customer' || 
    f.category === 'General' || 
    f.category === 'General (Visible to all)'
  );

  return (
    <div className="h-[100dvh] bg-white font-sans text-slate-800 relative max-w-[480px] mx-auto shadow-[0_0_20px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      
      {/* Clean Top Header */}
      <header className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 bg-white z-10 sticky top-0 shrink-0">
        <button 
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full hover:bg-slate-100 border-none bg-transparent cursor-pointer flex items-center justify-center text-slate-800 transition-colors p-0"
          aria-label="Go Back"
        >
          <ArrowLeft size={19} />
        </button>
        <h1 className="text-[16px] font-extrabold m-0 text-slate-900 tracking-tight">Frequently Asked Questions</h1>
        <div className="w-8"></div>
      </header>

      {/* Simple, Clean Questions List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 pb-16 [&::-webkit-scrollbar]:hidden divide-y divide-slate-100">
        {loading && customerFaqs.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2 text-slate-400">
            <Loader2 size={24} className="animate-spin text-[#ea580c]" />
            <span className="text-xs font-semibold">Loading questions...</span>
          </div>
        ) : customerFaqs.length > 0 ? (
          customerFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq._id || faq.id || index} className="py-3">
                {/* Question Row */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-start justify-between gap-3 text-left bg-transparent border-none cursor-pointer p-0 select-none group"
                >
                  <span className={`text-[13.5px] font-semibold leading-snug transition-colors ${
                    isOpen ? 'text-[#ea580c]' : 'text-slate-800 group-hover:text-slate-900'
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`mt-0.5 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#ea580c]' : 'text-slate-400 group-hover:text-slate-600'
                  }`}>
                    <ChevronDown size={16} />
                  </div>
                </button>

                {/* Answer Content */}
                {isOpen && (
                  <div className="mt-2 pr-4 animate-fadeIn">
                    <p className="text-[12.5px] text-slate-600 font-normal leading-relaxed m-0 select-text">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center text-slate-400">
            <HelpCircle size={32} className="mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-semibold">No questions available at the moment.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Faqs;
