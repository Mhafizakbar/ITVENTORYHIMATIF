import React, { useState } from 'react';
import { X, Github, Linkedin, Mail, Users, Code, Heart } from 'lucide-react';

const ContributorSection = () => {
  const [selectedContributor, setSelectedContributor] = useState(null);

  const contributors = [
    {
      id: 1,
      name: "M. Hafiz Akbar",
      role: "Full Stack Developer",
      image: "/Hafiz.jpg",
      description: "Bertanggung jawab dalam pengembangan frontend dan backend aplikasi inventaris HIMATIF. Memiliki pengalaman dalam membangun aplikasi web modern dengan teknologi terkini.",
      skills: ["React", "Node.js", "JavaScript", "UI/UX Design", "PosgreSQL", "Hono", "typeScript"],
      github: "https://github.com/Mhafizakbar",
      linkedin: "https://www.linkedin.com/in/m-hafiz-akbar-6aa2b6351/",
      email: "hafizakbar5707@gmail.com"
    },
    {
      id: 2,
      name: "Alya Chalta Theopania",
      role: "Frontend Developer",
      image: "/Alya.jpg",
      description: "Mengembangkan frontend aplikasi inventaris HIMATIF dengan React dan Tailwind CSS. Spesialis dalam menciptakan pengalaman pengguna yang optimal dan desain yang menarik.",
      skills: ["Node.js", "Express", "Rect", "Tailwind Css", "Figma"],
      github: "https://github.com/AlyaaChaltaTheopania",
      linkedin: "https://linkedin.com",
      email: "Alya.chalta@gmail.com"
    },
    {
      id: 3,
      name: "Muhammad Agil",
      role: "Frontend Developer",
      image: "/Agil.jpg",
      description: "Mengembangkan frontend aplikasi inventaris HIMATIF dengan React dan Tailwind CSS. Spesialis dalam menciptakan pengalaman pengguna yang optimal dan desain yang menarik.",
      skills: ["React", "Tailwind CSS", "JavaScript", "Responsive Design", "Figma", "TypeScript"],
      github: "https://github.com/Muhammadagil00",
      linkedin: "https://linkedin.com",
      email: "muhammadagil1107@gmail.com"
    }
  ];

  const openModal = (contributor) => {
    setSelectedContributor(contributor);
  };

  const closeModal = () => {
    setSelectedContributor(null);
  };

  return (
    <>
      {/* Contributors Section */}
      <div id="contributors" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#096B68]/10 to-[#90D1CA]/10 px-6 py-3 rounded-full border border-[#096B68]/20 mb-6">
            <Users className="w-5 h-5 text-[#096B68]" />
            <span className="text-[#096B68] font-semibold">Tim Pengembang</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Lihat siapa <span className="text-[#90D1CA]">Contributors</span>
          </h2>
          
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Tim yang berdedikasi dalam mengembangkan sistem inventaris HIMATIF untuk kemudahan mahasiswa
          </p>
          
          <div className="flex items-center justify-center mt-6 space-x-2">
            <Heart className="w-5 h-5 text-red-500 animate-pulse" />
            <span className="text-gray-500 text-sm">Made with by ITVENTORY Team</span>
          </div>
        </div>

        {/* Contributors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {contributors.map((contributor, index) => (
            <div
              key={contributor.id}
              className="group bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 cursor-pointer border border-white/50 relative overflow-hidden"
              onClick={() => openModal(contributor)}
              style={{
                animation: `fadeInUp 0.8s ease-out ${index * 0.2}s both`
              }}
            >
              {/* Background Decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#096B68]/5 to-[#90D1CA]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#90D1CA]/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
              
              <div className="relative z-10">
                {/* Profile Image */}
                <div className="relative mb-6 flex justify-center">
                  <div className="relative">
                    {/* Glow effect background */}
                    <div className="absolute inset-0 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-r from-[#096B68]/30 to-[#90D1CA]/30 blur-lg group-hover:blur-xl transition-all duration-500"></div>

                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-500">
                      <img
                        src={contributor.image}
                        alt={contributor.name}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(contributor.name)}&background=096B68&color=ffffff&size=200&bold=true`;
                        }}
                      />
                      {/* Overlay gradient on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#096B68]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* Animated badge */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-[#096B68] to-[#90D1CA] rounded-full flex items-center justify-center shadow-lg group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                      <Code className="w-4 h-4 text-white" />
                    </div>

                    {/* Pulse ring effect */}
                    <div className="absolute inset-0 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#90D1CA]/50 animate-ping opacity-0 group-hover:opacity-75"></div>
                  </div>
                </div>

                {/* Contributor Info */}
                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#096B68] transition-colors duration-300">
                    {contributor.name}
                  </h3>
                  <p className="text-[#90D1CA] font-semibold mb-4 text-sm sm:text-base">
                    {contributor.role}
                  </p>
                  
                  {/* Skills Preview */}
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {contributor.skills.slice(0, 2).map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 bg-gradient-to-r from-[#096B68]/10 to-[#90D1CA]/10 text-[#096B68] text-xs font-medium rounded-full border border-[#096B68]/20"
                      >
                        {skill}
                      </span>
                    ))}
                    {contributor.skills.length > 2 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        +{contributor.skills.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Click to view more */}
                  <div className="text-center">
                    <span className="text-sm text-gray-500 group-hover:text-[#096B68] transition-colors duration-300 font-medium">
                      Click to view profile →
                    </span>
                  </div>
                </div>

                {/* Hover Effect Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#096B68] to-[#90D1CA] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedContributor && (
        <div className="fixed inset-0 z-50 p-4 animate-fadeIn">
          {/* Background Overlay */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={closeModal}></div>
          
          {/* Modal Content */}
          <div className="relative flex items-center justify-center min-h-full">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-white/40 animate-slideUp">
              {/* Modal Header */}
              <div className="relative p-8 bg-gradient-to-r from-[#096B68] to-[#90D1CA] text-white">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors duration-200 p-2 hover:bg-white/20 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/30 shadow-xl">
                    <img
                      src={selectedContributor.image}
                      alt={selectedContributor.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedContributor.name)}&background=096B68&color=ffffff&size=200`;
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{selectedContributor.name}</h3>
                    <p className="text-white/90 text-lg">{selectedContributor.role}</p>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-8 custom-scrollbar max-h-[60vh] overflow-y-auto">
                <div className="space-y-8">
                  {/* Description */}
                  <div className="relative">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-[#096B68] to-[#90D1CA] rounded-full"></div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <div className="w-2 h-2 bg-[#096B68] rounded-full mr-3"></div>
                      About
                    </h4>
                    <p className="text-gray-600 leading-relaxed text-lg pl-5">{selectedContributor.description}</p>
                  </div>

                  {/* Skills */}
                  <div className="relative">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-[#096B68] to-[#90D1CA] rounded-full"></div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <div className="w-2 h-2 bg-[#90D1CA] rounded-full mr-3"></div>
                      Skills & Technologies
                    </h4>
                    <div className="flex flex-wrap gap-3 pl-5">
                      {selectedContributor.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-gradient-to-r from-[#096B68]/10 to-[#90D1CA]/10 text-[#096B68] font-semibold rounded-full border border-[#096B68]/20 hover:scale-105 hover:shadow-lg transition-all duration-300 animate-float"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Links */}
                  <div className="relative">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-[#096B68] to-[#90D1CA] rounded-full"></div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <div className="w-2 h-2 bg-[#096B68] rounded-full mr-3"></div>
                      Connect With Me
                    </h4>
                    <div className="flex flex-wrap gap-4 pl-5">
                      <a
                        href={selectedContributor.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <Github className="w-5 h-5" />
                        <span className="font-semibold">GitHub</span>
                      </a>
                      <a
                        href={selectedContributor.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <Linkedin className="w-5 h-5" />
                        <span className="font-semibold">LinkedIn</span>
                      </a>
                      <a
                        href={`mailto:${selectedContributor.email}`}
                        className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <Mail className="w-5 h-5" />
                        <span className="font-semibold">Email</span>
                      </a>
                    </div>
                  </div>

                  {/* Fun fact or quote section */}
                  <div className="relative bg-gradient-to-r from-[#096B68]/5 to-[#90D1CA]/5 rounded-2xl p-6 border border-[#096B68]/10">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-[#096B68] to-[#90D1CA] rounded-full"></div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#096B68] to-[#90D1CA] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-gray-600 italic text-lg leading-relaxed">
                        "Passionate about creating innovative solutions that make a difference in the HIMATIF community."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(9, 107, 104, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(144, 209, 202, 0.5);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        /* Custom scrollbar for modal */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #096B68 #f1f5f9;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #096B68, #90D1CA);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #085854, #7BC4BD);
        }
      `}</style>
    </>
  );
};

export default ContributorSection;
