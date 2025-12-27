import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion'; // Novo: Animações
import { Gamepad2, Star, ShieldCheck, Loader2, Search, PlusCircle, Save, X, Trash2, ExternalLink, Trophy, Filter, Zap, Heart, Dumbbell, Wind, Brain, Lock } from 'lucide-react';

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
    sourceName: 'Game8', sourceUrl: '', gameId: '' 
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

  // FUNÇÃO COM SENHA PARA O ADMIN
  const toggleAdmin = () => {
    if (!showAdmin) {
      const password = prompt("Digite a senha de Treinador:");
      if (password === 'uma123') { // Você pode mudar a senha aqui
        setShowAdmin(true);
      } else {
        alert("Acesso negado! Apenas treinadores autorizados.");
      }
    } else {
      setShowAdmin(false);
    }
  };

  const handleAddChar = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/characters', { ...newChar, gameId: umaMusumeId });
      setNewChar({ ...newChar, name: '', imageUrl: '', buildDetails: '', sourceUrl: '' });
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

  const filteredChars = characters.filter(char => {
    const matchesSearch = char.name.toLowerCase().includes(search.toLowerCase());
    const matchesStrategy = filterStrategy === 'All' || char.strategy === filterStrategy;
    return matchesSearch && matchesStrategy;
  });

  const StatBadge = ({ icon: Icon, label, value }) => (
    <div className="bg-black/40 border border-white/5 p-2 rounded-xl flex flex-col items-center min-w-16.25 transition-all hover:border-green-500/30">
      <Icon size={12} className="text-green-500 mb-1" />
      <span className="text-[8px] font-black uppercase text-gray-500 tracking-tighter">{label}</span>
      <span className={`text-[10px] font-black uppercase ${
        value === 'Max' || value === 'High' ? 'text-green-400' : value === 'Mid' ? 'text-yellow-500' : 'text-gray-600'
      }`}>{value}</span>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center text-green-500 font-sans">
      <Loader2 className="animate-spin mb-4" size={48} />
      <p className="uppercase tracking-[0.5em] text-[10px] font-black italic">Sincronizando UMA-DATABASE...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0e14] text-gray-100 font-sans">
      <nav className="bg-[#121620] border-b border-green-500/20 p-4 sticky top-0 z-50 flex justify-between items-center shadow-2xl">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-black tracking-tighter text-white flex items-center gap-2 uppercase italic cursor-pointer" 
          onClick={() => window.location.reload()}
        >
          <Trophy className="text-green-500" size={24} /> UMA-Builds
        </motion.h1>
        <button onClick={toggleAdmin} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${showAdmin ? 'bg-red-500/20 text-red-400' : 'bg-green-600 text-white'}`}>
          {showAdmin ? <X size={14} /> : <Lock size={14} />} {showAdmin ? 'Fechar' : 'Admin'}
        </button>
      </nav>

      <main className="max-w-5xl mx-auto p-6 md:p-12">
        <header className="mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative mb-8 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-green-500" size={20} />
            <input type="text" placeholder="PESQUISAR CAVALO-GAROTA..." className="w-full bg-[#121620] border border-white/5 rounded-2xl py-6 pl-16 pr-8 text-xs font-black focus:outline-none focus:border-green-500/50 uppercase tracking-widest" value={search} onChange={e => setSearch(e.target.value)} />
          </motion.div>

          <div className="flex flex-wrap gap-2 items-center">
            <Filter size={14} className="text-green-500 mr-2" />
            {strategies.map((s, idx) => (
              <motion.button 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: idx * 0.1 }}
                key={s} 
                onClick={() => setFilterStrategy(s)} 
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase border transition-all ${filterStrategy === s ? 'bg-green-500 text-black border-green-500 shadow-lg shadow-green-500/20' : 'bg-transparent border-white/10 text-gray-500 hover:border-white/30'}`}
              >
                {s}
              </motion.button>
            ))}
          </div>
        </header>

        <AnimatePresence>
          {showAdmin && (
            <motion.form 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleAddChar} 
              className="bg-[#121620] p-10 rounded-4xl border border-green-500/30 mb-16 shadow-2xl overflow-hidden"
            >
              <h3 className="text-green-500 font-black uppercase text-xs mb-8 flex items-center gap-2 underline">Novo Registro</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" placeholder="Nome" className="bg-black/40 border border-white/5 rounded-xl p-4 text-sm outline-none focus:border-green-500" value={newChar.name} onChange={e => setNewChar({...newChar, name: e.target.value})} required />
                <div className="grid grid-cols-2 gap-4">
                  <select className="bg-black/40 border border-white/5 rounded-xl p-4 text-sm" value={newChar.tier} onChange={e => setNewChar({...newChar, tier: e.target.value})}>
                    <option value="SS">TIER SS</option><option value="S">TIER S</option><option value="A">TIER A</option>
                  </select>
                  <select className="bg-black/40 border border-white/5 rounded-xl p-4 text-sm" value={newChar.strategy} onChange={e => setNewChar({...newChar, strategy: e.target.value})}>
                    {strategies.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <input type="text" placeholder="URL Foto" className="md:col-span-2 bg-black/40 border border-white/5 rounded-xl p-4 text-sm outline-none focus:border-green-500" value={newChar.imageUrl} onChange={e => setNewChar({...newChar, imageUrl: e.target.value})} required />
                <div className="md:col-span-2 grid grid-cols-5 gap-3">
                  {['speed', 'stamina', 'power', 'guts', 'wisdom'].map(stat => (
                    <div key={stat} className="flex flex-col gap-2">
                      <label className="text-[8px] font-black uppercase text-gray-600 ml-1 italic">{stat}</label>
                      <select className="bg-black/40 border border-white/5 rounded-xl p-2 text-[10px]" value={newChar[stat]} onChange={e => setNewChar({...newChar, [stat]: e.target.value})}>
                        {statLevels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <textarea placeholder="Manual de Treino" className="md:col-span-2 bg-black/40 border border-white/5 rounded-xl p-4 text-sm h-32 outline-none focus:border-green-500" value={newChar.buildDetails} onChange={e => setNewChar({...newChar, buildDetails: e.target.value})} required />
              </div>
              <button className="mt-8 w-full bg-green-600 text-white font-black py-5 rounded-2xl uppercase text-xs hover:bg-white hover:text-black transition-all">
                <Save size={18} className="inline mr-2" /> Salvar Atleta
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <motion.div layout className="grid grid-cols-1 gap-10">
          {filteredChars.map(char => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              key={char.id} 
              className="bg-[#121620] border border-white/5 rounded-4xl overflow-hidden flex flex-col md:flex-row relative group hover:border-green-500/40 transition-all shadow-2xl"
            >
              {showAdmin && (
                <button onClick={() => deleteChar(char.id)} className="absolute top-6 right-6 p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 transition-all z-10 shadow-lg"><Trash2 size={20} /></button>
              )}
              <div className="md:w-80 bg-[#161b27] p-8 flex items-center justify-center border-r border-white/5 overflow-hidden">
                <motion.img whileHover={{ scale: 1.1 }} src={char.imageUrl} alt={char.name} className="w-full h-72 object-contain relative z-10" />
              </div>
              <div className="p-10 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase ${char.tier === 'SS' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-black'}`}>RANK {char.tier}</span>
                  <span className="border border-green-500/30 text-green-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">{char.strategy}</span>
                </div>
                <h3 className="text-4xl font-black italic uppercase mb-6 text-white tracking-tighter group-hover:text-green-400 transition-colors">{char.name}</h3>
                <div className="grid grid-cols-5 gap-3 mb-8">
                  <StatBadge icon={Zap} label="Speed" value={char.speed} />
                  <StatBadge icon={Heart} label="Stamina" value={char.stamina} />
                  <StatBadge icon={Dumbbell} label="Power" value={char.power} />
                  <StatBadge icon={Wind} label="Guts" value={char.guts} />
                  <StatBadge icon={Brain} label="Wisdom" value={char.wisdom} />
                </div>
                <div className="bg-black/40 p-6 rounded-3xl border border-white/5 shadow-inner">
                  <p className="text-gray-300 italic text-sm leading-relaxed font-medium">"{char.buildDetails}"</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}

export default App;