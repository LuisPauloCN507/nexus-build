import { useEffect, useState } from 'react';
import axios from 'axios';
import { Gamepad2, Star, ShieldCheck, Loader2, Search, PlusCircle, Save, X, Trash2, ExternalLink, Trophy } from 'lucide-react';

function App() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);
  const [umaMusumeId, setUmaMusumeId] = useState('');

  const [newChar, setNewChar] = useState({ 
    name: '', tier: 'S', imageUrl: '', buildDetails: '', sourceName: 'Game8', sourceUrl: '', gameId: '' 
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Primeiro garantimos que o jogo Uma Musume existe e pegamos o ID dele
      const gameRes = await axios.get('http://localhost:3001/games');
      const uma = gameRes.data.find(g => g.slug === 'uma-musume');
      
      if (uma) {
        setUmaMusumeId(uma.id);
        // 2. Buscamos as waifus vinculadas a esse ID
        const charRes = await axios.get(`http://localhost:3001/characters/uma-musume`);
        setCharacters(charRes.data);
      }
    } catch (err) {
      console.error("Erro na Database UMA-Builds:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChar = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/characters', { ...newChar, gameId: umaMusumeId });
      setNewChar({ ...newChar, name: '', imageUrl: '', buildDetails: '', sourceUrl: '' });
      fetchData();
      alert("Nova Cavalo-Garota registrada!");
    } catch (err) { console.error(err); }
  };

  const deleteChar = async (id) => {
    if (window.confirm("Remover esta build da database?")) {
      try {
        await axios.delete(`http://localhost:3001/characters/${id}`);
        fetchData();
      } catch (err) { console.error(err); }
    }
  };

  const filteredChars = characters.filter(char => 
    char.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center text-green-400 font-sans">
        <Loader2 className="animate-spin mb-4 text-green-500" size={48} />
        <p className="uppercase tracking-[0.5em] text-[10px] font-black italic">Sincronizando UMA-DATABASE...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0e14] text-gray-100 font-sans">
      {/* NAVBAR FOCADA */}
      <nav className="bg-[#121620] border-b border-green-500/20 p-4 sticky top-0 z-50 flex justify-between items-center shadow-2xl">
        <h1 className="text-xl font-black tracking-tighter text-white flex items-center gap-2 uppercase italic">
          <Trophy className="text-green-500" size={24} /> UMA-Builds <span className="text-green-500">.</span>
        </h1>
        <button 
          onClick={() => setShowAdmin(!showAdmin)} 
          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${showAdmin ? 'bg-red-500/20 text-red-400' : 'bg-green-600 text-white hover:bg-green-500'}`}
        >
          {showAdmin ? <X size={14} /> : <PlusCircle size={14} />} {showAdmin ? 'Sair do Painel' : 'Gerenciar Builds'}
        </button>
      </nav>

      <main className="max-w-5xl mx-auto p-6 md:p-12">
        {/* HEADER */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
            <div className="p-4 bg-green-500/10 rounded-3xl border border-green-500/20">
              <img src="https://img.game8.co/3391030/1f4095454b523f03d0023e3519f96b96.png/show" alt="Uma Musume Logo" className="w-20 h-20" />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none mb-2">Treinamento <br/><span className="text-green-500 underline decoration-white/10">de Elite</span></h2>
              <p className="text-gray-500 uppercase text-[10px] tracking-[0.6em] font-bold">Guia de Builds e Tier List Pretty Derby</p>
            </div>
          </div>
          
          <div className="relative w-full group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-green-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="PESQUISAR CAVALO-GAROTA (EX: OGURI CAP)..." 
              className="w-full bg-[#121620] border border-white/5 rounded-2xl py-6 pl-16 pr-8 text-xs font-black focus:outline-none focus:border-green-500/50 transition-all uppercase tracking-widest shadow-inner"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </header>

        {/* PAINEL ADMIN */}
        {showAdmin && (
          <form onSubmit={handleAddChar} className="bg-[#121620] p-10 rounded-4xl border border-green-500/30 mb-16 animate-in slide-in-from-top-5 duration-500 shadow-2xl">
            <h3 className="text-green-500 font-black uppercase text-xs mb-8 flex items-center gap-2 underline">Registrar Nova Atleta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-600 ml-2">Nome da Personagem</label>
                <input type="text" placeholder="Ex: Special Week" className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-sm focus:border-green-500/50 outline-none" value={newChar.name} onChange={e => setNewChar({...newChar, name: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-600 ml-2">Tier (Força)</label>
                <select className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-sm focus:border-green-500/50 outline-none appearance-none" value={newChar.tier} onChange={e => setNewChar({...newChar, tier: e.target.value})}>
                  <option value="SS">TIER SS (Meta)</option>
                  <option value="S">TIER S (Forte)</option>
                  <option value="A">TIER A (Bom)</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-600 ml-2">URL da Imagem</label>
                <input type="text" placeholder="Link da imagem da waifu" className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-sm focus:border-green-500/50 outline-none" value={newChar.imageUrl} onChange={e => setNewChar({...newChar, imageUrl: e.target.value})} required />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-600 ml-2">Detalhes da Estratégia e Build</label>
                <textarea placeholder="Ex: Focar em Power e Stamina. Chaser strategy recomendado para Arima Kinen." className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-sm h-32 focus:border-green-500/50 outline-none" value={newChar.buildDetails} onChange={e => setNewChar({...newChar, buildDetails: e.target.value})} required />
              </div>
            </div>
            <button className="mt-8 w-full bg-green-600 text-white font-black py-5 rounded-2xl uppercase text-xs hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-900/20">
              <Save size={20} /> Salvar na UMA-Database
            </button>
          </form>
        )}

        {/* LISTA DE CARDS */}
        <div className="grid grid-cols-1 gap-10">
          {filteredChars.map(char => (
            <div key={char.id} className="bg-[#121620] border border-white/5 rounded-4xl overflow-hidden flex flex-col md:flex-row relative group hover:border-green-500/40 transition-all duration-500 shadow-2xl">
              {showAdmin && (
                <button onClick={() => deleteChar(char.id)} className="absolute top-6 right-6 p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all z-10 border border-red-500/20">
                  <Trash2 size={20} />
                </button>
              )}
              
              <div className="md:w-80 bg-[#161b27] p-8 flex items-center justify-center border-r border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img src={char.imageUrl} alt={char.name} className="w-full h-72 object-contain group-hover:scale-110 transition-transform duration-700 relative z-10" />
              </div>

              <div className="p-10 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter ${char.tier === 'SS' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-black'}`}>RANK {char.tier}</span>
                  <div className="h-px flex-1 bg-white/5"></div>
                  <ShieldCheck className="text-green-500/40" size={20} />
                </div>
                
                <h3 className="text-4xl font-black italic uppercase mb-6 text-white tracking-tighter group-hover:text-green-400 transition-colors">{char.name}</h3>
                
                <div className="bg-black/40 p-8 rounded-3xl border border-white/5 mb-8 shadow-inner relative">
                  <div className="absolute top-0 left-6 -translate-y-1/2 bg-green-600 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest text-white">Estratégia Recomendada</div>
                  <p className="text-gray-300 italic text-sm leading-relaxed font-medium">"{char.buildDetails}"</p>
                </div>

                <div className="flex justify-between items-center">
                  <a href={char.sourceUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] text-gray-600 hover:text-green-400 transition-colors uppercase font-black tracking-[0.2em]">
                    Consultar Wiki Game8 <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredChars.length === 0 && !loading && (
          <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-4xl opacity-20 uppercase text-xs font-black tracking-[1em]">
            Database Vazia
          </div>
        )}
      </main>
    </div>
  );
}

export default App;