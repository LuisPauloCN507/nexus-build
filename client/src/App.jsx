import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Search, PlusCircle, Save, X, Trash2, ExternalLink, Zap, Heart, Dumbbell, Wind, Brain, Lock, Sparkles, BookOpen, Loader2 } from 'lucide-react';

function App() {
  const [characters, setCharacters] = useState([]);
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
    } catch (err) { console.error("Erro UMA-Database:", err); } 
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

  const deleteChar = async (id) => {
    if (window.confirm("Remover atleta da Database Global?")) {
      try { await axios.delete(`http://localhost:3001/characters/${id}`); fetchData(); } 
      catch (err) { console.error(err); }
    }
  };

  const StatBadge = ({ icon: Icon, label, value }) => (
    <div className="bg-black/40 border border-white/5 p-2 rounded-xl flex flex-col items-center min-w-16.25 transition-all hover:border-green-500/30">
      <Icon size={12} className="text-green-500 mb-1" />
      <span className="text-[7px] font-black uppercase text-gray-500 tracking-tighter">{label}</span>
      <span className={`text-[10px] font-black uppercase ${
        value === 'Max' || value === 'High' ? 'text-green-400' : value === 'Mid' ? 'text-yellow-500' : 'text-gray-600'
      }`}>{value}</span>
    </div>
  );

  const filteredChars = characters.filter(char => 
    char.name.toLowerCase().includes(search.toLowerCase()) && 
    (filterStrategy === 'All' || char.strategy === filterStrategy)
  );

  if (loading) return (
    <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center text-green-500 font-sans">
      <Loader2 className="animate-spin mb-4" size={48} />
      <p className="uppercase tracking-[0.5em] text-[10px] font-black italic">Acessando Database Global...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0e14] text-gray-100 font-sans pb-20">
      {/* NAVBAR */}
      <nav className="bg-[#121620] border-b border-green-500/20 p-4 sticky top-0 z-50 flex justify-between items-center shadow-2xl">
        <h1 className="text-xl font-black tracking-tighter text-white flex items-center gap-2 uppercase italic cursor-pointer" onClick={() => window.location.reload()}>
          <Trophy className="text-green-500" size={24} /> UMA-Builds 
          <span className="ml-3 bg-red-600 text-[8px] not-italic px-2 py-1 rounded-full animate-pulse font-black">VERSÃO 2.0</span>
        </h1>
        <button onClick={toggleAdmin} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${showAdmin ? 'bg-red-500/20 text-red-400 border border-red-500/10' : 'bg-green-600 text-white hover:bg-green-500'}`}>
          {showAdmin ? <X size={14} /> : <Lock size={14} />} {showAdmin ? 'Fechar' : 'Admin'}
        </button>
      </nav>

      <main className="max-w-6xl mx-auto p-6 md:p-12">
        <header className="mb-12">
          <input 
            type="text" placeholder="PESQUISAR CAVALO-GAROTA (EX: SILENCE SUZUKA)..." 
            className="w-full bg-[#121620] border border-white/5 rounded-2xl py-6 px-8 text-xs font-black focus:border-green-500/50 outline-none uppercase tracking-widest shadow-inner mb-8 transition-all"
            value={search} onChange={e => setSearch(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {strategies.map(s => (
              <button key={s} onClick={() => setFilterStrategy(s)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase border transition-all ${filterStrategy === s ? 'bg-green-500 text-black border-green-500 shadow-lg shadow-green-500/20' : 'bg-transparent border-white/10 text-gray-500 hover:border-white/30'}`}>
                {s}
              </button>
            ))}
          </div>
        </header>

        {/* ADMIN FORM */}
        <AnimatePresence>
          {showAdmin && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddChar} className="bg-[#121620] p-10 rounded-4xl border border-green-500/30 mb-16 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden shadow-2xl"
            >
              <h3 className="text-green-500 font-black uppercase text-xs mb-4 md:col-span-2 flex items-center gap-2 underline tracking-widest">
                <PlusCircle size={16}/> Cadastrar Novo Guia de Elite
              </h3>
              <input type="text" placeholder="Nome da Atleta" className="bg-black/40 border border-white/5 rounded-xl p-4 text-sm focus:border-green-500 outline-none" value={newChar.name} onChange={e => setNewChar({...newChar, name: e.target.value})} required />
              <div className="grid grid-cols-2 gap-4">
                <select className="bg-black/40 border border-white/5 rounded-xl p-4 text-sm outline-none" value={newChar.tier} onChange={e => setNewChar({...newChar, tier: e.target.value})}>
                  <option value="SS">TIER SS</option><option value="S">TIER S</option><option value="A">TIER A</option>
                </select>
                <select className="bg-black/40 border border-white/5 rounded-xl p-4 text-sm outline-none" value={newChar.strategy} onChange={e => setNewChar({...newChar, strategy: e.target.value})}>
                  {strategies.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <input type="text" placeholder="URL da Foto (PNG Preferencial)" className="md:col-span-2 bg-black/40 border border-white/5 rounded-xl p-4 text-sm focus:border-green-500 outline-none" value={newChar.imageUrl} onChange={e => setNewChar({...newChar, imageUrl: e.target.value})} required />
              
              <div className="md:col-span-2 grid grid-cols-5 gap-3">
                {['speed', 'stamina', 'power', 'guts', 'wisdom'].map(stat => (
                  <div key={stat} className="flex flex-col gap-2">
                    <label className="text-[8px] font-black uppercase text-gray-600 ml-1">{stat}</label>
                    <select className="bg-black/40 border border-white/5 rounded-xl p-2 text-[10px]" value={newChar[stat]} onChange={e => setNewChar({...newChar, [stat]: e.target.value})}>
                      {statLevels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <input type="text" placeholder="Skills Recomendadas (separadas por vírgula)" className="bg-black/40 border border-white/5 rounded-xl p-4 text-sm focus:border-green-500 outline-none" value={newChar.recommendedSkills} onChange={e => setNewChar({...newChar, recommendedSkills: e.target.value})} />
              <input type="text" placeholder="Support Cards (SSR/SR)" className="bg-black/40 border border-white/5 rounded-xl p-4 text-sm focus:border-green-500 outline-none" value={newChar.supportCards} onChange={e => setNewChar({...newChar, supportCards: e.target.value})} />
              
              <textarea placeholder="Detalhes Técnicos do Treinamento" className="md:col-span-2 bg-black/40 border border-white/5 rounded-xl p-4 text-sm h-24 focus:border-green-500 outline-none" value={newChar.buildDetails} onChange={e => setNewChar({...newChar, buildDetails: e.target.value})} required />
              <button className="md:col-span-2 bg-green-600 text-white font-black py-4 rounded-xl uppercase text-xs hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/20">
                <Save size={18}/> Salvar Guia na UMA-DATABASE
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* LISTAGEM - LAYOUT LADO A LADO */}
        <div className="grid grid-cols-1 gap-12">
          {filteredChars.map(char => (
            <motion.div layout key={char.id} className="bg-[#121620] border border-white/5 rounded-4xl overflow-hidden flex flex-col lg:flex-row relative group hover:border-green-500/30 transition-all shadow-2xl">
              {showAdmin && (
                <button onClick={() => deleteChar(char.id)} className="absolute top-6 right-6 p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all z-10 shadow-lg border border-red-500/20">
                  <Trash2 size={18} />
                </button>
              )}
              
              {/* LADO ESQUERDO: IMAGEM FIXA (RESOLVIDO: lg:w-100) */}
              <div className="lg:w-100 bg-[#161b27] p-8 flex items-center justify-center border-r border-white/5 shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img src={char.imageUrl} alt={char.name} className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-700 relative z-10" />
              </div>

              {/* LADO DIREITO: TUDO O RESTO */}
              <div className="p-10 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase ${char.tier === 'SS' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-black'}`}>RANK {char.tier}</span>
                  <span className="border border-green-500/30 text-green-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">{char.strategy}</span>
                  <div className="h-px flex-1 bg-white/5"></div>
                </div>
                
                <h3 className="text-4xl font-black italic uppercase mb-8 text-white tracking-tighter group-hover:text-green-400 transition-colors">{char.name}</h3>
                
                {/* STATUS */}
                <div className="grid grid-cols-5 gap-3 mb-10">
                  <StatBadge icon={Zap} label="SPD" value={char.speed} />
                  <StatBadge icon={Heart} label="STA" value={char.stamina} />
                  <StatBadge icon={Dumbbell} label="POW" value={char.power} />
                  <StatBadge icon={Wind} label="GUT" value={char.guts} />
                  <StatBadge icon={Brain} label="WIS" value={char.wisdom} />
                </div>

                {/* SKILLS E CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div className="bg-black/30 p-5 rounded-2xl border border-white/5 shadow-inner">
                    <h4 className="text-green-400 text-[9px] font-black uppercase mb-3 flex items-center gap-2 tracking-widest italic"><Sparkles size={12}/> Recommended Skills</h4>
                    <p className="text-gray-400 text-xs leading-relaxed font-medium">{char.recommendedSkills || "Consultar Wiki Game8..."}</p>
                  </div>
                  <div className="bg-black/30 p-5 rounded-2xl border border-white/5 shadow-inner">
                    <h4 className="text-blue-400 text-[9px] font-black uppercase mb-3 flex items-center gap-2 tracking-widest italic"><BookOpen size={12}/> Support Cards</h4>
                    <p className="text-gray-400 text-xs leading-relaxed font-medium">{char.supportCards || "Consultar Wiki Game8..."}</p>
                  </div>
                </div>

                <div className="bg-green-500/5 p-6 rounded-2xl border border-green-500/10 mb-8 relative">
                  <div className="absolute top-0 left-6 -translate-y-1/2 bg-green-600 text-[8px] font-black px-3 py-1 rounded-full uppercase text-white">Notas do Treinador</div>
                  <p className="text-gray-300 italic text-sm leading-relaxed">"{char.buildDetails}"</p>
                </div>

                <a href={char.sourceUrl} target="_blank" rel="noreferrer" className="text-[10px] text-gray-600 hover:text-green-400 font-black uppercase tracking-widest flex items-center gap-2 transition-colors">
                  Wiki Oficial Game8 <ExternalLink size={14} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;