import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Search, PlusCircle, Save, X, Trash2, ArrowLeft, Zap, Heart, Dumbbell, Wind, Brain, Lock, Sparkles, BookOpen, Loader2, ExternalLink } from 'lucide-react';

function App() {
  const [characters, setCharacters] = useState([]);
  const [selectedChar, setSelectedChar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStrategy, setFilterStrategy] = useState('All');
  const [showAdmin, setShowAdmin] = useState(false);
  const [umaMusumeId, setUmaMusumeId] = useState('');

  const [newChar, setNewChar] = useState({ 
    name: '', tier: 'S', imageUrl: '', buildDetails: '', strategy: 'Runner', 
    speed: 'Mid', stamina: 'Mid', power: 'Mid', guts: 'Mid', wisdom: 'Mid',
    recommendedSkills: '', skillIcons: '', supportCards: '', cardIcons: '',
    sourceName: 'Game8', sourceUrl: '', gameId: '' 
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const gameRes = await axios.get('http://localhost:3001/games');
      const uma = gameRes.data.find(g => g.slug === 'uma-musume');
      if (uma) {
        setUmaMusumeId(uma.id);
        const charRes = await axios.get(`http://localhost:3001/characters/uma-musume`);
        setCharacters(charRes.data);
      }
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  // Função auxiliar para transformar strings de vírgula em arrays de objetos
  const formatList = (names, icons) => {
    if (!names) return [];
    const nameArr = names.split(',');
    const iconArr = icons ? icons.split(',') : [];
    return nameArr.map((name, i) => ({ name, icon: iconArr[i] || null }));
  };

  if (loading) return <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center text-green-500"><Loader2 className="animate-spin" size={48} /></div>;

  return (
    <div className="min-h-screen bg-[#0b0e14] text-gray-100 font-sans pb-20">
      <nav className="bg-[#121620] border-b border-green-500/20 p-4 sticky top-0 z-50 flex justify-between items-center shadow-2xl">
        <h1 className="text-xl font-black tracking-tighter text-white flex items-center gap-2 uppercase italic cursor-pointer" onClick={() => setSelectedChar(null)}>
          <Trophy className="text-green-500" size={24} /> UMA-Builds
        </h1>
        <button onClick={() => setShowAdmin(!showAdmin)} className="bg-green-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">Admin</button>
      </nav>

      <main className="max-w-6xl mx-auto p-6 md:p-12">
        {!selectedChar ? (
          /* LISTA DE ÍCONES */
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
            {characters.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(char => (
              <div key={char.id} onClick={() => setSelectedChar(char)} className="bg-[#121620] border border-white/5 rounded-3xl p-4 cursor-pointer hover:border-green-500/50 transition-all text-center group shadow-xl">
                <img src={char.imageUrl} alt={char.name} className="w-full aspect-square object-contain mb-4 group-hover:scale-110 transition-all" />
                <h3 className="text-[10px] font-black uppercase tracking-tighter">{char.name}</h3>
              </div>
            ))}
          </div>
        ) : (
          /* DETALHES ESTILO GAME8 */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={() => setSelectedChar(null)} className="text-green-500 mb-8 flex items-center gap-2 font-black uppercase text-[10px]"><ArrowLeft size={16}/> Voltar</button>
            
            <div className="bg-[#121620] border border-white/5 rounded-4xl overflow-hidden flex flex-col lg:flex-row shadow-2xl">
              {/* IMAGEM DA PERSONAGEM */}
              <div className="lg:w-100 bg-[#161b27] p-8 flex items-center justify-center border-r border-white/5">
                <img src={selectedChar.imageUrl} alt={selectedChar.name} className="w-full h-125 object-contain drop-shadow-[0_10px_30px_rgba(34,197,94,0.3)]" />
              </div>

              {/* INFORMAÇÕES TÉCNICAS */}
              <div className="p-10 flex-1">
                <h2 className="text-5xl font-black italic uppercase mb-8 text-white tracking-tighter">{selectedChar.name}</h2>
                
                {/* SKILLS COM ÍCONES */}
                <div className="mb-10">
                  <h4 className="text-green-400 text-[9px] font-black uppercase mb-4 flex items-center gap-2 tracking-widest italic underline decoration-green-500/30">
                    <Sparkles size={14}/> Recommended Skills
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {formatList(selectedChar.recommendedSkills, selectedChar.skillIcons).map((skill, i) => (
                      <div key={i} className="flex items-center gap-3 bg-black/30 border border-white/5 p-2 pr-4 rounded-xl">
                        <img src={skill.icon} alt={skill.name} className="w-10 h-10 rounded-lg bg-black/50" />
                        <span className="text-[10px] font-black uppercase text-gray-300">{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CARDS COM ÍCONES */}
                <div className="mb-10">
                  <h4 className="text-blue-400 text-[9px] font-black uppercase mb-4 flex items-center gap-2 italic tracking-widest underline decoration-blue-500/30">
                    <BookOpen size={14}/> Support Deck
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {formatList(selectedChar.supportCards, selectedChar.cardIcons).map((card, i) => (
                      <div key={i} className="flex items-center gap-3 bg-black/30 border border-white/5 p-2 pr-4 rounded-xl">
                        <img src={card.icon} alt={card.name} className="w-10 h-10 rounded-lg object-cover" />
                        <span className="text-[10px] font-black uppercase text-gray-300">{card.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-500/5 p-8 rounded-3xl border border-green-500/10 mb-6">
                  <p className="text-gray-300 italic text-sm leading-relaxed">"{selectedChar.buildDetails}"</p>
                </div>

                <a href={selectedChar.sourceUrl} target="_blank" rel="noreferrer" className="text-[10px] text-gray-600 font-black uppercase flex items-center gap-2">Game8 Wiki <ExternalLink size={14}/></a>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default App;