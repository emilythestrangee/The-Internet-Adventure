import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Mail, Key, Share2, AlertCircle, Check, RefreshCw } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-800">
      
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-100 mb-6">
            About Universal Acceptance
          </h1>
          
          <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">
                What is Universal Acceptance?
              </h2>
              
              <p className="text-gray-400 mb-4">
                Universal Acceptance (UA) is the concept that all domain names and email addresses should work in all software applications, regardless of the script, language, or character length.
              </p>
              
              <p className="text-gray-400 mb-4">
                With the expansion of the domain name system to include internationalized domain names (IDNs) and new generic top-level domains (gTLDs), many applications still don't properly handle these new domains.
              </p>
              
              <div className="flex items-center p-4 bg-indigo-800 rounded-lg mb-4">
                <div className="mr-4 flex-shrink-0">
                  <Globe className="h-8 w-8 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-indigo-300">The Goal of UA</h3>
                  <p className="text-indigo-200">
                    To ensure everyone can experience the internet in their own language, from address bar to application.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">
                Why Universal Acceptance Matters
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-800 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <Mail className="h-6 w-6 text-green-400 mr-2" />
                    <h3 className="text-lg font-medium text-green-300">Inclusion</h3>
                  </div>
                  <p className="text-green-200">
                    Allows people to use the internet in their native language and script, breaking down barriers to access.
                  </p>
                </div>
                
                <div className="bg-blue-800 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <Key className="h-6 w-6 text-blue-400 mr-2" />
                    <h3 className="text-lg font-medium text-blue-300">Opportunity</h3>
                  </div>
                  <p className="text-blue-200">
                    Opens new markets and creates business opportunities by serving users in their preferred language.
                  </p>
                </div>
                
                <div className="bg-purple-800 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <Share2 className="h-6 w-6 text-purple-400 mr-2" />
                    <h3 className="text-lg font-medium text-purple-300">Innovation</h3>
                  </div>
                  <p className="text-purple-200">
                    Drives technical innovation and global interoperability in internet applications.
                  </p>
                </div>
                
                <div className="bg-amber-800 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <AlertCircle className="h-6 w-6 text-amber-400 mr-2" />
                    <h3 className="text-lg font-medium text-amber-300">Equity</h3>
                  </div>
                  <p className="text-amber-200">
                    Creates a more equitable internet where language is not a barrier to full participation.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">
                Key Components of Universal Acceptance
              </h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-100 mb-3">
                  UA-Readiness Means:
                </h3>
                
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <span className="ml-2 text-gray-300">
                      <strong>Accepting</strong> all domain names and email addresses as input
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <span className="ml-2 text-gray-300">
                      <strong>Validating</strong> them according to current standards
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <span className="ml-2 text-gray-300">
                      <strong>Processing</strong> them to ensure usability
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <span className="ml-2 text-gray-300">
                      <strong>Storing</strong> them correctly in databases and other systems
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <span className="ml-2 text-gray-300">
                      <strong>Displaying</strong> them to users in a meaningful way
                    </span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-100 mb-2">
                  The Two Main Technical Components:
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-800 rounded border border-gray-600">
                    <h4 className="font-medium text-indigo-400 mb-1">
                      Internationalized Domain Names (IDNs)
                    </h4>
                    <p className="text-sm text-gray-300">
                      Domain names with non-ASCII characters, such as "例子.测试" or "пример.рф"
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gray-800 rounded border border-gray-600">
                    <h4 className="font-medium text-indigo-400 mb-1">
                      Email Address Internationalization (EAI)
                    </h4>
                    <p className="text-sm text-gray-300">
                      Email addresses with non-ASCII characters in the local part or domain, like "用户@例子.公司"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">
                How You Can Help
              </h2>
              
              <div className="bg-indigo-800 p-4 rounded-lg mb-6">
                <div className="flex items-center mb-2">
                  <RefreshCw className="h-6 w-6 text-indigo-400 mr-2" />
                  <h3 className="text-lg font-medium text-indigo-300">Take Action</h3>
                </div>
                <ul className="space-y-2 text-indigo-200">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="ml-2">
                      Test your applications and websites for UA compliance
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="ml-2">
                      Update your code to support IDNs and EAIs
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="ml-2">
                      Report UA issues when you encounter them
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="ml-2">
                      Spread awareness about Universal Acceptance
                    </span>
                  </li>
                </ul>
              </div>
              
              <p className="text-gray-400 italic">
                "The internet should be for everyone. Universal Acceptance ensures that people around the world can use the internet in their own language and script."
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
