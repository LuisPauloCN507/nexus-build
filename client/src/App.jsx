
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
    recommendedSkills: '', supportCards: '', sourceName: 'Game8', sourceUrl: '', gameId: '' 
  });

  const strategies = ['All', 'Runner', 'Leader', 'Betweener', 'Chaser'];
  const statLevels = ['Max', 'High', 'Mid', 'Low'];

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
    } catch (err) { console.error("Erro Database:", err); } 
    finally { setLoading(false); }
  };

  const toggleAdmin = () => {
    if (!showAdmin) {
      const pass = prompt("Senha do Treinador:");
      if (pass === 'uma123') setShowAdmin(true);
    } else setShowAdmin(false);
  };

  const handleAddChar = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/characters', { ...newChar, gameId: umaMusumeId });
      setNewChar({ ...newChar, name: '', imageUrl: '', buildDetails: '', recommendedSkills: '', supportCards: '', sourceUrl: '' });
      setShowAdmin(false);
      fetchData();
    } catch (err) { console.error(err); }
  };

  const deleteChar = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Remover atleta?")) {
      try { await axios.delete(`http://localhost:3001/characters/${id}`); fetchData(); } 
      catch (err) { console.error(err); }
    }
  };

  const filteredChars = characters.filter(char => 
    char.name.toLowerCase().includes(search.toLowerCase()) && 
    (filterStrategy === 'All' || char.strategy === filterStrategy)
  );

  const StatBadge = ({ icon: Icon, label, value }) => (
    <div className="bg-black/40 border border-white/5 p-2 rounded-xl flex flex-col items-center min-w-16.25">
      <Icon size={14} className="text-green-500 mb-1" />
      <span className="text-[7px] font-black uppercase text-gray-500 tracking-widest">{label}</span>
      <span className={`text-[10px] font-black uppercase ${
        value === 'Max' || value === 'High' ? 'text-green-400' : value === 'Mid' ? 'text-yellow-500' : 'text-gray-400'
      }`}>{value}</span>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center text-green-500">
      <Loader2 className="animate-spin mb-4" size={48} />
      <p className="uppercase tracking-[0.5em] text-[10px] font-black italic">Sincronizando Database...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0e14] text-gray-100 font-sans pb-20">
      {/* NAVBAR */}
      <nav className="bg-[#121620] border-b border-green-500/20 p-4 sticky top-0 z-50 flex justify-between items-center shadow-2xl">
        <h1 className="text-xl font-black tracking-tighter text-white flex items-center gap-2 uppercase italic cursor-pointer" 
            onClick={() => setSelectedChar(null)}>
          <Trophy className="text-green-500" size={24} /> UMA-Builds <span className="text-[8px] not-italic font-black bg-green-500 text-black px-2 py-0.5 rounded-full ml-2">PRO</span>
        </h1>
        <button onClick={toggleAdmin} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${showAdmin ? 'bg-red-500/20 text-red-400 border border-red-500/10' : 'bg-green-600 text-white hover:bg-green-500'}`}>
          {showAdmin ? <X size={14} /> : <Lock size={14} />} Admin
        </button>
      </nav>

      <main className="max-w-6xl mx-auto p-6 md:p-12">
        
        {/* VIEW 1: SELEÇÃO DE ÍCONES */}
        {!selectedChar ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <header className="mb-12">
              <h2 className="text-3xl font-black uppercase italic mb-8 border-l-4 border-green-500 pl-4">Database Global</h2>
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="text" placeholder="PESQUISAR NOME..." 
                    className="w-full bg-[#121620] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-xs font-black focus:border-green-500/50 outline-none uppercase tracking-widest shadow-inner transition-all"
                    value={search} onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  {strategies.map(s => (
                    <button key={s} onClick={() => setFilterStrategy(s)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase border transition-all ${filterStrategy === s ? 'bg-green-500 text-black border-green-500' : 'bg-transparent border-white/10 text-gray-500 hover:border-white/30'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </header>

            {/* GRID DE ÍCONES */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {filteredChars.map(char => (
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5 }}
                  key={char.id} 
                  onClick={() => { setSelectedChar(char); window.scrollTo(0,0); }}
                  className="bg-[#121620] border border-white/5 rounded-3xl p-4 cursor-pointer hover:border-green-500/50 transition-all flex flex-col items-center group relative overflow-hidden shadow-xl"
                >
                  <div className="w-full aspect-square bg-[#161b27] rounded-2xl mb-4 overflow-hidden flex items-center justify-center">
                    <img src={char.imageUrl} alt={char.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="text-[10px] font-black uppercase text-center tracking-tighter text-gray-300 group-hover:text-green-400 transition-colors">{char.name}</h3>
                  <span className="text-[8px] font-bold text-gray-600 mt-1 uppercase italic">{char.strategy}</span>
                  
                  {showAdmin && (
                    <button onClick={(e) => deleteChar(char.id, e)} className="absolute top-2 right-2 p-1.5 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white z-10">
                      <Trash2 size={12} />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          
          /* VIEW 2: GUIA DETALHADO (SIDE-BY-SIDE) */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button 
              onClick={() => setSelectedChar(null)}
              className="flex items-center gap-2 text-green-500 mb-8 uppercase text-[10px] font-black hover:text-white transition-colors"
            >
              <ArrowLeft size={16} /> Voltar para Seleção
            </button>

            <div className="bg-[#121620] border border-white/5 rounded-4xl overflow-hidden flex flex-col lg:flex-row shadow-2xl relative">
              
              {/* LADO ESQUERDO: IMAGEM GRANDE (RESOLVIDO: lg:w-100) */}
              <div className="lg:w-100 bg-[#161b27] p-8 flex items-center justify-center border-r border-white/5 shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-green-500/5 opacity-30 blur-3xl rounded-full"></div>
                <motion.img 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src={selectedChar.imageUrl} alt={selectedChar.name} 
                  className="w-full h-125 object-contain relative z-10 drop-shadow-[0_10px_30px_rgba(34,197,94,0.3)]" 
                />
              </div>

              {/* LADO DIREITO: INFORMAÇÕES TÉCNICAS */}
              <div className="p-10 flex-1 flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase ${selectedChar.tier === 'SS' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-black'}`}>RANK {selectedChar.tier}</span>
                  <span className="border border-green-500/30 text-green-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">{selectedChar.strategy}</span>
                  <div className="h-px flex-1 bg-white/5"></div>
                </div>
                
                <h2 className="text-5xl font-black italic uppercase mb-8 text-white tracking-tighter leading-none group-hover:text-green-400 transition-colors">
                  {selectedChar.name}
                </h2>
                
                {/* STATUS GRID */}
                <div className="grid grid-cols-5 gap-3 mb-10">
                  <StatBadge icon={Zap} label="SPD" value={selectedChar.speed} />
                  <StatBadge icon={Heart} label="STA" value={selectedChar.stamina} />
                  <StatBadge icon={Dumbbell} label="POW" value={selectedChar.power} />
                  <StatBadge icon={Wind} label="GUT" value={selectedChar.guts} />
                  <StatBadge icon={Brain} label="WIS" value={selectedChar.wisdom} />
                </div>

                {/* SKILLS E CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div className="bg-black/30 p-6 rounded-3xl border border-white/5 shadow-inner">
                    <h4 className="text-green-400 text-[9px] font-black uppercase mb-4 flex items-center gap-2 italic tracking-widest underline decoration-green-500/30"><Sparkles size={14}/> Potential Skills</h4>
                    <p className="text-gray-400 text-xs leading-relaxed font-medium whitespace-pre-line">
                      {selectedChar.recommendedSkills?.split(',').join('\n') || "Nenhuma skill sugerida."}
                    </p>
                  </div>
                  <div className="bg-black/30 p-6 rounded-3xl border border-white/5 shadow-inner">
                    <h4 className="text-blue-400 text-[9px] font-black uppercase mb-4 flex items-center gap-2 italic tracking-widest underline decoration-blue-500/30"><BookOpen size={14}/> Support Deck</h4>
                    <p className="text-gray-400 text-xs leading-relaxed font-medium whitespace-pre-line">
                      {selectedChar.supportCards?.split(',').join('\n') || "Consultar Support Gacha..."}
                    </p>
                  </div>
                </div>

                <div className="bg-green-500/5 p-8 rounded-3xl border border-green-500/10 mb-10 relative">
                  <div className="absolute top-0 left-8 -translate-y-1/2 bg-green-600 text-[8px] font-black px-3 py-1 rounded-full uppercase text-white tracking-widest">Build Strategy</div>
                  <p className="text-gray-300 italic text-sm leading-relaxed font-medium">"{selectedChar.buildDetails}"</p>
                </div>

                <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
                  <a href={selectedChar.sourceUrl} target="_blank" rel="noreferrer" className="text-[10px] text-gray-600 hover:text-green-400 font-black uppercase tracking-widest flex items-center gap-2 transition-colors">
                    Game8 Wiki Original <ExternalLink size={14} />
                  </a>
                  <p className="text-[10px] text-gray-800 font-black uppercase tracking-tighter">UMA-Builds v2.0</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default App;