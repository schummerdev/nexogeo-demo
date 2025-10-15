import React, { useState, useEffect } from 'react';

// Visão de Configuração do Jogo (Gerenciar Patrocinadores e Produtos)
const SetupView = ({ actions, loading }) => {
    const [sponsors, setSponsors] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedSponsor, setSelectedSponsor] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null); // null ou o objeto do produto

    // Carrega os patrocinadores iniciais
    useEffect(() => {
        const loadSponsors = async () => {
            const sponsorData = await actions.fetchSponsors();
            if(sponsorData) setSponsors(sponsorData);
        };
        loadSponsors();
    }, [actions]);

    // Carrega os produtos quando um patrocinador é selecionado
    useEffect(() => {
        if (selectedSponsor) {
            const loadProducts = async () => {
                const productData = await actions.fetchProductsBySponsor(selectedSponsor.id);
                if(productData) setProducts(productData);
            };
            loadProducts();
        }
    }, [selectedSponsor, actions]);

    const handleStartGame = (productId) => {
        if (window.confirm('Tem certeza que deseja iniciar o jogo com este produto?')) {
            actions.startGame(productId);
        }
    };

    const handleGenerateClues = async () => {
        if (!editingProduct || !editingProduct.name) {
            alert('Por favor, insira um nome para o produto primeiro.');
            return;
        }
        const result = await actions.generateClues(editingProduct.name);
        if (result && result.clues) {
            setEditingProduct(p => ({ ...p, clues: result.clues }));
        }
    };

    // Renderização (simplificada com estilos inline para portabilidade)
    return (
        <div>
            <h2 style={styles.h2}>1. Gerenciar Patrocinadores</h2>
            {/* ... UI para listar e adicionar patrocinadores ... */}
            <div style={styles.listContainer}>
                {sponsors.map(sponsor => (
                    <div key={sponsor.id} onClick={() => setSelectedSponsor(sponsor)} style={styles.listItem(selectedSponsor?.id === sponsor.id)}>
                        {sponsor.name}
                    </div>
                ))}
            </div>

            {selectedSponsor && (
                <div style={{marginTop: '2rem'}}>
                    <h2 style={styles.h2}>2. Gerenciar Produtos de "{selectedSponsor.name}"</h2>
                    <div style={styles.listContainer}>
                        {products.map(product => (
                            <div key={product.id} style={styles.listItem(false)}>
                                <span>{product.name} ({product.clues?.length || 0}/5 dicas)</span>
                                <div>
                                    <button onClick={() => setEditingProduct(product)} style={styles.button.secondary}>Editar</button>
                                    <button onClick={() => handleStartGame(product.id)} style={styles.button.primary} disabled={product.clues?.length < 5}>▶ Iniciar Jogo</button>
                                </div>
                            </div>
                        ))}
                         <button onClick={() => setEditingProduct({ sponsor_id: selectedSponsor.id, name: '', clues: Array(5).fill('') })} style={{...styles.button.primary, width: '100%'}}>+ Adicionar Novo Produto</button>
                    </div>
                </div>
            )}

            {editingProduct && (
                <div style={{marginTop: '2rem', background: '#1F2937', padding: '2rem', borderRadius: '0.75rem'}}>
                    <h3 style={styles.h3}>{editingProduct.id ? 'Editar Produto' : 'Novo Produto'}</h3>
                    <input 
                        type="text" 
                        placeholder="Nome do Produto"
                        value={editingProduct.name}
                        onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                        style={styles.input}
                    />
                    <h4 style={{marginTop: '1rem'}}>Dicas:</h4>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                        {editingProduct.clues.map((clue, index) => (
                            <input 
                                key={index} 
                                type="text" 
                                placeholder={`Dica ${index + 1}`}
                                value={clue}
                                onChange={e => {
                                    const newClues = [...editingProduct.clues];
                                    newClues[index] = e.target.value;
                                    setEditingProduct({...editingProduct, clues: newClues});
                                }}
                                style={styles.input}
                            />
                        ))}
                    </div>
                    <div style={{display: 'flex', gap: '1rem', marginTop: '1.5rem'}}>
                        <button onClick={handleGenerateClues} style={styles.button.secondary} disabled={loading}>{loading ? 'Gerando...' : 'Gerar Dicas com IA'}</button>
                        <button style={styles.button.primary} disabled={loading}>{loading ? 'Salvando...' : 'Salvar Produto'}</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Estilos
const styles = {
    h2: { fontSize: '1.5rem', fontWeight: '600', color: '#D1D5DB', borderBottom: '1px solid #374151', paddingBottom: '0.5rem' },
    h3: { fontSize: '1.25rem', fontWeight: '600', color: '#D1D5DB', marginBottom: '1rem' },
    listContainer: { display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' },
    listItem: (isSelected) => ({
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        background: isSelected ? '#4B5563' : '#374151', 
        padding: '1rem', borderRadius: '0.5rem', cursor: 'pointer', 
        border: isSelected ? '2px solid #6D28D9' : '2px solid transparent'
    }),
    button: {
        primary: { background: '#6D28D9', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer' },
        secondary: { background: '#4B5563', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer' },
    },
    input: { width: '100%', background: '#111827', border: '1px solid #4B5563', borderRadius: '0.5rem', padding: '0.75rem', color: 'white', boxSizing: 'border-box' }
};

export default SetupView;
