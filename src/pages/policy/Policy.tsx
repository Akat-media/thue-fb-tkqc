import React, { useCallback, useEffect, useState } from 'react';
import BaseHeader from '../../api/BaseHeader';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/index.ts';

interface PolicySection {
  id: string;
  title: string;
  message: string;
  created_at: string;
  updated_at: string;
  country:string
}

interface SubSection {
  id: string;
  title: string;
  content: string;
}
type Content = {
  title:string,
  content:string
}
type Policeis = {
  title:string;
  message: Content[]
}

const Policy: React.FC = () => {
  const [policies, setPolicies] = useState<PolicySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [data, setData] = useState<Policeis[]>([])
  const { t } = useTranslation();

  useEffect(() => {
    fetchPolicies();
  }, [i18n.language]);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await BaseHeader({
        method: 'get',
        url: 'policies',
        params: { lang: i18n.language },
      });
      setPolicies(response.data.data || []);
    } catch (error) {
      console.error('Error fetching policies:', error);
      setPolicies([]);
    } finally {
      setLoading(false);
    }
  };
  const convertMessage = policies.map((policie) => {
    const newMessage = policie.message.split("\n\n")
    const newMessageList: { title: string; content: string; }[] = []
    for(let i = 0; i < newMessage.length ;  i += 2) {
      const title = newMessage[i]?.trim()
      const content = newMessage[i + 1]?.trim()
      newMessageList.push({title, content})
    }
    return {
      ...policie,
      message: newMessageList
    }
  })
  useEffect(() => {
    if (policies.length > 0) { 
      const selectedTitle = policies[activeIndex]?.title;
      const filtered = convertMessage.filter((item) => item.title === selectedTitle);
      setData(filtered);
    }
  }, [activeIndex, policies])
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-blue-900 mb-6">
          {i18n.language === 'en'
            ? 'Policies and Terms'
            : 'Chính Sách và Điều Khoản'}
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* heat */}
            <div className="flex border-b border-blue-200 overflow-x-auto whitespace-nowrap rounded-t-xl bg-white shadow-sm">
              {policies.map((policy, index) => (
                <button
                  key={policy.id}
                  onClick={() => setActiveIndex(index)}
                  className={`px-6 py-4 text-base font-bold transition-colors min-w-max rounded-t-lg ${
                    activeIndex === index
                      ? 'text-blue-900 bg-gradient-to-r from-[#09FFCD] to-[#0AEEFE]'
                      : 'text-gray-600 hover:text-[#1e3a8a]'
                  }`}
                >
                  {policy.title}
                </button>
              ))}
            </div>

            {/* ndung */}
            <div className="bg-white shadow-xl rounded-b-xl p-6 mt-0">
              {policies[activeIndex] && (
                <div className="space-y-6">
                  {data[0]?.message.map((sec, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-10 h-10 flex-shrink-0 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-700 mb-1 leading-snug">
                          {sec.title}
                        </p>
                        <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                          {sec.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Policy;
